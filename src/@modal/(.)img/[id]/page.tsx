import { getImage } from "~/server/queries";

export default async function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const isAsNumber = Number(photoId);
  if (Number.isNaN(isAsNumber)) throw new Error("Invaild photo id");

  const image = await getImage(isAsNumber);
  return (
    <div>
      <img src={image.url} alt="thumbanil" className="w-96" />
    </div>
  );
}
