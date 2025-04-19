import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Schema.Types.Number,
      ref: 'Product',
      default: 0,
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model('Order', orderSchema);
