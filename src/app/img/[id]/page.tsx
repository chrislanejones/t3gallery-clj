import { FullPageImageView } from "~/components/full-page-image-view";

export default function PhotoPage({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const isAsNumber = Number(photoId);
  if (Number.isNaN(isAsNumber)) throw new Error("Invaild photo id");

  return <FullPageImageView id={isAsNumber} />;
}
