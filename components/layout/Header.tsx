import { LayoutList } from "lucide-react";

import { classnames } from "@/lib/helpers";

import NavLink from "@/components/layout/partials/NavLink";

export default function Header() {
  return (
    <header
      className={classnames(
        "fixed top-0 left-0 flex items-center w-full flex-none h-[40px] px-1",
        "z-50 bg-white"
      )}
    >
      <nav>
        <NavLink href="/">
          <LayoutList
            className={classnames("p-0.5 rounded", "hover:bg-blue-300")}
          />
        </NavLink>
      </nav>
    </header>
  );
}
