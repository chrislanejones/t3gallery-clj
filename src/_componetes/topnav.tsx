"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UploadButton } from "~/utils/uploadthing";

export function TopNav() {
  const router = useRouter();
  return (
    <nav className="font-border grid grid-cols-4 justify-between justify-items-center border-b p-5 text-xl font-bold text-white">
      <div>Gallery</div>
      <div></div>
      <div className="grid">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={() => {
            router.refresh();
          }}
        ></UploadButton>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
