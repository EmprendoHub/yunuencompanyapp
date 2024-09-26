"use client";
import Link from "next/link";
import { AiTwotoneHome } from "react-icons/ai";
import Swal from "sweetalert2";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { deleteAddress } from "@/app/_actions";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  Key,
} from "react";

const ProfileAddressesRender = ({ addresses }: { addresses: any }) => {
  const deleteHandler = (address_id: string) => {
    Swal.fire({
      title: "Estas seguro(a)?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#000",
      confirmButtonText: "¡Sí, eliminar!",
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "El Domicilio ha sido eliminado.",
          icon: "success",
        });
        deleteAddress(address_id);
      }
    });
  };
  return (
    <div className="px-5">
      <hr className="my-4" />

      <Link href="/perfil/direcciones/nueva">
        <button className="px-4 py-2 inline-block text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
          <i className="mr-1 fa fa-plus"></i> Agregar Dirección
        </button>
      </Link>

      <hr className="my-4" />
      {addresses?.map((address: any, index: number) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center "
        >
          <div>
            <Link href={`/perfil/direccion/${address._id}`}>
              <div className="mb-5 gap-4">
                <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md cursor-pointer">
                  <div className="mr-3">
                    <span className="flex items-center justify-center text-foreground w-12 h-12 bg-background rounded-full shadow mt-2">
                      <AiTwotoneHome className=" text-foreground" />
                    </span>
                  </div>
                  <figcaption className="text-gray-600">
                    <p>
                      {address?.street}
                      <br /> {address?.city}, {address?.province},{" "}
                      {address?.zip_code}, {address?.country}
                      <br />
                      Tel: {address?.phone}
                    </p>
                  </figcaption>
                </figure>
              </div>
            </Link>
          </div>
          <div className="flex flex-col justify-between items-center gap-1">
            <span>
              <Link
                key={index}
                href={`/perfil/direccion/${address._id}`}
                className="px-2 py-2 inline-block text-white hover:text-blue-600 bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
              >
                <FaPencilAlt className="" />
              </Link>
            </span>
            <span>
              <button
                onClick={() => deleteHandler(address._id)}
                className="px-2 py-2 inline-block text-white hover:text-red-600 bg-red-600 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
              >
                <FaTrash className="" />
              </button>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileAddressesRender;
