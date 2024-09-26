import { getCookiesName, removeUndefinedAndPageKeys } from "@/backend/helpers";
import { cookies } from "next/headers";
import ServerPagination from "@/components/pagination/ServerPagination";
import ListPOSProducts from "@/components/products/ListPOSProducts";
import { getAllPOSProduct } from "@/app/_actions";

export const metadata = {
  title: "POS yunuencompany",
  description: "Punto de Venta yunuencompany",
};

const TiendaPage = async ({ searchParams }: { searchParams: any }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();

  const queryUrlParams = removeUndefinedAndPageKeys(urlParams);
  const keywordQuery = new URLSearchParams(queryUrlParams).toString();

  const data = await getAllPOSProduct(searchParams);
  //pagination
  let page = parseInt(searchParams.page, 20);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 3;
  const products = JSON.parse(data?.products);
  const filteredProductsCount = data?.filteredProductsCount;
  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {/* <StoreHeroComponent /> */}

      <ListPOSProducts
        pageName={"Sucursal"}
        products={products}
        filteredProductsCount={filteredProductsCount}
      />
      <ServerPagination
        isPageOutOfRange={isPageOutOfRange}
        page={page}
        pageNumbers={pageNumbers}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
        searchParams={keywordQuery}
      />
    </div>
  );
};

export default TiendaPage;
