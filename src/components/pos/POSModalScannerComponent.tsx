"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import ModalProductCard from "@/components/products/ModalProductCard";

const POSModalScannerComponent = ({
  product,
  variation,
  error,
}: {
  product: any;
  variation: any;
  error: any;
}) => {
  const router = useRouter();
  const { productsPOS } = useSelector((state: any) => state?.compras);
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  const backdropVariants = {
    animate: { opacity: 1, scale: 1 },
    initial: { opacity: 0, scale: 0.5 },
  };
  useEffect(() => {
    const productExists = productsPOS.some(
      (product: any) => product._id === variation._id
    );

    if (productExists) {
      setShowModal(true);
    } else {
      if (variation?.stock > 0) {
        setShowModal(true);
      } else {
        if (error && error.length > 0) {
          Swal.fire({
            title: error,
            text: error,
            icon: "error",
            confirmButtonColor: "#008000",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setShowModal(true);
            }
          });
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
                router.push("/admin/pos/qr/idscanner");
              } else if (pathname.includes("puntodeventa")) {
                router.push("/puntodeventa/qr/idscanner");
              } else if (pathname.includes("socials")) {
                router.push("/socials/qr/idscanner");
              }
            }
          });
        }
      }
    }
    //eslint-disable-next-line
  }, [product]);

  return (
    <AnimatePresence mode="wait">
      {showModal ? (
        <motion.div
          className="backdrop fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-[555] flex justify-center items-center"
          variants={backdropVariants}
          transition={{ duration: 0.5 }}
          initial="initial"
          animate="animate"
        >
          <ModalProductCard item={product} setShowModal={setShowModal} />
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-screen">
          Cargando...
        </div>
      )}
    </AnimatePresence>
  );
};

export default POSModalScannerComponent;
