import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany();

  return (
    <main className="">
      <div className="grid grid-cols-3 gap-5">
        {posts.map((post) => (
          <div key={post.id}>{post.name}</div>
        ))}
        {[...images, ...images, ...images].map((image, index) => (
          <div key={image.id + "-" + index} className="">
            <img src={image.url} alt="image" />
          </div>
        ))}
      </div>
    </main>
  );
}
