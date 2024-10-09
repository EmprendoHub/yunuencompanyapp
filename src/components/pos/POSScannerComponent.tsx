"use client";
import { addToPOSCart } from "@/redux/shoppingSlice";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const POSScannerComponent = ({
  product,
  variation,
  error,
}: {
  product: any;
  variation: any;
  error?: any;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { productsPOS } = useSelector((state: any) => state?.compras);
  const pathname = usePathname();

  useEffect(() => {
    const productExists = productsPOS.some(
      (product: any) => product._id === variation._id
    );

    if (productExists) {
      const cartProduct = productsPOS.find(
        (product: any) => product._id === variation._id
      );
      if (variation?.stock <= cartProduct?.quantity) {
        Swal.fire({
          title: "¡Yas esta en Carrito!",
          text: "Este producto ya esta en el carrito y no tiene mas existencias.",
          icon: "error",
          confirmButtonColor: "#008000",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            if (pathname.includes("admin")) {
              router.push("/admin/pos/carrito");
            } else if (pathname.includes("puntodeventa")) {
              router.push("/puntodeventa/carrito");
            } else if (pathname.includes("socials")) {
              router.push("/socials/carrito");
            }
          }
        });
      } else {
        dispatch(addToPOSCart(variation));
        if (pathname.includes("admin")) {
          router.push("/admin/pos/carrito");
        } else if (pathname.includes("puntodeventa")) {
          router.push("/puntodeventa/carrito");
        } else if (pathname.includes("socials")) {
          router.push("/socials/carrito");
        }
      }
    } else {
      if (variation?.stock > 0) {
        dispatch(addToPOSCart(variation));
        if (pathname.includes("admin")) {
          router.push("/admin/pos/carrito");
        } else if (pathname.includes("puntodeventa")) {
          router.push("/puntodeventa/carrito");
        } else if (pathname.includes("socials")) {
          router.push("/socials/carrito");
        }
      } else {
        Swal.fire({
          title: "¡Sin Existencias!",
          text: "Este producto se vendió en la tienda en linea.",
          icon: "error",
          confirmButtonColor: "#008000",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            if (pathname.includes("admin")) {
              router.push("/admin/pos/qr/scanner");
            } else if (pathname.includes("puntodeventa")) {
              router.push("/puntodeventa/qr/scanner");
            } else if (pathname.includes("socials")) {
              router.push("/socials/qr/scanner");
            }
          }
        });
      }
    }
    //eslint-disable-next-line
  }, [product]);

  return (
    <div className="flex items-center justify-center h-screen">Cargando...</div>
  );
};

export default POSScannerComponent;
