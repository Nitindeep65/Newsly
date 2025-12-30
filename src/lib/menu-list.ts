import {
  LayoutGrid,
  LucideIcon,
  Mail,
  Users,
  Send,
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
      groupLabel: "Newsletter",
      menus: [
        {
          href: "/admin-panel/newsletters/new",
          label: "Create Newsletter",
          icon: Send,
          active: pathname === "/admin-panel/newsletters/new"
        },
        {
          href: "/admin-panel/subscribers",
          label: "Subscribers",
          icon: Users,
          active: pathname.includes("/admin-panel/subscribers")
        },
        {
          href: "/admin-panel/newsletters",
          label: "All Newsletters",
          icon: Mail,
          active: pathname === "/admin-panel/newsletters"
        },
      ]
    },
  ];
}