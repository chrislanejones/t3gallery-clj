import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function TopNav() {
    return (
      <nav className="font-border grid grid-cols-4 justify-between justify-items-center border-b p-5 text-xl font-bold text-white">
        <div>Gallery</div>
        <div></div>
        <div></div>
        <div>
            <SignedOut>
            <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
      </nav>
    );
  }