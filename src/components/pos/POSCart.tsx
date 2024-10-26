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
    <div className="mt-4 mr-2 flex top-5 right-2 w-1/3 maxsm:top-0">
      <section className="bg-gray-100 w-full">
        <div className="mx-auto bg-background">
          <div className="flex flex-col gap-1">
            <main className="w-full maxsm:h-40 h-80 overflow-y-scroll border-gray-200 border rounded">
              {/* Items */}
              <article className="border  shadow-sm rounded mb-1 p-2 bg-card">
                {productsPOS?.length > 0 &&
                  productsPOS?.map((cartItem: CartItem, index: number) => (
                    <div key={index}>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="w-full maxsm:hidden">
                          <figure className="flex gap-1 leading-5">
                            <div>
                              <div className="block w-12 h-12 rounded border  overflow-hidden">
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
                              <FiChevronLeft className="w-10 h-10 maxsm:w-4 maxsm:h-4 mr-5" />
                            </span>
                            <span className="text-2xl maxsm:text-[12px]">
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
                              <FiChevronRight className="w-10 h-10 maxsm:w-4 maxsm:h-4 mx-5" />
                            </span>
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
                              <AiOutlineClose className="w-5 h-5 maxsm:w-4 maxsm:h-4 " />
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
