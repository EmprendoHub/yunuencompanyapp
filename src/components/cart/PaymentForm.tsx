"use client";
import React from "react";
import { useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { resetCart, saveOrder } from "@/redux/shoppingSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { revalidatePath } from "next/cache";

const PaymentForm = () => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const { productsData, shippingInfo, userInfo, affiliateInfo } = useSelector(
    (state: any) => state.compras
  );

  const amountTotal = productsData?.reduce(
    (acc: any, cartItem: any) => acc + cartItem.quantity * cartItem.price,
    0
  );

  const shipAmount = 0;
  const layawayAmount = Number(amountTotal) * 0.3;

  const totalAmountCalc = Number(amountTotal) + Number(shipAmount);

  // Helper function to extract device information from user agent string

  //=============================== Stripe Payment starts here ============================

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE__KEY!);
  const handleCheckout = async (payType: any) => {
    const stripe = await stripePromise;

    const response = await fetch(`/api/checkout?${payType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: productsData,
        email: session?.user?.email,
        user: userInfo,
        shipping: shippingInfo,
        affiliateInfo: affiliateInfo,
        payType: payType,
      }),
    });

    try {
      const data = await response.json();

      dispatch(saveOrder({ order: productsData, id: data.id }));
      stripe?.redirectToCheckout({ sessionId: data.id });
      dispatch(resetCart());
      revalidatePath("/admin/pedidos");
    } catch (error) {
      console.log(error);
    }
  };

  //=============================== Stripe Payment ends here ============================
  return (
    <section className="p-2 maxsm:py-7 bg-gray-100">
      <div className=" max-w-screen-xl mx-auto bg-background flex flex-col justify-between p-2">
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
            <span className="text-green-500">
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
            <button
              onClick={() => handleCheckout("layaway")}
              className=" text-slate-100 bg-violet-950 mt-4 py-3 px-6 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer w-full"
            >
              Apartar Artículos{" "}
            </button>
            <button
              onClick={() => handleCheckout("total")}
              className="bg-black w-full text-slate-100 mt-4 py-3 px-6 hover:bg-slate-200 hover:text-foreground duration-300 ease-in-out cursor-pointer"
            >
              Pagar Total{" "}
            </button>
            <p>Si realizaste un pago por Oxxo o Transferencia Bancaria</p>
            <p>
              Permite hasta 24 horas después de tu pago para que se refleje en
              tu cuenta.
            </p>
            <Link
              href="/carrito"
              className="w-full mt-4 text-center px-5 py-2 inline-block text-gray-700 bg-background shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 hover:text-blue-600"
            >
              Regresar
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
                      <p className="text-sm font-base">Iniciar</p>
                    </div>
                  </div>
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

export default PaymentForm;
