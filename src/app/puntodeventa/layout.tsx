"use client";
import BranchSidebar, { SideBarItem } from "@/components/pos/BranchSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar } from "react-icons/tb";
import { LiaCashRegisterSolid, LiaReceiptSolid } from "react-icons/lia";
import Link from "next/link";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <BranchSidebar>
          <SideBarItem
            icon={<LiaCashRegisterSolid size={20} />}
            text={"Caja"}
            active={
              pathname === "/puntodeventa/tienda" ||
              (pathname === "/puntodeventa/tienda" && true)
            }
            url={"/puntodeventa/tienda"}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Ventas"}
            active={pathname === "/puntodeventa/pedidos" ?? true}
            url={"/puntodeventa/pedidos"}
          />

          <SideBarItem
            icon={<LiaReceiptSolid size={20} />}
            text={"Corte"}
            active={
              pathname === "/puntodeventa/corte" ||
              (pathname === "/puntodeventa/corte" && true)
            }
            url={"/puntodeventa/corte"}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
        {!pathname.includes("tienda") && !pathname.includes("pedidos") ? (
          <Link
            className="absolute right-3 bottom-3 z-50 text-4xl text-blue-500 bg-black px-7 py-5 flex items-center justify-center rounded-full hover:scale-110 duration-300 ease-in-out"
            href={`${
              pathname.includes("puntodeventa") ? "/puntodeventa/tienda" : ""
            }`}
          >
            +
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
