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
      <div className="border border-muted rounded-md p-10">
        <div>
          <span className="text-muted text-xs">Tipo de Gasto: </span>
          <span>{expense.type}</span>
        </div>
        <div>
          <span className="text-muted text-xs">Cantidad de Gasto: </span>
          <span>${expense.amount}</span>
        </div>
        <div>
          <span className="text-muted text-xs">Estado de Gasto: </span>
          <span>{expense.expenseIntent}</span>
        </div>
        <div>
          <span className="text-muted text-xs">Método de Pago: </span>
          <span>{expense.method}</span>
        </div>
        <div>
          <span className="text-muted text-xs">Comentario: </span>
          <span>{expense.comment}</span>
        </div>
      </div>
    </div>
  );
};

export default POSExpenseDetails;
