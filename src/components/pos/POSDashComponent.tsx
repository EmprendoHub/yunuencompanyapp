import Link from "next/link";
import React from "react";
import { MdAttachMoney } from "react-icons/md";
import { IoArrowRedoSharp } from "react-icons/io5";
import FormattedPrice from "@/backend/helpers/FormattedPrice";

const POSDashComponent = ({
  clients,
  orders,
  dailyOrdersTotals,
  orderCountPreviousMonth,
  totalOrderCount,
  totalProductCount,
  thisWeeksOrder,
  thisWeekOrderTotals,
  products,
}: {
  clients?: any;
  orders: any;
  orderCountPreviousMonth: any;
  totalOrderCount: any;
  totalProductCount: any;
  dailyOrdersTotals: any;
  thisWeeksOrder: any;
  thisWeekOrderTotals: any;
  products: any;
}) => {
  return (
    <div className="p-3 md:mx-auto  text-slate-700">
      <div className="flex-row maxsm:flex-col flex gap-4 justify-start w-full">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md">
            <div className="flex justify-between">
              <div className="">
                <h3 className="text-gray-500 text-md uppercase">
                  Ventas del Dia
                </h3>
                <p className="text-2xl  text-slate-700">
                  <FormattedPrice amount={dailyOrdersTotals || 0} />
                </p>
              </div>
              <MdAttachMoney className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col p-3 dark:bg-slate-300 gap-4 w-full rounded-md shadow-md"></div>
        </div>
      </div>
      <div className="flex flex-row maxsm:flex-col gap-4 py-3 mx-auto justify-start">
        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start">
          <div className="flex flex-col w-full shadow-md p-5 rounded-md dark:bg-slate-300">
            <div className="flex justify-between py-3 text-base font-black font-EB_Garamond">
              <h1>Ventas recientes</h1>
              <button>
                <Link href={"/admin/pedidos"}>Ver todas</Link>
              </button>
            </div>
            <table>
              <thead>
                <tr className="flex justify-between mb-4">
                  <th>No.</th>
                  <th>Status</th>
                  <th>...</th>
                </tr>
              </thead>
              {orders &&
                orders.map((order: any) => (
                  <tbody key={order._id} className="divide-y">
                    <tr className="bg-background flex justify-between dark:border-gray-700 dark:bg-slate-300 mb-4">
                      <td>{order.orderId}</td>
                      <td>{order.orderStatus}</td>
                      <td>
                        <Link href={`/admin/pedido/${order._id}`}>
                          <IoArrowRedoSharp className=" text-teal-600 " />
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>

        <div className="w-full flex flex-row maxmd:flex-col gap-4 justify-start items-start"></div>
      </div>
    </div>
  );
};

export default POSDashComponent;
