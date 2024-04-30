import { SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Images() {
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return (
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
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
        <div className="w-ful h-full text-2xl">Please Sign in Above</div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>
    </main>
  );
}
