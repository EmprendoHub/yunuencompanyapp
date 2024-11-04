"use client";
import Link from "next/link";
import { formatSpanishDate } from "@/backend/helpers";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { TbDeselect } from "react-icons/tb";
import ModalCancelExpense from "./ModalCancelExpense";
import exp from "constants";

const POSExpenses = ({
  expenses,
  filteredExpensesCount,
}: {
  expenses: any;
  filteredExpensesCount: any;
}) => {
  const getPathname = usePathname();
  let pathname: any = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  }
  const [showModal, setShowModal] = useState(false);
  const [usedExpenseId, setUsedExpenseId] = useState("");

  const updateExpenseStatus = async (expense: any) => {
    setUsedExpenseId(expense._id.toString());
    setShowModal(true);
  };
  return (
    <>
      <ModalCancelExpense
        showModal={showModal}
        setShowModal={setShowModal}
        expenseId={usedExpenseId}
        pathname={pathname}
        isPaid={false}
      />
      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          <h1 className="text-3xl w-full maxsm:text-xl my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond">
            {`${filteredExpensesCount} Gastos `}
          </h1>
          {/* <AdminOrderSearch /> */}
        </div>
        <table className="w-full text-sm maxsm:xs text-left">
          <thead className=" text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3">
                Detalle
              </th>
              <th scope="col" className="px-2 py-3 maxmd:hidden">
                Cantidad
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Tipo
              </th>
              <th scope="col" className="px-2 maxsm:px-0 py-3">
                Sucursal
              </th>
              <th scope="col" className="px-6 py-3 maxsm:hidden">
                Fecha
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense: any, index: number) => (
              <tr
                className={`bg-background ${
                  expense?.expenseStatus === "cancelada" && "text-muted"
                }`}
                key={index}
              >
                <td className="px-6 maxsm:px-2 py-2">
                  <Link
                    key={index}
                    href={`/${pathname}/gastos/gasto/${expense._id}`}
                  >
                    {expense.comment}
                  </Link>
                </td>
                <td className="px-2 py-2 maxmd:hidden">
                  <b>
                    <FormattedPrice amount={expense?.amount} />
                  </b>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">{expense?.type}</td>
                <td className="px-2 py-2 maxsm:hidden text-xs">
                  {expense?.user.name.substring(0, 7)}
                </td>
                <td className="px-2 py-2 maxsm:hidden text-xs">
                  {expense?.pay_date && formatSpanishDate(expense?.pay_date)}
                </td>
                <td className="px-1 py-2">
                  <div className="flex items-center ">
                    <Link
                      href={`/${pathname}/gastos/gasto/${expense._id}`}
                      className="px-2 py-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <FaEye className="" />
                    </Link>

                    {expense?.expenseIntent !== "cancelada" ? (
                      <button
                        onClick={() => updateExpenseStatus(expense)}
                        className={`px-2 py-2 inline-block text-foreground hover:text-foreground bg-red-700
                       shadow-sm border border-gray-200 rounded-md hover:scale-110 cursor-pointer mr-2 duration-200 ease-in-out`}
                      >
                        <TbDeselect className="text-white" />
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default POSExpenses;
