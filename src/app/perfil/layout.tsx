"use client";
import CustomerSidebar, {
  SideBarItem,
} from "@/components/admin/CustomerSidebar";
import { usePathname } from "next/navigation";
import { TbDeviceIpadDollar } from "react-icons/tb";
import { TfiDashboard } from "react-icons/tfi";
import { MdOutlineAddHomeWork } from "react-icons/md";
import { FaHeart, FaRegAddressCard } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

export default function UserLayout({ children }: { children: any }) {
  const pathname = usePathname();

  return (
    <div className="max-w-full pr-2">
      <div className="flex items-start w-full ">
        <CustomerSidebar>
          <SideBarItem
            icon={<TfiDashboard size={20} />}
            text={"Tablero"}
            active={pathname === "/admin" ?? true}
            url={"/perfil"}
          />
          <SideBarItem
            icon={<TbDeviceIpadDollar size={20} />}
            text={"Pedidos"}
            active={pathname === "/perfil/pedidos" ?? true}
            url={"/perfil/pedidos"}
          />
          <SideBarItem
            icon={<FaHeart size={20} />}
            text={"Favoritos"}
            active={pathname === "/perfil/favoritos" ?? true}
            url={"/perfil/favoritos"}
          />
          <SideBarItem
            icon={<FaRegAddressCard size={20} />}
            text={"Direcciones"}
            active={
              pathname === "/perfil/direcciones" ||
              (pathname === "/perfil/direcciones/nueva" && true)
            }
            url={"/perfil/direcciones"}
            alert
            dropdownItems={[
              {
                text: "Todas",
                url: "/perfil/direcciones",
                active: pathname === "/perfil/direcciones" ?? true,
                icon: <FaRegAddressCard size={20} />,
              },
              {
                text: "Nueva Dirección",
                url: "/perfil/direcciones/nueva",
                active: pathname === "/perfil/direcciones/nueva" ?? true,
                icon: <MdOutlineAddHomeWork size={20} />,
              },
              // Add more dropdown items as needed
            ]}
          />

          <hr className="my-3 maxmd:my-1" />

          <SideBarItem
            icon={<FaUserEdit size={20} />}
            text={"Actualizar Perfil"}
            active={pathname === "/perfil/actualizar" ?? true}
            url={"/perfil/actualizar"}
          />
          <SideBarItem
            icon={<RiLockPasswordLine size={20} />}
            text={"Actualizar Contraseña"}
            active={pathname === "/perfil/actualizar_contrasena" ?? true}
            url={"/perfil/actualizar_contrasena"}
          />
        </CustomerSidebar>
        <div className="relative w-full mb-5 ">{children}</div>
      </div>
    </div>
  );
}
