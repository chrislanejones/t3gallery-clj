import Link from "next/link";
import { db } from "~/server/db";

const mockUrls = [
  "https://utfs.io/f/f337125a-37a9-4c0b-9d42-63ced57d397f-vi0zns.jpg",
  "https://utfs.io/f/9d74c317-5e9e-477a-906a-c03bdcfec982-ww08rl.jpg",
  "https://utfs.io/f/8526464b-509a-4d9e-8df8-a862bcaeb73e-f6tayh.JPG",
  "https://utfs.io/f/7497c1bd-58c1-4921-a029-a3ef1912773e-yukl1s.jpeg",
  "https://utfs.io/f/9276b4d2-985a-4dac-8dd3-c284f5d38997-j31389.jpg",
  "https://utfs.io/f/21624665-a422-460d-864a-d54f2bd66424-1fiiby.jpg",
  "https://utfs.io/f/2462095c-c14c-40e5-b8bf-09335c2686df-o6ztr2.jpg",
  "https://utfs.io/f/7c822a8b-e491-4f54-86f8-35e8f4ec1cff-q6x4om.jpeg",
  "https://utfs.io/f/4d4285cc-ee2e-41fd-a534-b9477674d4b1-ukxjuv.jpg",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));
export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  console.log(posts);
  return (
    <main className="">
      <div className="grid grid-cols-3 gap-5">
        {posts.map((post) => (
          <div key={post.id}>{post.name}</div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.id + "-" + index} className="">
            <img src={image.url} alt="image" />
          </div>
        ))}
      </div>
    </main>
  );
}
