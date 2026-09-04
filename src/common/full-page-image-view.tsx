import { clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";
import { deleteImage, getImage, parseImageId } from "~/server/queries";

export async function FullPageImageView(props: { photoId: string }) {
  // Strict parse: a malformed id is a 404, not an unhandled 500 with a stack digest.
  const idAsNumber = parseImageId(props.photoId);

  // getImage is scoped to the signed-in owner, so `image.userId` is always the
  // current user — no other account's profile is ever fetched here.
  const image = await getImage(idAsNumber);

  const userInfo = await clerkClient.users.getUser(image.userId);

  return (
    <div className="flex h-full w-screen min-w-0 items-center justify-center text-white">
      <div className="flex-shrink flex-grow">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.url} className="object-contain" alt={image.name} />
      </div>
      <div className="flex h-full w-56 flex-shrink-0 flex-col border-l">
        <div className="border-b p-2 text-center text-xl">{image.name}</div>

        <div className="p-2">
          <div>Uploaded By:</div>
          <div>{userInfo.fullName}</div>
        </div>

        <div className="p-2">
          <div>Created On:</div>
          <div>{image.createdAt.toLocaleDateString()}</div>
        </div>

        <div className="p-2">
          <form
            action={async () => {
              "use server";

              await deleteImage(idAsNumber);
            }}
          >
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
