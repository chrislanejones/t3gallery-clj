import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return (
    <main className="">
      <div className="grid grid-cols-3 gap-5">
        {[...images, ...images, ...images].map((image, index) => (
          <div key={image.id + "-" + index} className="">
            <img src={image.url} />
            <div className="text-large grid justify-items-center p-2 font-bold">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
