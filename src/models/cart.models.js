import mongoose, { Schema } from 'mongoose';

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    priceAtThatTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Cart = mongoose.model('Cart', cartSchema);
