import { classnames } from "@/lib/helpers";

export default function Footer() {
  return (
    <footer
      className={classnames(
        "fixed w-full bottom-0 left-0 px-4 py-1",
        "z-50 bg-white",
        "text-sm text-gray-600 font-medium"
      )}
    >
      <p>2024, thiporia.</p>
    </footer>
  );
}
