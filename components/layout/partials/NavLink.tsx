import NextLink from "next/link";
import type { LinkProps as NextLinkProps } from "next/link";

type LinkProps = NextLinkProps & {
  children: React.ReactNode;
};

export default function NavLink({ children, ...rest }: LinkProps) {
  return <NextLink {...rest}>{children}</NextLink>;
}
