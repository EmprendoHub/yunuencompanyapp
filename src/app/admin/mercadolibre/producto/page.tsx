import React from "react";
import { getAllPOSMercadoLibreProduct } from "@/app/_actions";
import CreateMercadoProduct from "../_components/CreateMercadoProduct";
import { removeUndefinedAndPageKeys } from "@/backend/helpers";
import ServerPagination from "@/components/pagination/ServerPagination";

const MercadoLibreProducto = async ({
  searchParams,
}: {
  searchParams: any;
}) => {
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

  const data = await getAllPOSMercadoLibreProduct(searchQuery);
  const products = JSON.parse(data.products);
  const testUsers = JSON.parse(data.testUsers);

  //pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 10;
  const itemCount = data?.filteredProductsCount;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
  const prevPage = page - 1 > 0 ? page - 1 : 1;
  const nextPage = page + 1;
  const isPageOutOfRange = page > totalPages;
  const pageNumbers = [];
  const offsetNumber = 3;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  for (let i = page - offsetNumber; i <= page + offsetNumber; i++) {
    if (i >= 1 && i <= totalPages) {
      pageNumbers.push(i);
    }
  }
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <CreateMercadoProduct
        filteredProductsCount={itemCount}
        products={products}
        testUsers={testUsers}
        pageName="MercadoLibre"
        search={search}
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

export default MercadoLibreProducto;
