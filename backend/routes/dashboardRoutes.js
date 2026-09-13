const express = require("express");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    // ==============================
    // TOTAL PRODUCTS
    // ==============================
    const totalProducts = await Product.countDocuments();

    // ==============================
    // TOTAL USERS
    // ==============================
    const totalUsers = await User.countDocuments();

    // ==============================
    // GET PRODUCTS
    // ==============================
    const products = await Product.find();

    // ==============================
    // TOTAL CURRENT STOCK
    // ==============================
    const totalStock = products.reduce(
      (sum, product) => sum + (Number(product.currentStock) || 0),
      0
    );

    // ==============================
    // LOW STOCK PRODUCTS
    // ==============================
    const lowStockProducts = products.filter(
      (product) =>
        Number(product.currentStock) <= Number(product.minimumStock)
    ).length;

    // ==============================
    // ALL TRANSACTIONS
    // ==============================
    const transactions = await Transaction.find();

    let totalReceived = 0;
    let totalDispatched = 0;

    transactions.forEach((transaction) => {
      const quantity = Number(transaction.quantity) || 0;

      if (transaction.type === "RECEIVED") {
        totalReceived += quantity;
      }

      if (transaction.type === "DISPATCHED") {
        totalDispatched += quantity;
      }
    });

    // ==============================
    // SEND RESPONSE
    // ==============================
    res.status(200).json({
      totalProducts,
      totalStock,
      lowStockProducts,
      totalUsers,
      totalReceived,
      totalDispatched,
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
});

module.exports = router;