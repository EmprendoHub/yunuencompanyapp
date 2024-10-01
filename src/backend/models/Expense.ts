import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  amount: {
    require: true,
    type: Number,
  },
  reference: {
    type: String,
  },
  expenseIntent: {
    type: String,
  },
  method: {
    type: String,
  },
  comment: {
    type: String,
  },
  pay_date: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose?.models?.Expense ||
  mongoose.model("Expense", ExpenseSchema);
