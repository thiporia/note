import { getAllPostIds, getPostData } from "@/lib/posts";

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function Post({ params }: { params: { slug: string } }) {
  try {
    const postData = await getPostData(params.slug);

    return (
      <article className="p-4 border-2 border-red-200 border-dashed rounded">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">{postData.title}</h1>
          <h5 className="text-sm text-gray-600 font-medium text-right">
            tags: {postData.tags}
            <br />
            date: {postData.date}
          </h5>
        </div>
        <hr />
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    );
  } catch (error) {
    return <p>포스트를 찾을 수 없습니다.</p>;
  }
}
