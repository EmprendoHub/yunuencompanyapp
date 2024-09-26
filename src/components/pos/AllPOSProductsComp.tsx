"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveQRToPrint } from "@/redux/shoppingSlice";
import POSProductSearch from "../layout/POSProductSearch";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { FaStar } from "react-icons/fa6";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

// Define TypeScript interfaces
interface ProductVariation {
  price: number;
}

interface Product {
  _id: string;
  title: string;
  images: { url: string }[];
  variations: ProductVariation[];
  stock: number;
  active: boolean;
  featured?: boolean;
  isSelected?: boolean;
}

interface QRListData {
  id: string;
}

interface RootState {
  compras: {
    qrListData: QRListData[];
  };
}

interface AllPOSProductsCompProps {
  products: Product[];
  filteredProductsCount: number;
}

const AllPOSProductsComp: React.FC<AllPOSProductsCompProps> = ({
  products,
  filteredProductsCount,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { qrListData } = useSelector((state: RootState) => state.compras);

  // State hooks with types
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    // Map through qrListData and extract only the ids
    const qrIds = qrListData.map((data) => data.id);

    // Filter through products and update the selectedProducts state array
    const updatedSelectedProducts = products.map((product) => ({
      ...product,
      isSelected: qrIds.includes(product._id),
    }));

    setSelectedProducts(updatedSelectedProducts);
  }, [qrListData, products]);

  useEffect(() => {
    // Set selectAll based on whether all displayed products are selected
    const areAllSelected = selectedProducts.every(
      (product) => product.isSelected
    );
    setSelectAll(areAllSelected);
  }, [selectedProducts]);

  const handleCheckBox = (product: Product) => {
    const receiver: any = {
      id: product._id,
      name: product.title,
      price: product.variations[0].price,
    };
    dispatch(saveQRToPrint(receiver));
  };

  const handleGenerateQR = () => {
    if (pathname.includes("admin")) {
      router.push("/admin/pos/qr/generador");
    } else if (pathname.includes("puntodeventa")) {
      router.push("/puntodeventa/qr/generador");
    } else if (pathname.includes("socials")) {
      router.push("/socials/qr/generador");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedProducts(
      selectedProducts.map((product) => {
        const productData: any = {
          id: product._id,
          name: product.title,
          price: product.variations[0].price,
        };
        if (!selectAll) {
          dispatch(saveQRToPrint(productData));
        }
        return {
          ...product,
          isSelected: !selectAll,
        };
      })
    );
  };

  return (
    <>
      <hr className="my-4" />
      <div className="relative pl-10 maxsm:pl-3 overflow-x-auto shadow-md rounded-lg">
        <div className="flex flex-row maxsm:flex-col maxsm:items-start items-center justify-between">
          <h1 className="text-2xl mb-5 ml-1 font-bold font-EB_Garamond">
            {`${filteredProductsCount} Productos Con Existencias`}
          </h1>
          <POSProductSearch />
        </div>
        <button
          className="bg-secondary rounded-lg text-white p-4"
          onClick={handleGenerateQR}
        >
          Generar QRs
        </button>
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr className="flex flex-row items-center">
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-card rounded-lg focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
              </th>
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
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => (
              <tr
                className={`flex flex-row items-center ${
                  product.active
                    ? "bg-background"
                    : "bg-muted text-muted-foreground"
                }`}
                key={product._id}
              >
                <td>
                  <input
                    type="checkbox"
                    id={product._id}
                    checked={product.isSelected || false}
                    onChange={() => handleCheckBox(product)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                  />
                </td>
                <td
                  onClick={() => handleCheckBox(product)}
                  className={`w-full px-6 maxsm:px-0 py-0 maxsm:hidden capitalize cursor-pointer text-[12px]`}
                >
                  {product.title}
                </td>

                <td className="w-full px-6 maxsm:px-0 py-0 relative">
                  <span
                    onClick={() => handleCheckBox(product)}
                    className="relative flex items-center justify-center text-foreground w-20 h-20 maxsm:w-8 maxsm:h-8 shadow mt-2 overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={product.images[0].url}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="w-20 object-cover h-20 maxsm:w-20 rounded-md"
                    />
                    {product.featured && (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    )}
                  </span>
                </td>
                <td className="w-full px-6 maxsm:px-0 py-0 ">
                  <b>
                    <FormattedPrice amount={product.variations[0].price} />
                  </b>
                </td>

                <td className="w-full px-1 py-0 ">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AllPOSProductsComp;
