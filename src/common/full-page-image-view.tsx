import { clerkClient } from "@clerk/nextjs/server";
import { getImage } from "~/server/queries";

export async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);

  const uploaderInfo = await clerkClient.users.getUser(image.userId);
  return (
    <div className="flex h-full w-full min-w-0 text-white">
      <div className="flex flex-shrink items-center justify-center">
        <img src={image.url} className="flex-shrink object-contain" />
      </div>
      <div className="flex-shink-0 flex w-48 flex-col border-l">
        <div className="border-b p-4 text-center text-lg">{image.name}</div>
        <div className="flex flex-col p-3">
          <span>Uploaded By:</span>
          {uploaderInfo.fullName}
        </div>
        <div className="flex flex-col p-3">
          <span>Created On:</span>
          {new Date(image.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
