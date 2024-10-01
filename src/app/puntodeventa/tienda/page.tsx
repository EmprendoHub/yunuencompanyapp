import ListPOSProducts from "@/components/products/ListPOSProducts";
import { getAllPOSProduct } from "@/app/_actions";
import POSCart from "@/components/pos/POSCart";

export const metadata = {
  title: "POS yunuencompany",
  description: "Punto de Venta yunuencompany",
};

const TiendaPage = async ({ searchParams }: { searchParams: any }) => {
  const data = await getAllPOSProduct(searchParams);
  //pagination
  let page = parseInt(searchParams.page, 20);
  page = !page || page < 1 ? 1 : page;
  const perPage = 20;
  const totalPages = Math.ceil(data.filteredProductsCount / perPage);
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
    <div className="flex maxsm:flex-col items-start justify-start w-full gap-5">
      <ListPOSProducts
        pageName={"Sucursal"}
        products={products}
        filteredProductsCount={filteredProductsCount}
      />
      <POSCart />
    </div>
  );
};

export default TiendaPage;
