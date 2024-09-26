import { formatDate, formatTime, getTotalFromItems } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import Link from "next/link";
import { FaPencilAlt } from "react-icons/fa";

const ViewUserOrders = ({
  orders,
  filteredOrdersCount,
  client,
}: {
  orders: any;
  filteredOrdersCount: number;
  client: any;
}) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="text-3xl my-5 ml-4 font-bold font-EB_Garamond">
        {`${filteredOrdersCount}
        Pedidos para ${client.name}`}
      </h1>

      <table className="w-full text-sm text-left">
        <thead className="text-l text-gray-700 uppercase">
          <tr>
            <th scope="col" className="px-6 maxsm:px-1 py-3">
              No.
            </th>
            <th scope="col" className="px-6 maxsm:px-1 maxsm:hidden py-3">
              Total
            </th>
            <th scope="col" className="px-6 maxsm:px-1 py-3">
              Pagado
            </th>
            <th scope="col" className="px-6 maxsm:px-1 py-3">
              Estado
            </th>
            <th scope="col" className="px-6 maxsm:px-1  maxsm:hidden py-3">
              Fecha
            </th>
            <th scope="col" className="px-2 maxsm:px-1 py-3 text-center">
              ...
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order: any, index: number) => (
            <tr className="bg-background" key={index}>
              <td className="px-6 maxsm:px-1 py-2">
                <Link
                  href={`/admin/pedido/${order._id}`}
                  className="px-2 py-2 inline-block text-foreground shadow-sm border border-gray-200 rounded-md bg-gray-100 cursor-pointer mr-2"
                >
                  {order.orderId}
                </Link>
              </td>
              <td className="px-6 maxsm:px-1  maxsm:hidden py-2">
                <FormattedPrice amount={getTotalFromItems(order.orderItems)} />
              </td>
              <td className="px-6 maxsm:px-1 py-2 ">
                <b>
                  <FormattedPrice amount={order?.paymentInfo?.amountPaid} />
                </b>
              </td>
              <td
                className={`px-6 maxsm:px-1 py-2 font-bold ${
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
              <td className="px-6 maxsm:px-1  maxsm:hidden py-2">
                {order?.createdAt &&
                  `${formatDate(
                    order?.createdAt.substring(0, 24)
                  )} a las ${formatTime(order?.createdAt)}`}
              </td>
              <td className="px-2 maxsm:px-1 py-2">
                <div>
                  <Link
                    href={`/admin/pedido/${order._id}`}
                    className="px-2 py-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                  >
                    <FaPencilAlt className="" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUserOrders;
