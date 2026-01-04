import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForEssay } from "../../utils/generateOgImages";

export async function getStaticPaths() {
  const essays = await getCollection("essays").then((e) =>
    e.filter(({ data }) => !data.draft)
  );

  return essays.map((essay) => {
    // Handle both folder-based (how-computers-work/index.mdx) and flat (my-essay.mdx) structures
    const parts = essay.id.split("/");
    const slug = parts.length > 1 
      ? parts[0]  // Folder-based: use folder name as slug
      : parts[0].replace(/\.mdx?$/, ""); // Flat file: remove extension
    return {
      params: { slug },
      props: essay,
    };
  });
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await generateOgImageForEssay(props as CollectionEntry<"essays">), {
    headers: { "Content-Type": "image/png" },
  });
