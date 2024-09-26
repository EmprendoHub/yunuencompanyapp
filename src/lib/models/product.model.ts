import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    images: [{ type: String, required: true }],
    title: { type: String, required: true },
    details: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    description: [{ type: String }],
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    ASIN: { type: String, required: true },
    domain: { type: String, required: true },
    discountRate: { type: Number },
    category: { type: String },
    reviewCount: { type: Number },
    stars: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    users: [{ email: { type: String, required: true } }],
    default: [],
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
