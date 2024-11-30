import Link from "next/link";

export default function SidebarMenuItem({
  link,
  text,
  Icon,
  active,
}: {
  link: string;
  text: string;
  Icon: any;
  active: boolean;
}) {
  return (
    <div className="hoverEffect flex items-center text-gray-700 justify-start text-sm space-x-3 hover:bg-gray-200 rounded-full">
      <Link href={`/${link}`}>
        <Icon className="h-7" />
        <span className={`${active && "font-bold"} inline`}>{text}</span>
      </Link>
    </div>
  );
}
