import EditVariationProduct from "@/components/admin/EditVariationProduct";
import { getOneProduct } from "@/app/_actions";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

const ProductDetailsPage = async ({ params }: { params: any }) => {
  const session = await getServerSession(options);
  const branchId = session.user._id.toString();
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const currentCookies = `${cookieName}=${nextAuthSessionToken?.value}`;

  const data = await getOneProduct(params.slug, false);
  const product = JSON.parse(data.product);

  return (
    <EditVariationProduct
      product={product}
      currentCookies={currentCookies}
      branchId={branchId}
    />
  );
};

export default ProductDetailsPage;
