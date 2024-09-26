"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaPencilAlt,
  FaStar,
  FaInstagramSquare,
  FaExclamationCircle,
} from "react-icons/fa";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import Swal, { SweetAlertIcon } from "sweetalert2";
import SearchProducts from "@/app/admin/productos/search";
import { changeProductAvailability, deleteOneProduct } from "@/app/_actions";
import { FaShop } from "react-icons/fa6";
import { TbWorldWww } from "react-icons/tb";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SocialsProducts = ({
  products,
  filteredProductsCount,
  search,
}: {
  products: any;
  filteredProductsCount: any;
  search: any;
}) => {
  const getPathname = usePathname();
  let pathname: string = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  } else if (getPathname.includes("instagram")) {
    pathname = "instagram";
  }
  const searchParams = useSearchParams();
  const searchValue: any = searchParams.get("page");
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setCurrentPage(searchValue);
  }, [searchValue]);

  const deactivateOnlineHandler = (product_id: string, active: any) => {
    const location = "Online";
    let title: string;
    let text: string;
    let confirmBtn: string;
    let successTitle: string;
    let successText: string;
    let icon: SweetAlertIcon;
    let confirmBtnColor: string;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text =
        "¡Estas a punto de desactivar a este producto en el Sitio Web y quedara sin acceso!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto en el Sitio Web!";
      confirmBtn = "¡Sí, Activar producto!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado.";
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
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateBranchHandler = (product_id: string, active: any) => {
    const location = "Branch";
    let title: string;
    let text: string;
    let confirmBtn: string;
    let successTitle: string;
    let successText: string;
    let icon: SweetAlertIcon;
    let confirmBtnColor: string;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text =
        "¡Estas a punto de desactivar a este producto de la sucursal física y quedara sin acceso!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto a la sucursal física!";
      confirmBtn = "¡Sí, Activar producto!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado.";
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
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateInstagramHandler = (product_id: string, active: any) => {
    const location = "Instagram";
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = "warning";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de desactivar a este producto en Instagram!";
      confirmBtn = "¡Sí, desactivar producto!";
      confirmBtnColor = "#CE7E00";
      successTitle = "Desactivar!";
      successText = "El producto ha sido desactivado en Instagram.";
    } else {
      icon = "success";
      title = "Estas seguro(a)?";
      text = "¡Estas a punto de Activar a este producto en Instagram!";
      confirmBtn = "¡Sí, Activar producto en Instagram!";
      confirmBtnColor = "#228B22";
      successTitle = "Reactivado!";
      successText = "El producto ha sido Activado en Instagram.";
    }
    Swal.fire({
      title: title,
      text: text,
      imageUrl: "/images/instagram_logo_small.webp",
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: "#000",
      confirmButtonText: confirmBtn,
      cancelButtonText: "No, cancelar!",
    }).then((result) => {
      if (result.isConfirmed) {
        changeProductAvailability(product_id, location);
      }
    });
  };

  return (
    <>
      <hr className="my-4 maxsm:my-1" />
      <div className="relative min-h-full shadow-md sm:rounded-lg">
        <div className=" flex flex-row  maxsm:items-start items-center justify-between">
          <h1 className="text-3xl maxsm:text-base mb-2 maxsm:mb-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond w-1/2">
            {`${filteredProductsCount} Productos `}
          </h1>
          <SearchProducts search={search} />
        </div>
        <table className="w-full text-sm  text-left h-full">
          <thead className="text-l text-gray-700 uppercase">
            <tr className="flex flex-row items-center">
              <th
                scope="col"
                className="w-full px-6 maxsm:px-0 py-3 maxsm:hidden"
              >
                Titulo
              </th>
              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Img
              </th>

              <th scope="col" className="w-full px-6 maxsm:px-0 py-3 ">
                Precio
              </th>

              <th scope="col" className="w-full px-1 py-3 ">
                Exst.
              </th>
              <th scope="col" className="w-full px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr
                className={`flex flex-row items-center ${
                  product?.active === true
                    ? "bg-slate-100"
                    : "bg-slate-200 text-slate-400"
                }`}
                key={product?._id}
              >
                <td
                  className={`w-full text-[12px] px-6 maxsm:px-0 py-0 font-bold maxsm:hidden`}
                >
                  {product?.title.substring(0, 20)}...
                </td>

                <td className="w-full px-6 maxsm:px-0 py-0 relative ">
                  <span className="relative flex items-center justify-center text-foreground w-20 h-20 maxsm:w-8 maxsm:h-8 shadow mt-2">
                    <Link
                      href={`/${pathname}/productos/variacion/${product?.slug}?&callback=${searchParams}`}
                    >
                      <Image
                        src={product?.images[0]?.url}
                        alt="Title"
                        width={200}
                        height={200}
                        className="w-20 object-cover h-20 maxsm:w-20 rounded-md"
                      />
                    </Link>

                    {product?.featured ? (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    ) : (
                      ""
                    )}
                  </span>
                </td>
                <td className="w-full px-6 maxsm:px-0 py-0 ">
                  <b>
                    <FormattedPrice amount={product?.variations[0]?.price} />
                  </b>
                </td>

                <td className="w-full px-1 py-0 ">{product?.stock}</td>
                <td className="w-full px-1 py-0 flex flex-row items-center gap-x-1">
                  <Link
                    href={`/${pathname}/productos/variacion/${product?.slug}?&callback=${currentPage}`}
                    className="p-2 inline-block text-white hover:text-foreground bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaPencilAlt className="maxsm:text-[10px]" />
                  </Link>

                  <button
                    onClick={() =>
                      deactivateOnlineHandler(
                        product?._id,
                        product?.availability?.online
                      )
                    }
                    className="p-2 inline-block text-white hover:text-foreground bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <TbWorldWww
                      className={` ${
                        product?.availability?.online === true
                          ? "text-green-800 maxsm:text-[10px]"
                          : "text-slate-400 maxsm:text-[10px]"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      deactivateBranchHandler(
                        product?._id,
                        product?.availability?.branch
                      )
                    }
                    className="p-2 inline-block text-white hover:text-foreground bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaShop
                      className={` ${
                        product?.availability?.branch === true
                          ? "text-green-800 maxsm:text-[10px]"
                          : "text-slate-400 maxsm:text-[10px]"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() =>
                      deactivateInstagramHandler(
                        product?._id,
                        product?.availability?.instagram
                      )
                    }
                    className="p-2 inline-block text-white hover:text-foreground bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaInstagramSquare
                      className={` ${
                        product?.availability.instagram === true
                          ? "bg-gradient-to-tr from-amber-700 to-pink-600 maxsm:text-[10px]"
                          : "text-slate-400 maxsm:text-[10px]"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default SocialsProducts;
