import { getImage } from "~/server/queries";

export async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);
  return <img src={image.url} alt="thumbanil" className="w-96" />;
}
