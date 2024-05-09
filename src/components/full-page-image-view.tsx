import { getImage } from "~/server/queries";

export async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);
  return (
    <div className="flex h-full w-full min-w-0 bg-green-500">
      <div className="flex-shrink">
        <img src={image.url} className="flex-shrink object-contain" />
      </div>
      <div className="flex-shink-0 flex w-48 flex-col">
        <div className="p-2 text-xl font-bold">{image.name}</div>
      </div>
    </div>
  );
}
