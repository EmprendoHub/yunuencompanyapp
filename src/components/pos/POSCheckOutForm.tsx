"use client";
import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { usePathname } from "next/navigation";

const POSCheckOutForm = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const { productsPOS } = useSelector((state: any) => state.compras);
  const amountTotal = productsPOS?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );
  const getPathname = usePathname();
  let pathname;
  if (getPathname.includes("admin")) {
    pathname = "/admin/pos";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "/puntodeventa";
  } else if (getPathname.includes("instagram")) {
    pathname = "/instagram";
  }
  const shipAmount = 0;
  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  return (
    <section className="max-w-full p-2 maxsm:py-7 bg-gray-100">
      <div className=" mx-auto bg-background flex flex-col justify-between p-2">
        <h2>Totales</h2>
        <ul className="mb-5">
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Sub-Total:</span>
            <span>
              <FormattedPrice amount={amountTotal} />
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Total de Artículos:</span>
            <span className="text-blue-500">
              {productsPOS?.reduce(
                (acc: any, cartItem: any) => acc + cartItem.quantity,
                0
              )}
              (Artículos)
            </span>
          </li>
          <li className="flex justify-between text-gray-600  mb-1">
            <span>Envió:</span>
            <span>
              <FormattedPrice amount={shipAmount} />
            </span>
          </li>
          <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
            <span>Total:</span>
            <span>
              <FormattedPrice amount={totalAmountCalc} />
            </span>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-5 w-full">
              <Link
                href={`${pathname}/caja`}
                className="text-slate-100 text-center bg-emerald-700 border mt-4 py-3 px-6  hover:bg-slate-200 hover:border-slate-400 hover:border hover:text-foreground duration-300 ease-in-out cursor-pointer min-w-full"
              >
                Continuar
              </Link>
            </div>

            <Link
              href={`${pathname}/qr/scanner`}
              className="px-4 mt-3 py-3 inline-block text-lg w-full text-center font-medium bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 text-white hover:text-foreground font-EB_Garamond duration-300 ease-in-out"
            >
              Escanear mas Productos
            </Link>
          </div>
        ) : (
          <div>
            {/** Login/Register */}
            {!session && (
              <>
                <Link href={"/iniciar"}>
                  <div className=" w-full bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-green-600 duration-500 cursor-pointer">
                    <div className="flex flex-row justify-center items-center gap-x-3 ">
                      <AiOutlineUser className="text-ld" />
                      <p className="text-sm font-base">Iniciar/Registro</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href={`${pathname}/qr/scanner`}
                  className="px-4 py-3 inline-block text-lg w-full text-center font-medium bg-background shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 text-foreground font-EB_Garamond"
                >
                  Escanear mas Productos
                </Link>
              </>
            )}
            <p className="text-sm mt-1 text-red-600 py-2">
              Por favor inicie sesión para continuar
            </p>
          </div>
        )}
        <div className="trustfactor-class">
          <Image
            src={"/images/stripe-badge-transparente.webp"}
            width={500}
            height={200}
            alt="Stripe Payment"
          />
        </div>
      </div>
    </section>
  );
};

export default POSCheckOutForm;
