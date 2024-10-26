"use client";
import POSProductCard from "./POSProductCard";

const ListPOSProducts = ({
  products,
  pageName,
  filteredProductsCount,
  branchId,
}: {
  products: any;
  pageName: string;
  filteredProductsCount: number;
  branchId: string;
}) => {
  const filteredProducts = products?.filter((product: any) =>
    product?.variations.some((variation: any) =>
      variation?.stock.some(
        (stockItem: any) =>
          stockItem?.amount > 0 && stockItem?.branch === branchId
      )
    )
  );

  return (
    <section className="py-4 flex flex-col justify-center items-center w-full maxsm:mt-[400px]  bg-white">
      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <main className=" flex flex-row gap-2 maxsm:gap-3 flex-wrap items-center justify-center w-full ">
            {filteredProducts &&
              filteredProducts
                ?.slice()
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
