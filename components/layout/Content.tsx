import React from "react";

export default function Content({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-fit flex-1 p-1 mt-[40px] mb-[40px]">
      {children}
    </main>
  );
}
