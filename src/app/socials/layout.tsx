"use client";
import BranchSidebar, { SideBarItem } from "@/components/pos/BranchSidebar";
import { usePathname } from "next/navigation";
import {
  TbClothesRack,
  TbDeviceIpadDollar,
  TbQrcode,
  TbScan,
  TbScanEye,
} from "react-icons/tb";
import { TfiDashboard } from "react-icons/tfi";
import { LuReceipt } from "react-icons/lu";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { BsQrCodeScan } from "react-icons/bs";
import { MdOutlineFactCheck } from "react-icons/md";
import { GiClothes } from "react-icons/gi";
import { FaCartPlus } from "react-icons/fa6";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <BranchSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={"Tablero"}
            active={pathname === "/socials" ?? true}
            url={"/socials"}
          />
          <SideBarItem
            icon={<GiClothes size={20} />}
            text={"Productos"}
            active={pathname === "/socials/productos" ?? true}
            url={"/socials/productos"}
          />
          <SideBarItem
            icon={<FaCartPlus size={20} />}
            text={"Producto +"}
            active={pathname === "/socials/productos/nuevo/variaciones" ?? true}
            url={"/socials/productos/nuevo/variaciones"}
          />

          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Pedidos"}
            active={pathname === "/socials/pedidos" ?? true}
            url={"/socials/pedidos"}
          />

          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={"POS"}
            active={
              pathname === "/socials/tienda" ||
              (pathname === "/socials/tienda" && true)
            }
            url={"/socials/tienda"}
          />

          <SideBarItem
            icon={<LiaCashRegisterSolid size={20} />}
            text={"Caja"}
            active={
              pathname === "/socials/carrito" ||
              (pathname === "/socials/carrito" && true)
            }
            url={"/socials/carrito"}
          />
          <SideBarItem
            icon={<BsQrCodeScan size={20} />}
            text={"Scanner"}
            active={
              pathname === "/socials/qr/scanner" ||
              (pathname === "/socials/qr/scanner" && true)
            }
            url={"/socials/qr/scanner"}
          />
          <SideBarItem
            icon={<TbScanEye size={20} />}
            text={"Revisa-Precio"}
            active={
              pathname === "/socials/qr/idscanner" ||
              (pathname === "/socials/qr/idscanner" && true)
            }
            url={"/socials/qr/idscanner"}
          />
          <SideBarItem
            icon={<MdOutlineFactCheck size={20} />}
            text={"Generar QRs"}
            active={
              pathname === "/socials/seleccionar" ||
              (pathname === "/socials/seleccionar" && true)
            }
            url={"/socials/seleccionar"}
          />
        </BranchSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
