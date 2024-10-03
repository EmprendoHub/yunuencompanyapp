"use client";
import React from "react";
import Image from "next/image";
import {
  decreasePOSQuantity,
  deletePOSProduct,
  increasePOSQuantity,
} from "@/redux/shoppingSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import POSCheckOutForm from "./POSCheckOutForm";
import { usePathname, useRouter } from "next/navigation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface CartItem {
  _id: string;
  image: string | StaticImport;
  title: string;
  brand: string;
  color: string;
  size: string | number;
  quantity: number;
  price: number;
  stock: { amount: number; branch: string }[];
}

const POSCart = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { productsPOS } = useSelector((state: any) => state?.compras);
  const dispatch = useDispatch();

  return (
    <div className="mt-4 mr-2 fixed top-5 right-2 maxsm:w-[80%] maxsm:top-0">
      <section className="bg-gray-100">
        <div className="mx-auto bg-background">
          <div className="flex flex-col gap-1">
            <section className="bg-background maxsm:hidden">
              <div className="mx-auto px-4">
                <h2 className="text-base font-semibold font-EB_Garamond">
                  {productsPOS?.length || 0} Artículos(s) en carrito
                </h2>
              </div>
            </section>
            <main className="w-full maxsm:h-40 h-80 overflow-y-scroll">
              {/* Items */}
              <article className="border border-gray-200 shadow-sm rounded mb-1 p-2 bg-gray-100">
                {productsPOS?.length > 0 &&
                  productsPOS?.map((cartItem: CartItem, index: number) => (
                    <div key={index}>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="w-full maxsm:hidden">
                          <figure className="flex gap-1 leading-5">
                            <div>
                              <div className="block w-12 h-12 rounded border border-gray-300 overflow-hidden">
                                <Image
                                  src={cartItem.image}
                                  alt={cartItem.title}
                                  width={80}
                                  height={80}
                                />
                              </div>
                            </div>
                          </figure>
                        </div>
                        <div className="w-full">
                          <div className="flex items-center text-lg text-foreground justify-between">
                            <span
                              onClick={() =>
                                dispatch(
                                  decreasePOSQuantity({ _id: cartItem._id })
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FiChevronLeft className="w-8 h-8 maxsm:w-4 maxsm:h-4" />
                            </span>
                            <span className="text-base maxsm:text-[12px]">
                              {cartItem.quantity}
                            </span>
                            <span
                              onClick={() =>
                                dispatch(
                                  increasePOSQuantity({
                                    _id: cartItem._id,
                                    branchId: userId,
                                  })
                                )
                              }
                              className="cursor-pointer"
                            >
                              <FiChevronRight className="w-8 h-8 maxsm:w-4 maxsm:h-4" />
                            </span>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="leading-5">
                            <p className="font-semibold not-italic maxsm:text-xs">
                              ${(cartItem.price * cartItem.quantity).toFixed(2)}
                            </p>
                            <p className="text-gray-400 text-[12px] maxsm:hidden leading-tight">
                              ${cartItem.price} x articulo
                            </p>
                          </div>
                        </div>
                        <div className="flex-auto">
                          <div className="float-right">
                            <span
                              onClick={() =>
                                dispatch(deletePOSProduct(cartItem._id))
                              }
                              className="text-red-400 hover:text-red-600 cursor-pointer duration-300"
                            >
                              <AiOutlineClose className="w-6 h-6 maxsm:w-4 maxsm:h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <hr className="my-1" />
                    </div>
                  ))}
              </article>
            </main>
            <aside className="max-w-full">
              <POSCheckOutForm userId={userId} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default POSCart;
