import { getOneProduct, getOneProductWithTrending } from "@/app/_actions";
import ProductDetailsComponent from "@/components/products/ProductDetailsComponent";

export async function generateMetadata(
  { params }: { params: any },
  parent: any
) {
  // fetch data
  const data = await getOneProduct(params.slug, false);
  const product = JSON.parse(data.product);
  console.log("product", product);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [`${product.variations[0].image}`, ...previousImages],
    },
  };
}

const ProductDetailsPage = async ({ params }: { params: any }) => {
  const data: any = await getOneProductWithTrending(params.slug, "");
  const product = JSON.parse(data.product);
  const trendingProducts = JSON.parse(data?.trendingProducts);
  return (
    <>
      <ProductDetailsComponent
        product={product}
        trendingProducts={trendingProducts}
      />
    </>
  );
};

export default ProductDetailsPage;
