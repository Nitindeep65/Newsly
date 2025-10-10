import {
  Tag,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Newspaper,
  Bell,
  BarChart3
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
          href: "/admin-panel/categories",
          label: "Categories",
          icon: Tag,
          active: pathname.includes("/admin-panel/categories")
        },
        {
          href: "/admin-panel/bookmarks",
          label: "Bookmarks",
          icon: Bookmark,
          active: pathname.includes("/admin-panel/bookmarks")
        },
        {
          href: "/admin-panel/write",
          label: "Write Article",
          icon: SquarePen,
          active: pathname.includes("/admin-panel/write")
        }
      ]
    },
    {
      groupLabel: "Analytics",
      menus: [
        {
          href: "/admin-panel/analytics",
          label: "Analytics",
          icon: BarChart3,
          active: pathname.includes("/admin-panel/analytics")
        },
        {
          href: "/admin-panel/notifications",
          label: "Notifications",
          icon: Bell,
          active: pathname.includes("/admin-panel/notifications")
        }
      ]
    }
  ];
}