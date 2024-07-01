import Link from 'next/link'

export default function PostList({ posts }: { posts: Array<{ id: string, date: string, title: string }> }) {
  return (
    <ul>
      {posts.map(({ id, date, title }) => (
        <li key={id}>
          <Link href={`/posts/${id}`}>
            {title}
          </Link>
          <br />
          <small>{date}</small>
        </li>
      ))}
    </ul>
  )
}