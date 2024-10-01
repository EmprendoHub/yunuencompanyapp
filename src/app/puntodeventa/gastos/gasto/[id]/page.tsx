import { getOneExpense } from "@/app/_actions";
import POSExpenseDetails from "../../_componets/POSExpenseDetails";

const ProductDetailsPage = async ({ params }: { params: any }) => {
  const data = await getOneExpense(params.slug);
  const expense = JSON.parse(data.expense);
  return (
    <>
      <POSExpenseDetails expense={expense} />
    </>
  );
};

export default ProductDetailsPage;
