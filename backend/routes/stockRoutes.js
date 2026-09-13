const express = require("express");

const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// RECEIVE STOCK
// POST /api/stock/receive
// =====================================================

router.post("/receive", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, remarks } = req.body;

    // Validate product ID
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Validate quantity
    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const receiveQuantity = Number(quantity);

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Increase stock
    product.currentStock += receiveQuantity;

    await product.save();

    // Create transaction
    const transaction = await Transaction.create({
      product: product._id,
      type: "RECEIVED",
      quantity: receiveQuantity,
      user: req.user.id,
      remarks: remarks || "",
    });

    res.status(201).json({
      message: "Stock received successfully",
      product: {
        id: product._id,
        productName: product.productName,
        currentStock: product.currentStock,
      },
      transaction,
    });

  } catch (error) {
    console.error("RECEIVE STOCK ERROR:", error);

    res.status(500).json({
      message: "Failed to receive stock",
      error: error.message,
    });
  }
});


// =====================================================
// DISPATCH STOCK
// POST /api/stock/dispatch
// =====================================================

router.post("/dispatch", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, remarks } = req.body;

    // Validate product ID
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    // Validate quantity
    if (
      quantity === undefined ||
      quantity === null ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) <= 0
    ) {
      return res.status(400).json({
        message: "Quantity must be a positive integer",
      });
    }

    const dispatchQuantity = Number(quantity);

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check available stock
    if (dispatchQuantity > product.currentStock) {
      return res.status(400).json({
        message: `Insufficient stock. Available stock: ${product.currentStock}`,
      });
    }

    // Decrease stock
    product.currentStock -= dispatchQuantity;

    await product.save();

    // Create transaction
    const transaction = await Transaction.create({
      product: product._id,
      type: "DISPATCHED",
      quantity: dispatchQuantity,
      user: req.user.id,
      remarks: remarks || "",
    });

    res.status(201).json({
      message: "Stock dispatched successfully",
      product: {
        id: product._id,
        productName: product.productName,
        currentStock: product.currentStock,
      },
      transaction,
    });

  } catch (error) {
    console.error("DISPATCH STOCK ERROR:", error);

    res.status(500).json({
      message: "Failed to dispatch stock",
      error: error.message,
    });
  }
});


// =====================================================
// STOCK HISTORY
// GET /api/stock/history
// =====================================================

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate(
        "product",
        "productName productCode category unit"
      )
      .populate(
        "user",
        "name role"
      )
      .sort({
        createdAt: -1,
      });

    res.json(transactions);

  } catch (error) {
    console.error("HISTORY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch transaction history",
      error: error.message,
    });
  }
});


module.exports = router;