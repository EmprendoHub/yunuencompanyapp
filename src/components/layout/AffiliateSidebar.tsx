"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { RiLockPasswordLine, RiLogoutCircleRFill } from "react-icons/ri";
import { PiUserListLight, PiUserCircleGearLight } from "react-icons/pi";
import { SiAmazonsimpleemailservice } from "react-icons/si";
import {
  MdOutlineDashboard,
  MdOutlineAddBusiness,
  MdOutlinePostAdd,
} from "react-icons/md";
import {
  TfiLayoutListThumb,
  TfiList,
  TfiLayoutListPost,
} from "react-icons/tfi";
import { useRouter } from "next/navigation";

const AffiliateSidebar = () => {
  const router = useRouter();

  function handleClickLink(Url: string) {
    router.push(Url);
  }

  return (
    <aside className=" w-1/5 maxmd:w-full px-4 maxsm:px-2 py-8 flex flex-col maxmd:flex-row maxmd:justify-between maxmd:items-center items-start justify-start">
      <ul className="sidebar flex flex-col maxmd:flex-row gap-x-2 ">
        <Link
          href="/afiliado"
          className="block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3 ">
            <MdOutlineDashboard className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Panel de Afiliado</div>
          </li>
        </Link>
        <button
          onClick={() => handleClickLink("/afiliado/pedidos")}
          className="block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <TfiList className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Pedidos</div>
          </li>
        </button>

        <Link
          href="/afiliado/enlaces/nuevo"
          className="block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <MdOutlineAddBusiness className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Nuevo Enlace</div>
          </li>
        </Link>
        <Link
          href="/afiliado/enlaces"
          className="block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <MdOutlineAddBusiness className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Enlaces de Afiliado</div>
          </li>
        </Link>
      </ul>
      <hr className="my-4 maxsm:px-1" />
      <ul className="sidebar flex flex-col maxmd:flex-row gap-x-2">
        <Link
          href="/afiliado/actualizar"
          className="block px-3 maxsm:px-1 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <PiUserCircleGearLight className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Actualizar Perfil</div>
          </li>
        </Link>

        <li>
          <div
            className=" px-3 maxsm:px-1 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer flex flex-row items-center gap-x-3"
            onClick={() => signOut()}
          >
            <RiLogoutCircleRFill className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Cerrar Session</div>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default AffiliateSidebar;
