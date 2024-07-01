import PostList from '@/components/PostList'
import { getSortedPostsData } from '@/lib/posts'

export default function Posts() {
  const allPostsData = getSortedPostsData()
  
  if (allPostsData.length === 0) {
    return <p>아직 작성된 포스트가 없습니다.</p>
  }

  return (
    <>
      <h1>포스트 목록</h1>
      <PostList posts={allPostsData} />
    </>
  )
}