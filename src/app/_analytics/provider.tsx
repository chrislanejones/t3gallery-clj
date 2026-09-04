"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Guarded rather than `key!`: initialising with undefined throws during hydration
// and blanks the whole app, including the sign-in UI.
if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    // Do not record form values, and mask text in session replay by default.
    mask_all_text: true,
    mask_all_element_attributes: true,
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <PostHogAuthWrapper>{children}</PostHogAuthWrapper>
    </PostHogProvider>
  );
}

function PostHogAuthWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const userInfo = useUser();

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    if (userInfo.user) {
      posthog.identify(userInfo.user.id, {
        email: userInfo.user.emailAddresses[0]?.emailAddress,
        name: userInfo.user.fullName,
      });
    } else if (!auth.isSignedIn) {
      // Clear the previous identity so a shared browser does not attribute the
      // next visitor's events to the account that just signed out.
      posthog.reset();
    }
  }, [auth, userInfo]);

  return children;
}
