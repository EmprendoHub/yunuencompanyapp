import React from "react";

interface Expense {
  _id: string;
  type: string;
  amount: number;
  reference: string;
  expenseIntent: string;
  method: string;
  comment: string;
  pay_date: Date;
}

const POSExpenseDetails = ({ expense }: { expense: Expense }) => {
  return <div>POSExpenseDetails</div>;
};

export default POSExpenseDetails;
