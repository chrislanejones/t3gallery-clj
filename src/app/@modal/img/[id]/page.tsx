import { Modal } from "./modal";
import { FullPageImageView } from "~/common/full-page-image-view";

export default function PhotoModal({
  params: { id: photoId },
}: {
  params: { id: string };
}) {
  const isAsNumber = Number(photoId);
  if (Number.isNaN(isAsNumber)) throw new Error("Invaild photo id");

  return (
    <Modal>
      <FullPageImageView id={isAsNumber} />
    </Modal>
  );
}
