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

const POSCart = () => {
  const router = useRouter();
  const { productsPOS } = useSelector((state: any) => state?.compras);
  const dispatch = useDispatch();

  return (
    <div className="">
      <section className="pb-10 bg-gray-100">
        <div className=" mx-auto bg-background ">
          <div className="flex flex-col gap-2">
            <section className=" bg-gray-100">
              <div className=" mx-auto px-4">
                <h2 className="text-lg font-semibold mt-2 font-EB_Garamond">
                  {productsPOS?.length || 0} Artículos(s) en carrito
                </h2>
              </div>
            </section>
            <main className="w-full">
              {/* Items */}
              <article className="border border-gray-200 shadow-sm rounded mb-1 px-4">
                {productsPOS?.length > 0 &&
                  productsPOS?.map(
                    (
                      cartItem: {
                        image: string | StaticImport;
                        title: string;
                        brand: string;
                        color: string;
                        size: string | number;
                        quantity: number;
                        price: number;
                        _id: any;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <div key={index}>
                        <div className="flex flex-row maxmd:flex-wrap gap-5  mb-1 items-center">
                          <div className="w-full">
                            <figure className="flex gap-1 leading-5">
                              <div>
                                <div className="block w-12 h-12 rounded border border-gray-300 overflow-hidden">
                                  <Image
                                    src={cartItem?.image}
                                    alt="Title"
                                    width={80}
                                    height={80}
                                  />
                                </div>
                              </div>
                            </figure>
                          </div>
                          <div className="w-full">
                            <div className="flex items-center text-lg text-foreground  justify-between">
                              <span
                                onClick={() =>
                                  dispatch(decreasePOSQuantity(cartItem))
                                }
                                className="cursor-pointer"
                              >
                                <FiChevronLeft size={40} />
                              </span>
                              <span>{cartItem?.quantity || 1}</span>
                              <span
                                onClick={() =>
                                  dispatch(increasePOSQuantity(cartItem))
                                }
                                className="cursor-pointer"
                              >
                                <FiChevronRight size={40} />
                              </span>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="leading-5">
                              <p className="font-semibold not-italic">
                                $
                                {(
                                  cartItem?.price * cartItem?.quantity || 1
                                ).toFixed(2)}
                              </p>
                              <p className="text-gray-400 text-[12px] leading-tight">
                                ${cartItem?.price} x articulo
                              </p>
                            </div>
                          </div>
                          <div className="flex-auto">
                            <div className="float-right">
                              <span
                                onClick={() =>
                                  dispatch(deletePOSProduct(cartItem?._id))
                                }
                                className="text-red-400 hover:text-red-600 cursor-pointer duration-300"
                              >
                                <AiOutlineClose size={30} />
                              </span>
                            </div>
                          </div>
                        </div>

                        <hr className="my-1" />
                      </div>
                    )
                  )}
              </article>
            </main>
            <aside className="max-w-full">
              <POSCheckOutForm />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default POSCart;
