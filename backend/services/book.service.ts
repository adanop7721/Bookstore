import prisma from "../db/prisma";
import { fetchBooksFromAPI } from "../helpers/fetchBooksFromAPI";

export async function seedBooksIfNoneExist(): Promise<void> {
  const count = await prisma.book.count();
  if (count > 0) return;

  const books = await fetchBooksFromAPI();
  await prisma.book.createMany({ data: books });
}
