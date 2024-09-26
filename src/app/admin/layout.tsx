"use client";
import AdminSidebar, { SideBarItem } from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar, TbReport, TbScanEye } from "react-icons/tb";
import { PiUserListLight } from "react-icons/pi";
import { CiGrid31 } from "react-icons/ci";
import { TfiDashboard } from "react-icons/tfi";
import {
  MdOutlineFactCheck,
  MdOutlinePostAdd,
  MdPayments,
} from "react-icons/md";
import { LuReceipt } from "react-icons/lu";
import { LiaCashRegisterSolid, LiaStoreAltSolid } from "react-icons/lia";
import { GiClothes, GiEnergyArrow } from "react-icons/gi";
import { FaCartPlus, FaInstagram } from "react-icons/fa6";
import { BsAmazon, BsCalendar, BsQrCodeScan, BsRobot } from "react-icons/bs";
import { SiAuth0, SiMercadopago } from "react-icons/si";

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
          <SideBarItem
            icon={<SiMercadopago size={20} />}
            text={"MercadoLibre"}
            active={
              pathname === "/admin/mercadolibre" ||
              pathname === "/admin/mercadolibre/producto"
            }
            url={"/admin/aicontent"}
            alert
            dropdownItems={[
              {
                text: "Auth",
                url: "/admin/mercadolibre",
                active: pathname === "/admin/mercadolibre" ? "true" : "false",
                icon: <SiAuth0 size={20} />,
              },
              {
                text: "+Producto",
                url: "/admin/mercadolibre/producto",
                active:
                  pathname === "/admin/mercadolibre/producto"
                    ? "true"
                    : "false",
                icon: <SiMercadopago size={20} />,
              },
            ]}
          />

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
                text: "Instagram",
                url: "/admin/pos/instagram",
                active: pathname === "/admin/pos/instagram" ? "true" : "false",
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
                text: "Revisa-Precio",
                url: "/admin/pos/qr/idscanner",
                active:
                  pathname === "/admin/pos/qr/idscanner" ? "true" : "false",
                icon: <TbScanEye size={20} />,
              },
              {
                text: "Generador",
                url: "/admin/pos/productos",
                active: pathname === "/admin/pos/productos" ? "true" : "false",
                icon: <MdOutlineFactCheck size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <hr className="my-3 maxmd:my-1" />
          <SideBarItem
            icon={<BsRobot size={20} />}
            text={"AiContent"}
            active={
              pathname === "/admin/aicontent" ||
              pathname === "/admin/aicontent/historial" ||
              pathname === "/admin/aicontent/planes" ||
              pathname === "admin/aicontent/calendario" ||
              pathname === "/admin/aicontent/amazon" ||
              pathname === "/admin/aicontent/mercadolibre"
            }
            url={"/admin/aicontent"}
            alert
            dropdownItems={[
              {
                text: "Generador",
                url: "/admin/aicontent",
                active: pathname === "/admin/aicontent" ? "true" : "false",
                icon: <GiEnergyArrow size={20} />,
              },
              {
                text: "Historial",
                url: "/admin/aicontent/historial",
                active:
                  pathname === "/admin/aicontent/historial" ? "true" : "false",
                icon: <LiaStoreAltSolid size={20} />,
              },
              {
                text: "Planes",
                url: "/admin/aicontent/planes",
                active:
                  pathname === "/admin/aicontent/planes" ? "true" : "false",
                icon: <MdPayments size={20} />,
              },
              {
                text: "Calendario",
                url: "/admin/aicontent/calendario",
                active:
                  pathname === "/admin/aicontent/calendario" ? "true" : "false",
                icon: <BsCalendar size={20} />,
              },
              {
                text: "Amazon",
                url: "/admin/aicontent/amazon",
                active:
                  pathname === "/admin/aicontent/amazon" ? "true" : "false",
                icon: <BsAmazon size={20} />,
              },
              {
                text: "MercadoLibre",
                url: "/admin/aicontent/mercadolibre",
                active:
                  pathname === "/admin/aicontent/mercadolibre"
                    ? "true"
                    : "false",
                icon: <SiMercadopago size={20} />,
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
