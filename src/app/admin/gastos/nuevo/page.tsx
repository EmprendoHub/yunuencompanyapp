import { getAllPOSBranches } from "@/app/_actions";
import NewExpense from "../_componets/NewExpense";

const NewProductPage = async () => {
  const branchData = await getAllPOSBranches();

  return <NewExpense branchData={branchData} />;
};

export default NewProductPage;
