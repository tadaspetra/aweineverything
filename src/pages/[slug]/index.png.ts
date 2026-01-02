import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForEssay } from "../../utils/generateOgImages";

export async function getStaticPaths() {
  const essays = await getCollection("essays").then((e) =>
    e.filter(({ data }) => !data.draft)
  );

  return essays.map((essay) => {
    const slug = essay.id.split("/").pop()?.replace(/\.mdx?$/, "") ?? essay.id;
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
