import { getOneOrder } from "@/app/_actions";
import POSReceiptOneOrder from "@/components/pos/POSReceiptOneOrder";

const AdminOneOrderPage = async ({ params }: { params: any }) => {
  const data = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const deliveryAddress = JSON.parse(data.deliveryAddress);
  return (
    <div className="m-2 ">
      <POSReceiptOneOrder
        order={order}
        id={params?.id}
        deliveryAddress={deliveryAddress}
      />
    </div>
  );
};

export default AdminOneOrderPage;
