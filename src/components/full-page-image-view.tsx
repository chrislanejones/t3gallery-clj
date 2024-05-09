import { clerkClient } from "@clerk/nextjs/server";
import { getImage } from "~/server/queries";

export async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);

  const uploaderInfo = await clerkClient.users.getUser(image.userId);
  return (
    <div className="flex h-full w-full min-w-0">
      <div className="flex flex-shrink items-center justify-center">
        <img src={image.url} className="flex-shrink object-contain" />
      </div>
      <div className="flex-shink-0 w-100 flex flex-col gap-2 border-l">
        <div className="border-b p-2 text-center text-lg">{image.name}</div>
        <div className="flex flex-col p-2 text-center">
          <span>Uploaded By:</span>
          {uploaderInfo.fullName}
        </div>
      </div>
    </div>
  );
}
