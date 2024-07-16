import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-10 text-xl">
      <nav>
        <Link href="/">목록</Link>
      </nav>
    </header>
  );
}
