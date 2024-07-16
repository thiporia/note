import { Rabbit } from "lucide-react";

import { getSortedPostsData } from "@/lib/posts";

import PostList from "@/components/PostList";
import { classnames } from "@/lib/helpers";

const EmptyPosts = () => (
  <section
    className={classnames(
      "w-full h-full flex flex-col items-center justify-center gap-8"
    )}
  >
    <Rabbit
      width={120}
      height={120}
      className="animate-jump transition-all duration-100"
    />
    <p className="text-gray-500 text-xl font-bold">
      아직 작성된 포스트가 없습니다.
    </p>
  </section>
);

export default function Posts() {
  const allPostsData = getSortedPostsData();

  if (allPostsData.length === 0) {
    return <EmptyPosts />;
  }

  return <PostList posts={allPostsData} />;
}
