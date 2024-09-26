import { getAllPOSOrder } from "@/app/_actions";
import POSOrders from "@/components/pos/POSOrders";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const POSOrdersPage = async ({ searchParams }: { searchParams: any }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllPOSOrder(searchQuery);
  const orders = JSON.parse(data.orders);
  const filteredOrdersCount = data?.itemCount;

  // pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = Number(data?.resPerPage);
  const totalPages = Math.ceil(data.itemCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 1;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <>
      <POSOrders orders={orders} filteredOrdersCount={filteredOrdersCount} />
      {isPageOutOfRange ? (
        <div className="flex justify-center items-center h-[300px]">
          No hay Resultados...
        </div>
      ) : (
        <div className="flex justify-center items-center mt-16 maxsm:mt-5">
          <div className="flex border-[1px] gap-4 rounded-[10px] border-light-green p-4">
            {page === 1 ? (
              <div
                aria-disabled="true"
                className="opacity-60 bg-black w-8 h-8 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl maxmd:text-md"
              >
                <FiChevronLeft />
              </div>
            ) : (
              <Link
                href={`?page=${prevPage}`}
                aria-label="Previous Page"
                className="bg-black w-8 h-8 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl maxmd:text-md"
              >
                <FiChevronLeft />
              </Link>
            )}

            {pageNumbers.map((pageNumber, index) => (
              <Link
                key={index}
                className={
                  page === pageNumber
                    ? "bg-black fw-bold px-2 w-8 h-8 flex justify-center items-center text-white rounded-full"
                    : "hover:bg-black px-1 rounded-full w-8 h-8 flex justify-center items-center hover:text-white"
                }
                href={`?page=${pageNumber}`}
              >
                {pageNumber}
              </Link>
            ))}

            {page === totalPages ? (
              <div
                className="opacity-60 bg-black w-8 h-8 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl maxmd:text-md"
                aria-disabled="true"
              >
                <FiChevronRight />
              </div>
            ) : (
              <Link
                href={`?page=${nextPage}`}
                aria-label="Next Page"
                className="bg-black w-8 h-8 flex justify-center items-center disabled:bg-slate-300 text-white p-2  rounded-full text-xl maxmd:text-md"
              >
                <FiChevronRight />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default POSOrdersPage;
