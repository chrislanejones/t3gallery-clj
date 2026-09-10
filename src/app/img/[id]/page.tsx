import { FullPageImageView } from "~/common/full-page-image-view";

export default async function PhotoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id: photoId } = await props.params;

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 overflow-y-hidden">
      <FullPageImageView photoId={photoId} />
    </div>
  );
}
