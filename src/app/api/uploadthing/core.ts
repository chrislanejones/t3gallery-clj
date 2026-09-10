import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 40 } })
    // This middleware is the authorisation boundary for uploads: it runs on our
    // server before UploadThing issues a presigned URL. Everything it returns is
    // signed by UploadThing and echoed back to onUploadComplete, so `userId` here
    // cannot be forged by the client.
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new UploadThingError("Unauthorized");

      const client = await clerkClient();
      const fullUserData = await client.users.getUser(userId);

      if (fullUserData?.privateMetadata?.["can-upload"] !== true)
        throw new UploadThingError("User Does Not Have Upload Permissions");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(images).values({
        name: file.name,
        // `file.url` is deprecated in uploadthing v7 and removed in v8.
        url: file.ufsUrl,
        userId: metadata.userId,
      });

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
