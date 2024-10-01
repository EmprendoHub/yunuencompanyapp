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
    <section className="py-4 flex flex-col justify-center items-center w-[80%] maxxlg:w-[60%] maxsm:w-full maxsm:mt-[400px]">
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <main className=" flex flex-row gap-4 maxsm:gap-6 flex-wrap items-center w-full pl-5">
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
