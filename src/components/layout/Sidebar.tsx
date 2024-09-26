"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { FaUser, FaRegAddressCard, FaUserEdit } from "react-icons/fa";
import { RiLockPasswordLine, RiLogoutCircleRFill } from "react-icons/ri";
import { FaListCheck } from "react-icons/fa6";
import { MdOutlineAddHomeWork } from "react-icons/md";

const Sidebar = () => {
  return (
    <aside className=" w-1/4 maxmd:w-full px-4 py-8 flex flex-col maxmd:flex-row  items-start justify-start">
      <ul className="sidebar flex flex-col maxmd:flex-row">
        <Link
          href="/perfil"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <FaUser className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Tu Perfil</div>
          </li>
        </Link>
        <Link
          href="/perfil/pedidos"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <FaListCheck className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Pedidos</div>
          </li>
        </Link>
        <Link
          href="/perfil/favoritos"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <FaListCheck className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Favoritos</div>
          </li>
        </Link>
        <Link
          href="/perfil/direcciones/nueva"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <MdOutlineAddHomeWork className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Nueva Direccion</div>
          </li>
        </Link>
        <Link
          href="/perfil/direcciones"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <FaRegAddressCard className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Direcciones</div>
          </li>
        </Link>
      </ul>
      <hr className="my-4" />
      <ul className="sidebar flex flex-col maxmd:flex-row">
        <Link
          href="/perfil/actualizar"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <FaUserEdit className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Actualizar Perfil</div>
          </li>
        </Link>
        <Link
          href="/perfil/actualizar_contrasena"
          className="block px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md"
        >
          <li className="flex flex-row items-center gap-x-3">
            <RiLockPasswordLine className="text-2xl text-foreground" />

            <div className="maxmd:hidden">Actualizar Contraseña</div>
          </li>
        </Link>

        <li>
          <div
            className=" px-3 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer flex flex-row items-center gap-x-3"
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

export default Sidebar;
