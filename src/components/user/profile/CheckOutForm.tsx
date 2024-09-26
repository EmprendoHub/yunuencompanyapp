"use client";
import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import FormattedPrice from "@/backend/helpers/FormattedPrice";

const CheckOutForm = () => {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const { productsData } = useSelector((state: any) => state.compras);

  const amountTotal = productsData?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const shipAmount = 0;
  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  return (
    <section className="p-2 maxsm:py-7 bg-gray-100">
      <div className="container max-w-screen-xl mx-auto bg-background flex flex-col justify-between p-2">
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
              {productsData?.reduce(
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
          <li>
            <div className="border-b-[1px] border-b-slate-300 py-2">
              <div className="flex items-center justify-between">
                <p className=" font-medium  font-EB_Garamond">
                  Apártalo por solo
                </p>
                <p>
                  <FormattedPrice amount={layawayAmount} />
                </p>
              </div>
            </div>
          </li>
        </ul>

        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-1">
            <Link
              href="/carrito/envio"
              className="text-slate-100 text-center bg-black mt-4 py-3 px-6 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer w-full"
            >
              Continuar
            </Link>

            <Link
              href="/tienda"
              className="px-4 mt-3 py-3 inline-block text-lg w-full text-center font-medium bg-background shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 text-foreground  font-EB_Garamond"
            >
              Regresar a la Tienda
            </Link>
          </div>
        ) : (
          <div>
            {/** Login/Register */}
            {!session && (
              <>
                <Link href={"/iniciar"}>
                  <div className=" w-1/4 maxmd:w-2/3 sm:w-full bg-black text-slate-100 mt-4 py-3 px-6 hover:bg-green-600 duration-500 cursor-pointer">
                    <div className="flex flex-row justify-center items-center gap-x-3 ">
                      <AiOutlineUser className="text-ld" />
                      <p className="text-sm font-base">Iniciar/Registro</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/tienda"
                  className="px-4 py-3 inline-block text-lg w-full text-center font-medium bg-background shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 text-foreground  font-EB_Garamond"
                >
                  Regresar a la Tienda
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

export default CheckOutForm;
