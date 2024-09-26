import { getAllPOSProduct, getAllPOSProductNoFilter } from "@/app/_actions";
import QRGenerator from "@/components/pos/qr/QRGenerator";

const QRPage = async () => {
  const data = await getAllPOSProductNoFilter();
  const products = JSON.parse(data.products);
  const filteredProductsCount = data.filteredProductsCount;
  return <QRGenerator products={products} />;
};

export default QRPage;
