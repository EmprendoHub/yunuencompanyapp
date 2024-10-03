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
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const POSIdResults = ({ userId }: { userId: string }) => {
  const { productsPOS } = useSelector((state: any) => state?.compras);
  const dispatch = useDispatch();

  return (
    <div className="w-full">
      <section className="mt-5  bg-gray-100">
        <div className=" mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2 font-EB_Garamond">
            {productsPOS?.length || 0} Artículos(s) Escaneados
          </h2>
        </div>
      </section>

      {productsPOS?.length > 0 && (
        <section className="pb-10 bg-gray-100">
          <div className="container  mx-auto bg-background p-5">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="w-full">
                <article className="border border-gray-200  shadow-sm rounded p-3 lg:p-5"></article>
                {/* Items */}
                <article className="border border-gray-200 shadow-sm rounded mb-5 p-3 lg:p-5">
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
                              <figure className="flex gap-3 leading-5">
                                <div>
                                  <div className="block w-16 h-16 rounded border border-gray-200 overflow-hidden">
                                    <Image
                                      src={cartItem?.image}
                                      alt="Title"
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                </div>
                                <figcaption className="ml-3">
                                  <p>{cartItem?.title}</p>
                                  <p className="mt-1 text-gray-400">
                                    Marca: {cartItem?.brand}
                                  </p>
                                </figcaption>
                                <div>{cartItem.color}</div>
                                <div>{cartItem.size}</div>
                              </figure>
                            </div>
                            <div className="w-24">
                              <div className="flex items-center text-lg text-foreground  w-20 justify-between">
                                <span
                                  onClick={() =>
                                    dispatch(decreasePOSQuantity(cartItem))
                                  }
                                  className="cursor-pointer"
                                >
                                  <FiChevronLeft />
                                </span>
                                <span>{cartItem?.quantity || 1}</span>
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
                                  <FiChevronRight />
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="leading-5">
                                <p className="font-semibold not-italic">
                                  $
                                  {(
                                    cartItem?.price * cartItem?.quantity || 1
                                  ).toFixed(2)}
                                </p>
                                <small className="text-gray-400">
                                  {" "}
                                  ${cartItem?.price} / por articulo{" "}
                                </small>
                              </div>
                            </div>
                            <div className="flex-auto">
                              <div className="float-right">
                                <span
                                  onClick={() =>
                                    dispatch(deletePOSProduct(cartItem?._id))
                                  }
                                  className="text.lg hover:text-red-600 cursor-pointer duration-300"
                                >
                                  <AiOutlineClose />
                                </span>
                              </div>
                            </div>
                          </div>

                          <hr className="my-4" />
                        </div>
                      )
                    )}
                </article>
              </main>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default POSIdResults;
