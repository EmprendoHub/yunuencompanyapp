import { getOneProduct } from "@/app/_actions";
import POSProductDetails from "@/components/products/POSProductDetails";

const ProductDetailsPage = async ({ params }: { params: any }) => {
  const data = await getOneProduct(params.slug);
  const product = JSON.parse(data.product);
  return (
    <>
      <POSProductDetails product={product} />
    </>
  );
};

export default ProductDetailsPage;
