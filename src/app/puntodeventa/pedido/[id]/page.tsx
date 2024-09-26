import { getOneOrder } from "@/app/_actions";
import POSOrder from "@/components/admin/profile/POSOrder";

const AdminOneOrderPage = async ({ params }: { params: any }) => {
  const data = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const deliveryAddress = JSON.parse(data.deliveryAddress);
  const orderPayments = JSON.parse(data.orderPayments);
  const customer = JSON.parse(data.customer);
  return (
    <div>
      <POSOrder
        order={order}
        customer={customer}
        id={params?.id}
        deliveryAddress={deliveryAddress}
        orderPayments={orderPayments}
      />
    </div>
  );
};

export default AdminOneOrderPage;
