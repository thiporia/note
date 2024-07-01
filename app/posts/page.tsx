import PostList from '@/components/PostList'
import { getSortedPostsData } from '@/lib/posts'

export default function Posts() {
  const allPostsData = getSortedPostsData()
  return (
    <>
      <h1>포스트 목록</h1>
      <PostList posts={allPostsData} />
    </>
  )
}