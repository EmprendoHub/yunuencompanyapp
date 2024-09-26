"use client";
import BranchSidebar, { SideBarItem } from "@/components/pos/BranchSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar, TbScanEye } from "react-icons/tb";
import { TfiDashboard } from "react-icons/tfi";
import { LuReceipt } from "react-icons/lu";
import { LiaCashRegisterSolid, LiaReceiptSolid } from "react-icons/lia";
import { MdOutlineFactCheck } from "react-icons/md";
import { BsQrCodeScan } from "react-icons/bs";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <BranchSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={"Tablero"}
            active={pathname === "/puntodeventa" ?? true}
            url={"/puntodeventa"}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Pedidos"}
            active={pathname === "/puntodeventa/pedidos" ?? true}
            url={"/puntodeventa/pedidos"}
          />

          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={"POS"}
            active={
              pathname === "/puntodeventa/tienda" ||
              (pathname === "/puntodeventa/tienda" && true)
            }
            url={"/puntodeventa/tienda"}
          />

          <SideBarItem
            icon={<LiaCashRegisterSolid size={20} />}
            text={"Caja"}
            active={
              pathname === "/puntodeventa/carrito" ||
              (pathname === "/puntodeventa/carrito" && true)
            }
            url={"/puntodeventa/carrito"}
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
          <SideBarItem
            icon={<BsQrCodeScan size={20} />}
            text={"Scanner"}
            active={
              pathname === "/puntodeventa/qr/scanner" ||
              (pathname === "/puntodeventa/qr/scanner" && true)
            }
            url={"/puntodeventa/qr/scanner"}
          />
          <SideBarItem
            icon={<TbScanEye size={20} />}
            text={"Revisa-Precio"}
            active={
              pathname === "/puntodeventa/qr/idscanner" ||
              (pathname === "/puntodeventa/qr/idscanner" && true)
            }
            url={"/puntodeventa/qr/idscanner"}
          />
          <SideBarItem
            icon={<MdOutlineFactCheck size={20} />}
            text={"Generar QRs"}
            active={
              pathname === "/puntodeventa/seleccionar" ||
              (pathname === "/puntodeventa/seleccionar" && true)
            }
            url={"/puntodeventa/seleccionar"}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
