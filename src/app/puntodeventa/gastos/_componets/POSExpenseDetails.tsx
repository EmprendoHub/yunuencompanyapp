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
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p>{expense.type}</p>
      <p>{expense.amount}</p>
      <p>{expense.reference}</p>
      <p>{expense.expenseIntent}</p>
      <p>{expense.method}</p>
      <p>{expense.comment}</p>
    </div>
  );
};

export default POSExpenseDetails;
