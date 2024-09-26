"use client";
import { FaInstagram, FaStore } from "react-icons/fa6";
import POSSearch from "../layout/POSearch";
import POSProductCard from "./POSProductCard";
import { Key } from "react";

const ListPOSProducts = ({
  products,
  pageName,
  filteredProductsCount,
}: {
  products: any;
  pageName: string;
  filteredProductsCount: number;
}) => {
  const filteredProducts = products?.filter(
    (product: any) => product.stock > 0
  );
  return (
    <section className="py-4 mx-auto maxlg:px-2 flex flex-col justify-center items-center">
      <div className="flex flex-row items-center justify-between w-full px-3">
        <h2 className="text-2xl flex items-center">
          {" "}
          Productos {pageName}{" "}
          {pageName === "Socials" ? <FaInstagram /> : <FaStore />}
        </h2>
        <POSSearch pageName={pageName} />
      </div>

      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <main className=" flex flex-row gap-4 flex-wrap items-center w-full pl-5">
            {filteredProducts?.map((product: any, index: number) => (
              <POSProductCard item={product} key={index} />
            ))}
          </main>
        </div>
      </div>
    </section>
  );
};

export default ListPOSProducts;
