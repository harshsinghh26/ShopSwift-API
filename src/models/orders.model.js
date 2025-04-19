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
    priceAtThatTime: {
      type: Schema.Types.Number,
      ref: 'Product',
      default: 0,
    },
    expectedDeleviryDate: {
      type: String,
    },
  },
  { timestamps: true },
);
