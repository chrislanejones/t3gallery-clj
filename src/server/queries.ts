import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { images } from "./db/schema";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import analyticsServerClient from "./analytics";

/**
 * Image ids are `serial` (signed 32-bit). Reject anything that is not a plain
 * positive integer before it reaches the database — `Number()` happily accepts
 * "0x0c", " 12 ", "1e9" and Infinity, none of which are valid ids.
 */
const imageId = z.coerce.number().int().positive().max(2_147_483_647);

export function parseImageId(raw: string): number {
  const parsed = imageId.safeParse(raw);
  if (!parsed.success) notFound();
  return parsed.data;
}

function requireUserId(): string {
  const { userId } = auth();
  // Middleware should have caught this already; if it did not, fail closed
  // rather than falling through to an unscoped query.
  if (!userId) redirect("/");
  return userId;
}

export async function getMyImages() {
  const userId = requireUserId();

  return db.query.images.findMany({
    where: (model, { eq }) => eq(model.userId, userId),
    orderBy: (model, { desc }) => desc(model.id),
  });
}

export async function getImage(id: number) {
  const userId = requireUserId();

  const image = await db.query.images.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.id, id), eq(model.userId, userId)),
  });

  // Deliberately one outcome for both "no such image" and "not yours": returning
  // distinguishable errors turns /img/<n> into an oracle for enumerating which
  // image ids exist across the whole table.
  if (!image) notFound();

  return image;
}

export async function deleteImage(id: number) {
  const userId = requireUserId();

  const deleted = await db
    .delete(images)
    .where(and(eq(images.id, id), eq(images.userId, userId)))
    .returning({ id: images.id });

  // Nothing matched: either the id does not exist or it belongs to someone else.
  // Bail before emitting analytics so a signed-in user cannot probe other
  // people's image ids through the event stream.
  if (deleted.length === 0) notFound();

  analyticsServerClient.capture({
    distinctId: userId,
    event: "delete image",
    properties: {
      imageId: id,
    },
  });

  redirect("/");
}
