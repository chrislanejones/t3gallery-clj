import { Modal } from "./modal";
import { FullPageImageView } from "~/common/full-page-image-view";

export default async function PhotoModal(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: photoId } = await props.params;

  return (
    <Modal>
      <FullPageImageView photoId={photoId} />
    </Modal>
  );
}
