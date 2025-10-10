import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  
  noTopSpacing?: boolean;
}

export function ContentLayout({ title, children, noTopSpacing = false }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={`container ${noTopSpacing ? 'pt-0' : 'pt-8'} pb-8 px-4 sm:px-8`}>{children}</div>
    </div>
  );
}
