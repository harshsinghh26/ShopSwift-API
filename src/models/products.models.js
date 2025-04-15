import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
    },
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model('Product', productSchema);
