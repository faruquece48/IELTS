"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Vocabulary", href: "/vocabulary" },
  { label: "Speaking", href: "/speaking", submenu: [
      { label: "Part 1", href: "/speaking/part1" },
      { label: "Part 2", href: "/speaking/part2" },
      { label: "Part 3", href: "/speaking/part3" },
    ]
  },
  { label: "High frequency word", href: "/high-frequency-word" },
  { label: "Writing task", href: "/writing-task" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.submenu) {
          const isSubmenuActive = item.submenu.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + "/"));

          return (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className={`rounded-full border px-3 py-2 transition ${
                  isActive || isSubmenuActive
                    ? "border-sky-600 bg-sky-50 text-sky-700 shadow-sm"
                    : "border-transparent text-slate-700 hover:border-slate-200 hover:text-sky-700"
                }`}
              >
                {item.label}
              </Link>

              <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                {item.submenu.map((subItem) => {
                  const isSubActive = pathname === subItem.href;

                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      className={`block rounded-lg px-3 py-2 text-left transition ${
                        isSubActive
                          ? "bg-sky-50 font-semibold text-sky-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-sky-700"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-full border px-3 py-2 transition ${
              isActive
                ? "border-sky-600 bg-sky-50 text-sky-700 shadow-sm"
                : "border-transparent text-slate-700 hover:border-slate-200 hover:text-sky-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
