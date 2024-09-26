"use client";
import React from "react";
import { formatDate, formatTime } from "@/backend/helpers";
import { getTotalFromItems } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import AdminOrderSearch from "@/components/layout/AdminOrderSearch";

const AfiliadoOrders = ({
  orders,
  filteredOrdersCount,
}: {
  orders: any;
  filteredOrdersCount: any;
}) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
        <h1 className="text-3xl w-full maxsm:text-xl my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond">
          {`${filteredOrdersCount} Pedidos `}
        </h1>
        <AdminOrderSearch />
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-l text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Pedido
            </th>
            <th scope="col" className="px-6 py-3 maxmd:hidden">
              Total
            </th>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Pagado
            </th>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Commission 10%
            </th>
            <th scope="col" className="px-6 maxsm:px-0 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 py-3 maxsm:hidden">
              Fecha
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: any, index: number) => (
            <tr className="bg-background" key={index}>
              <td className="px-6 maxsm:px-2 py-2">{order.orderId}</td>
              <td className="px-6 py-2 maxmd:hidden">
                <FormattedPrice amount={getTotalFromItems(order.orderItems)} />
              </td>
              <td className="px-6 maxsm:px-0 py-2 ">
                <b>{order?.paymentInfo?.status}</b>
              </td>
              <td className="px-6 maxsm:px-0 py-2 ">
                <b>
                  <FormattedPrice
                    amount={order?.paymentInfo?.amountPaid * 0.1}
                  />
                </b>
              </td>
              <td
                className={`px-6 maxsm:px-0 py-2 font-bold ${
                  order.orderStatus === "Apartado"
                    ? "text-amber-700"
                    : order.orderStatus === "En Camino"
                    ? "text-blue-700"
                    : order.orderStatus === "Entregado"
                    ? "text-green-700"
                    : "text-slate-600"
                }`}
              >
                {order.orderStatus}
              </td>
              <td className="px-6 py-2 maxsm:hidden">
                {order?.createdAt &&
                  `${formatDate(
                    order?.createdAt.substring(0, 24)
                  )} a las ${formatTime(order?.createdAt)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AfiliadoOrders;
