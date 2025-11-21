import {
  Bookmark,
  LayoutGrid,
  LucideIcon,
  Newspaper,

} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/admin-panel",
          label: "Dashboard",
          icon: LayoutGrid,
          active: pathname === "/admin-panel"
        }
      ]
    },
    {
      groupLabel: "Content",
      menus: [
        {
          href: "/admin-panel/news",
          label: "News Feed",
          icon: Newspaper,
          active: pathname.includes("/admin-panel/news")
        },
        
        {
          href: "/admin-panel/bookmarks",
          label: "Bookmarks",
          icon: Bookmark,
          active: pathname.includes("/bookmarks")
        },
      ]
    },
  ];
}