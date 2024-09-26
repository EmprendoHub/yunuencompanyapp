import React from "react";
import { getAllPOSProduct } from "@/app/_actions";
import { removeUndefinedAndPageKeys } from "@/backend/helpers";
import ServerPagination from "@/components/pagination/ServerPagination";
import AllPOSProductsComp from "@/components/pos/AllPOSProductsComp";

const POSProductsPage = async ({ searchParams }: { searchParams: any }) => {
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

  const data: any = await getAllPOSProduct(searchQuery);

  const products = JSON.parse(data.products);
  const filteredProductsCount = data.filteredProductsCount;
  // pagination
  let page = parseInt(searchParams.page, 10);
  page = !page || page < 1 ? 1 : page;
  const perPage = 10;
  const itemCount = data?.productsCount;
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
    <>
      <AllPOSProductsComp
        products={products}
        filteredProductsCount={itemCount}
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
    </>
  );
};

export default POSProductsPage;
