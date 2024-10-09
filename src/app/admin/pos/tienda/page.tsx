import ListPOSProducts from "@/components/products/ListPOSProducts";
import { getAllPOSProduct } from "@/app/_actions";
import { removeUndefinedAndPageKeys } from "@/backend/helpers";
import POSCart from "@/components/pos/POSCart";
import { getServerSession } from "next-auth";
import { options } from "../../../api/auth/[...nextauth]/options";

export const metadata = {
  title: "Tienda yunuencompany",
  description:
    "Ven y explora nuestra tienda en linea y descubre modelos exclusivos de marcas de alta gama.",
};

const TiendaPage = async ({ searchParams }: { searchParams: any }) => {
  const session = await getServerSession(options);
  const userId = session.user._id;

  const data = await getAllPOSProduct(searchParams);
  //pagination
  let page = parseInt(searchParams.page, 40);
  page = !page || page < 1 ? 1 : page;
  const perPage = 40;
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
    <div className="flex maxsm:flex-col items-start justify-center gap-5">
      <ListPOSProducts
        pageName={`Sucursal ${session.user.name}`}
        products={products}
        filteredProductsCount={filteredProductsCount}
        branchId={userId}
      />

      <POSCart userId={userId} />
    </div>
  );
};

export default TiendaPage;
