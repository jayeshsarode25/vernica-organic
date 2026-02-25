import cartModel from "../model/cart.model.js";


export const getCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] });
      await cart.save();
    }

    return res.status(200).json({
      cart,
      totals: {
        itemCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      },
    });
  } catch (error) {
    console.error("Failed", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addItemToCart = async (req, res) => {
  const { productId, qty } = req.body;

  const userId = req.user.userId;

  try {
    let cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      cart = new cartModel({
        user: userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += qty;
    } else {
      cart.items.push({ productId, quantity: qty });
    }
    await cart.save();

    res.status(200).json({ message: "Item Add to  Cart", cart });
  } catch (error) {
    console.error("Add to Cart Failed", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateItemQuentity = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;
  const userId = req.user.userId;

  try {
    const cart = await cartModel.findOne({
      user: userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart Not Found",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingItemIndex < 0) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    cart.items[existingItemIndex].quantity = qty;
    await cart.save();

    res.status(200).json({ message: "Item Updated", cart });
  } catch (error) {
    console.error("Failed to Update", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;

  try {
    const updatedCart = await cartModel.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: { productId: productId }   
        }
      },
      { returnDocument: "after" }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });

  } catch (error) {
    console.error("Remove Item Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart Not Found" });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({ message: "Cart Clear Successfully" });
  } catch (error) {
    console.error("Clear Cart Failed", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
