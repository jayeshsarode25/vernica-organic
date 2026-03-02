import axios from "axios";

const PRODUCT_API = "http://localhost:3002/api/products";

export const getProductById = async (productId) => {
  try {
    const res = await axios.get(`${PRODUCT_API}/${productId}`);
    return res.data.data; 
  } catch (error) {
    console.error("Failed to fetch product:", productId, error.message);
    return null;
  }
};