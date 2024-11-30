import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    active: {
      type: Boolean,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerNo: {
      type: Number,
      unique: true, // Ensure customerNo is unique
    },
  },
  { timestamps: true }
);

// Pre-save hook to set an incremental customerNo
CustomerSchema.pre("save", async function (next) {
  const customer = this;

  // Only assign a customerNo if it's not already set
  if (!customer.customerNo) {
    try {
      // Get the highest current customerNo
      const lastCustomer = await mongoose
        .model("Customer")
        .findOne()
        .sort({ customerNo: -1 });

      // Increment the customerNo
      customer.customerNo = lastCustomer ? lastCustomer.customerNo + 1 : 1;
      next();
    } catch (err: any) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose?.models?.Customer ||
  mongoose.model("Customer", CustomerSchema);
