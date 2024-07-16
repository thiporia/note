import { classnames } from "@/lib/helpers";
import Link from "next/link";

export default function PostList({
  posts,
}: {
  posts: Array<{ id: string; date: string; title: string }>;
}) {
  return (
    <ul>
      {posts.map(({ id, date, title }) => (
        <Link href={`/posts/${id}`} className="text-sm font-semibold">
          <li key={id} className="mb-2 cursor-pointer">
            <div
              className={classnames(
                "w-full h-fit flex flex-col p-2 gap-1 bg-red-100 bg-opacity-30 rounded",
                "hover:text-blue-500 hover:bg-gray-200 transition-all duration-100"
              )}
            >
              {title}
              <small className="text-right text-xs text-gray-500 font-medium">
                {date}
              </small>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
}
