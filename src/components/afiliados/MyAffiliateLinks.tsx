"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AiTwotoneHome } from "react-icons/ai";
import AuthContext from "@/context/AuthContext";
import Swal from "sweetalert2";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const MyAffiliateLinks = ({ currentCookies }: { currentCookies: any }) => {
  const { getAllAffiliateLinks } = useContext(AuthContext);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function getLinks() {
      const data = await getAllAffiliateLinks(currentCookies);
      setLinks(data);
    }
    getLinks();
  }, [getAllAffiliateLinks]);

  const deleteHandler = (link_id: any) => {
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
          text: "El Enlace ha sido eliminado.",
          icon: "success",
        });
        //deleteAddress(link_id);
      }
    });
  };
  return (
    <div className="px-5">
      <hr className="my-4" />

      <Link href="/afiliado/enlaces/nuevo">
        <button className="px-4 py-2 inline-block text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
          <i className="mr-1 fa fa-plus"></i> Agregar Enlace
        </button>
      </Link>

      <hr className="my-4" />
      {links?.map((link: any, index: number) => (
        <div
          key={index}
          className="flex flex-row justify-between items-center "
        >
          <div>
            <div className="mb-5 gap-4">
              <figure className="w-full flex align-center bg-gray-100 p-4 rounded-md ">
                <div className="mr-3">
                  <span className="flex items-center justify-center text-foreground w-12 h-12 bg-background rounded-full shadow mt-2">
                    <AiTwotoneHome className=" text-foreground" />
                  </span>
                </div>
                <figcaption className="text-gray-600">
                  <p>
                    <br />
                    Enlace de Afiliado:{" "}
                    {`${link?.link?.targetUrl}?alink=${link?.link?._id}`}
                    <br />
                    Codigo Unico: {link?.link?._id}
                    <br />
                    Metadata: {link?.link?.metadata}
                    <br />
                    Clicks: {link?.events.length}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center gap-1">
            <span>
              <button
                onClick={() => deleteHandler(link._id)}
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

export default MyAffiliateLinks;
