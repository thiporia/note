import fs from "fs";
import path from "path";
import matter from "gray-matter";
import html from "remark-html";
import { remark } from "remark";
import { rehype } from "rehype";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

import tailwindRehypePlugin from "../tailwindRehypePlugin";

const postsDirectory = path.join(process.cwd(), "public/posts");

export function getSortedPostsData() {
  // 디렉토리가 존재하지 않으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  // 디렉토리가 존재하지 않으면 빈 배열 반환
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  const processedHtml = await rehype()
    .use(rehypeParse, { fragment: true })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .use(tailwindRehypePlugin)
    .process(contentHtml);

  return {
    slug,
    contentHtml: processedHtml.toString(),
    ...(matterResult.data as { date: string; title: string; tags: string }),
  };
}
