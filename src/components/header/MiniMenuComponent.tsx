"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { IoMdCart, IoMdHeart } from "react-icons/io";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { IoQrCode } from "react-icons/io5";

const MiniMenuComponent = () => {
  const { data: session }: any = useSession();
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    if (session) {
      setUser(session?.user);
    }
  }, [session, setUser]);

  const isLoggedIn = Boolean(session?.user);

  const { productsData, favoritesData, emailListData, qrListData } =
    useSelector((state: any) => state.compras);

  const [totalCartAmt, setTotalCartAmt] = useState(0);

  useEffect(() => {
    let amt = 0;
    productsData.map((item: any) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalCartAmt(amt);
  }, [productsData]);

  return (
    <div className=" m-0 flex-1  flex flex-row pr-5 items-center  justify-end gap-x-3 font-poppins text-sm tracking-widest">
      {/* Cart Button */}
      {productsData && productsData?.length > 0 ? (
        <div className="flex items-center gap-x-3">
          <Link href={"/carrito"}>
            <div className="  text-foreground  flex items-center justify-center  cursor-pointer">
              <IoMdCart className="text-2xl" />
              <span className="bg-background text-foreground rounded-full font-bold relative right-2 -top-3 flex items-center pl-0.5 justify-center w-4 h-4 shadow-xl text-[12px] ">
                {productsData ? productsData?.length : 0}
              </span>
            </div>
          </Link>
        </div>
      ) : (
        ""
      )}
      {isLoggedIn && session.user.role === "sucursal" ? (
        <Link href={"/puntodeventa/qr/generador"}>
          <div className="  flex items-center justify-center  ease-in-out duration-300 cursor-pointer">
            <IoQrCode className="text-xl" />
            <span className="bg-background text-foreground rounded-full font-bold text-xs relative  -top-2 flex items-center justify-center w-4 h-5 shadow-xl ">
              {qrListData ? qrListData?.length : 0}
            </span>
          </div>
        </Link>
      ) : (
        ""
      )}
      {favoritesData && favoritesData.length > 0 ? (
        <div>
          <Link
            href={"/perfil/favoritos"}
            className=" flex items-center justify-center ease-in-out duration-300 cursor-pointer"
          >
            <IoMdHeart className="text-2xl text-primary" />
            <span className="bg-background text-foreground rounded-full font-bold text-[12px] relative pl-0.5 right-2 -top-3 flex items-center justify-center w-4 h-4 shadow-xl ">
              {favoritesData ? favoritesData?.length : 0}
            </span>
          </Link>
        </div>
      ) : (
        ""
      )}
      {/*  Emails Button */}
      {isLoggedIn && session?.user.role === "manager" ? (
        <Link href={"/admin/correos"}>
          <div className="bg-gray-100 hover:bg-slate-100 rounded-full text-slate-800 hover:text-foreground relative flex items-center justify-center gap-x-1  border-[1px]  border-gray-100  ease-in-out duration-300 cursor-pointer">
            <AiOutlineMail className="text-2xl absolute" />
            <span className="bg-background text-foreground rounded-full font-bold text-xs relative -right-2 -top-2 flex items-center justify-center w-3 h-3 shadow-xl ">
              {emailListData ? emailListData?.length : 0}
            </span>
          </div>
        </Link>
      ) : (
        ""
      )}

      {/** Logout Button */}
      {isLoggedIn && (
        <div
          onClick={() => signOut()}
          className="maxmd:hidden cursor-pointer flex justify-center items-center gap-x-1 "
        >
          <FiLogOut className="text-xl flex text-foreground" />
        </div>
      )}
    </div>
  );
};

export default MiniMenuComponent;
