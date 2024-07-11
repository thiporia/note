import { getAllPostIds, getPostData } from '@/lib/posts'

export async function generateStaticParams() {
  const paths = getAllPostIds()
  return paths
}

export default async function Post({ params }: { params: { slug: string } }) {
  try {
    const postData = await getPostData(params.slug)

    return (
      <article>
        <div>
          <h1>{postData.title}</h1>
          <h5>tags: {postData.tags}</h5>
        </div>
        <div className="markdown-body"  dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    )
  } catch (error) {
    return <p>포스트를 찾을 수 없습니다.</p>
  }
}