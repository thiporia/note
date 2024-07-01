import Link from 'next/link'

export default function Home() {
  return (
    <>
      <h1>notes</h1>
      <p>낙서, 감상</p>
      <Link href="/posts">
        포스트 목록 보기
      </Link>
    </>
  )
}