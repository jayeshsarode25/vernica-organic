import cartModel from "../model/cart.model.js";
import { getProductById } from "../services/product.service.js";

// ✅ helper to manually populate cart items via Products API
const populateCartItems = async (cart) => {
  const populatedItems = await Promise.all(
    cart.items.map(async (item) => {
      const product = await getProductById(item.productId.toString());
      return {
        _id: item._id,
        quantity: item.quantity,
        productId: product, // full product object
      };
    })
  );
  return {
    ...cart.toObject(),
    items: populatedItems,
  };
};

export const getCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(200).json({ cart: { items: [] } });
    }
    const populatedCart = await populateCartItems(cart);
    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.error("Get Cart Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addItemToCart = async (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.user.userId;

  try {
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += Number(qty);
    } else {
      cart.items.push({ productId, quantity: Number(qty) });
    }

    await cart.save();

    const rawCart = await cartModel.findOne({ user: userId });
    const populatedCart = await populateCartItems(rawCart);

    res.status(200).json({ message: "Item Add to Cart", cart: populatedCart });
  } catch (error) {
    console.error("Add to Cart Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateItemQuentity = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  const userId = req.user.userId;

  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex < 0) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    cart.items[existingItemIndex].quantity = qty;
    await cart.save();

    const rawCart = await cartModel.findOne({ user: userId });
    const populatedCart = await populateCartItems(rawCart);

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.error("Failed to Update", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeItemFromCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;

  try {
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    await cartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { productId: productId } } }
    );

    const rawCart = await cartModel.findOne({ user: userId });
    const populatedCart = await populateCartItems(rawCart);

    res.status(200).json({ message: "Item removed from cart", cart: populatedCart });
  } catch (error) {
    console.error("Remove Item Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.userId;
  try {
    const cart = await cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );
    res.status(200).json({ message: "Cart Cleared", cart });
  } catch (error) {
    console.error("Clear Cart Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};