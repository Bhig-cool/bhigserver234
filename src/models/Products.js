import {Schema, model} from 'mongoose';
import validator from 'validator';



//name, description, price, category, rating, stock
// Create a schema for the Product model

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter a product description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please enter a product price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please enter a product category'],
    },
    
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be a positive number'],
      max: [5, 'Rating cannot exceed 5'],
    },
    stock: {
      type: Number,
      required: [true, 'Please enter the stock quantity'],
        min: [0, 'Stock must be a positive number'],
    },
  },
  {timestamps: true}
);

const Product = model('Product', productSchema);

// Middleware to trim whitespace from string fields before saving
export default Product;