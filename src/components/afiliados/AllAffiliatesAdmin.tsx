"use client";
import Link from "next/link";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { SweetAlertIcon } from "sweetalert2";
import AdminAffiliateSearch from "../layout/AdminAffiliateSearch";
import { updateAffiliate } from "@/app/_actions";
import { TiCancel } from "react-icons/ti";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  Key,
} from "react";

interface AffiliateProps {
  isActive: boolean;
  _id: string;
  fullName: string;
  stripe_id: any;
  contact: {
    phone:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | ReactPortal
      | Promise<AwaitedReactNode>
      | null
      | undefined;
  };
  email: string;
}

const AllAffiliatesAdmin = ({
  affiliates,
  filteredAffiliatesCount,
}: {
  affiliates: any;
  filteredAffiliatesCount: any;
}) => {
  const updateHandler = (affiliate_id: string, isActive: boolean) => {
    let title: string;
    let text: string;
    let confirmBtn: string;
    let successTitle: string;
    let successText: string;
    let icon: SweetAlertIcon; // Ensure the icon is typed correctly
    let confirmBtnColor: string;
    if (isActive === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text =
        "¡Estas a punto de desactivar a este asociado y quedara sin acceso!";
      confirmBtn = "¡Sí, desactivar asociado!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El asociado ha sido desactivado.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de reactivar a este asociado!";
      confirmBtn = "¡Sí, reactivar asociado!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El asociado ha sido reactivado.";
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: "#000",
      confirmButtonText: confirmBtn,
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: "success",
        });
        updateAffiliate(affiliate_id);
      }
    });
  };

  return (
    <>
      <hr className="my-4" />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className=" flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          {" "}
          <h1 className="text-3xl my-5 ml-4 font-bold font-EB_Garamond">
            {`${filteredAffiliatesCount} Afiliados `}
          </h1>
          <AdminAffiliateSearch />
        </div>
        <table className="w-full text-sm  text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Nombre
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Stripe
              </th>

              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                Teléfono
              </th>
              <th scope="col" className="px-1 py-3 ">
                Email
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {affiliates?.map(
              (affiliate: AffiliateProps, index: Key | null | undefined) => (
                <tr
                  className={` ${
                    affiliate?.isActive === true
                      ? "bg-slate-100"
                      : "bg-slate-200 text-slate-400"
                  }`}
                  key={index}
                >
                  <td className="px-6 maxsm:px-2 py-2 ">
                    <Link key={index} href={`/admin/asociado/${affiliate._id}`}>
                      {affiliate.fullName.substring(0, 15)}...
                    </Link>
                  </td>
                  <td className="px-6 maxsm:px-0 py-2 relative ">
                    {affiliate.stripe_id ? "Verificado" : "No Verificado"}
                  </td>
                  <td className="px-6 maxsm:px-0 py-2 maxmd:hidden">
                    <b>{affiliate.contact.phone}</b>
                  </td>
                  <td className="px-1 py-2 ">
                    {affiliate.email.substring(0, 12)}...
                  </td>
                  <td className="px-1 py-2  w-24 flex flex-row">
                    <div>
                      <Link
                        href={`/admin/asociado/${affiliate._id}`}
                        className="px-2 py-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                      >
                        <FaPencilAlt className="" />
                      </Link>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          updateHandler(affiliate._id, affiliate.isActive)
                        }
                        className="px-2 py-2 inline-block text-white hover:text-foreground bg-slate-400 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                      >
                        <TiCancel className="" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AllAffiliatesAdmin;
