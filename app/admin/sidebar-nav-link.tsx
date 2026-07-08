"use client";

import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNavLink({
  href,
  children,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { setOpenMobile, isMobile } = useSidebar();

  return (
    <Link
      href={href}
      onClick={() => {
        if (isMobile) setOpenMobile(false);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
