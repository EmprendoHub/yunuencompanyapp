"use client";
import AdminSidebar, { SideBarItem } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar, TbReport, TbScanEye } from "react-icons/tb";
import { PiUserListLight } from "react-icons/pi";
import { CiGrid31 } from "react-icons/ci";
import { TfiDashboard } from "react-icons/tfi";
import { MdOutlineFactCheck, MdOutlinePostAdd } from "react-icons/md";
import { LuReceipt } from "react-icons/lu";
import { LiaCashRegisterSolid, LiaStoreAltSolid } from "react-icons/lia";
import { GiClothes } from "react-icons/gi";
import { FaCartPlus, FaInstagram } from "react-icons/fa6";
import { BsQrCodeScan } from "react-icons/bs";
import Link from "next/link";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full">
      <div className="flex items-start w-full ">
        <AdminSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={"Tablero"}
            active={pathname === "/admin" ? "true" : "false"}
            url={"/admin"}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Pedidos"}
            active={pathname === "/admin/pedidos" ? "true" : "false"}
            url={"/admin/pedidos"}
          />
          <SideBarItem
            icon={<CiGrid31 size={20} />}
            text={"Publicaciones"}
            active={pathname === "/admin/blog" ? "true" : "false"}
            url={"/admin/blog"}
            alert
            dropdownItems={[
              {
                text: "Publicaciones",
                url: "/admin/blog",
                active: pathname === "/admin/blog" ? "true" : "false",
                icon: <CiGrid31 size={20} />,
              },
              {
                text: "Nueva",
                url: "/admin/blog/editor",
                active: pathname === "/admin/blog/editor" ? "true" : "false",
                icon: <MdOutlinePostAdd size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <SideBarItem
            icon={<GiClothes size={20} />}
            text={"Productos"}
            active={
              pathname === "/admin/productos" ||
              pathname === "/admin/productos/nuevo"
                ? "true"
                : "false"
            }
            url={"/admin/productos"}
            alert
            dropdownItems={[
              {
                text: "Productos",
                url: "/admin/productos",
                active: pathname === "/admin/productos" ? "true" : "false",
                icon: <GiClothes size={20} />,
              },
              {
                text: "Nuevo",
                url: "/admin/productos/nuevo",
                active:
                  pathname === "/admin/productos/nuevo" ? "true" : "false",
                icon: <FaCartPlus size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />
          <SideBarItem
            icon={<PiUserListLight size={20} />}
            text={"Clientes"}
            active={pathname === "/admin/clientes" ? "true" : "false"}
            url={"/admin/clientes"}
          />
          <SideBarItem
            icon={<TbReport size={20} />}
            text={"Reportes"}
            active={pathname === "/admin/reportes" ? "true" : "false"}
            url={"/admin/reportes"}
          />

          <hr className="my-3 maxmd:my-1" />

          <hr className="my-3 maxmd:my-1" />
          <SideBarItem
            icon={<LuReceipt size={20} />}
            text={"POS"}
            active={
              pathname === "/admin/pos/productos" ||
              pathname === "/admin/pos/qr/scanner" ||
              pathname === "admin/pos/tienda" ||
              (pathname === "/admin/pos/carrito" && true)
            }
            url={"/admin/pos/productos"}
            alert
            dropdownItems={[
              {
                text: "Tienda",
                url: "/admin/pos/tienda",
                active: pathname === "/admin/pos/tienda" ? "true" : "false",
                icon: <LiaStoreAltSolid size={20} />,
              },
              {
                text: "Socials",
                url: "/admin/pos/socials",
                active: pathname === "/admin/pos/socials" ? "true" : "false",
                icon: <FaInstagram size={20} />,
              },
              {
                text: "Caja",
                url: "/admin/pos/carrito",
                active: pathname === "/admin/pos/carrito" ? "true" : "false",
                icon: <LiaCashRegisterSolid size={20} />,
              },
              {
                text: "Scanner",
                url: "/admin/pos/qr/scanner",
                active: pathname === "/admin/pos/qr/scanner" ? "true" : "false",
                icon: <BsQrCodeScan size={20} />,
              },
              {
                text: "Precio",
                url: "/admin/pos/qr/idscanner",
                active:
                  pathname === "/admin/pos/qr/idscanner" ? "true" : "false",
                icon: <TbScanEye size={20} />,
              },
              {
                text: "Etiquetas",
                url: "/admin/pos/productos",
                active: pathname === "/admin/pos/productos" ? "true" : "false",
                icon: <MdOutlineFactCheck size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />
        </AdminSidebar>
        <div className="relative w-full mb-5 p-4 ">{children}</div>
      </div>
    </div>
  );
}
