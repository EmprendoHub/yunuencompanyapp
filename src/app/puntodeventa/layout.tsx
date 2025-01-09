"use client";
import BranchSidebar, { SideBarItem } from "@/components/pos/BranchSidebar";
import { usePathname, useRouter } from "next/navigation";
import { TbDeviceIpadDollar } from "react-icons/tb";
import {
  LiaCashRegisterSolid,
  LiaMoneyBillAlt,
  LiaReceiptSolid,
} from "react-icons/lia";
import Link from "next/link";
import { LogOut, LucideTicketPlus, Video } from "lucide-react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();
  const session: any = useSession();
  const router = useRouter();
  const [supaBase, setSupaBase] = useState<any>(null);
  console.log("supaBase", supaBase);

  useEffect(() => {
    async function getSupaSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSupaBase(session);
    }

    getSupaSession();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();

    router.push("/puntodeventa/signup");
  };
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
            active={pathname === "/puntodeventa/pedidos" && true}
            url={"/puntodeventa/pedidos"}
          />
          <SideBarItem
            icon={<LucideTicketPlus size={20} />}
            text={"Gasto"}
            active={
              pathname === "/puntodeventa/gastos/nuevo" ||
              (pathname === "/puntodeventa/gastos/nuevo" && true)
            }
            url={"/puntodeventa/gastos/nuevo"}
          />
          <SideBarItem
            icon={<LiaMoneyBillAlt size={20} />}
            text={"Gastos"}
            active={
              pathname === "/puntodeventa/gastos" ||
              (pathname === "/puntodeventa/gastos" && true)
            }
            url={"/puntodeventa/gastos"}
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

          <hr className="my-3 maxmd:my-1" />
          {session.data && session.data.user.role === "sucursal_principal" && (
            <SideBarItem
              icon={<Video size={20} />}
              text={"Publicaciones"}
              active={
                pathname === "/puntodeventa/publicaciones" ||
                (pathname === "/puntodeventa/publicaciones" && true)
              }
              url={"/puntodeventa/publicaciones"}
            />
          )}
          <hr className="my-3 maxmd:my-1" />

          <LogOut
            size={20}
            onClick={logout}
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
        {!pathname.includes("tienda") &&
        !pathname.includes("gastos") &&
        !pathname.includes("corte") &&
        !pathname.includes("pedidos") &&
        !pathname.includes("publicaciones") &&
        !pathname.includes("live") &&
        !pathname.includes("pedido") ? (
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
