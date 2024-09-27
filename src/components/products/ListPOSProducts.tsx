"use client";
import POSProductCard from "./POSProductCard";

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
    <section className="py-4 flex flex-col justify-center items-center w-2/3">
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <main className=" flex flex-row gap-4 flex-wrap items-center w-full pl-5">
            {filteredProducts
              ?.slice()
              .reverse()
              .map((product: any, index: number) => (
                <POSProductCard product={product} key={index} />
              ))}
          </main>
        </div>
      </div>
    </section>
  );
};

export default ListPOSProducts;
