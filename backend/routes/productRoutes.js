const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PRODUCTS
// Admin + Staff
// ==========================================

router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// ==========================================
// ADD PRODUCT
// ADMIN ONLY
// Product Code is OPTIONAL
// ==========================================

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const {
        productName,
        productCode,
        category,
        unit,
        currentStock,
        minimumStock,
      } = req.body;

      // Product Code is NOT required
      if (
        !productName ||
        !productName.trim() ||
        !category ||
        !category.trim() ||
        !unit ||
        !unit.trim()
      ) {
        return res.status(400).json({
          message:
            "Product Name, Category and Unit are required",
        });
      }

      // ==========================================
      // CHECK DUPLICATE PRODUCT CODE
      // Only if code is provided
      // ==========================================

      const cleanedProductCode =
        typeof productCode === "string"
          ? productCode.trim()
          : "";

      if (cleanedProductCode) {
        const existingProduct =
          await Product.findOne({
            productCode: cleanedProductCode,
          });

        if (existingProduct) {
          return res.status(400).json({
            message:
              "Product code already exists",
          });
        }
      }

      // ==========================================
      // CREATE PRODUCT
      // ==========================================

      const productData = {
        productName: productName.trim(),
        category: category.trim(),
        unit: unit.trim(),
        currentStock:
          Number(currentStock) || 0,
        minimumStock:
          Number(minimumStock) || 0,
      };

      // Only save productCode if entered
      if (cleanedProductCode) {
        productData.productCode =
          cleanedProductCode;
      }

      const product =
        await Product.create(productData);

      res.status(201).json({
        message:
          "Product added successfully",
        product,
      });
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      // Duplicate key protection
      if (error.code === 11000) {
        return res.status(400).json({
          message:
            "Product code already exists",
        });
      }

      res.status(500).json({
        message: "Failed to add product",
        error: error.message,
      });
    }
  }
);

// ==========================================
// UPDATE PRODUCT
// ADMIN ONLY
// Product Code is OPTIONAL
// ==========================================

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const {
        productName,
        productCode,
        category,
        unit,
        currentStock,
        minimumStock,
      } = req.body;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !productName ||
        !productName.trim() ||
        !category ||
        !category.trim() ||
        !unit ||
        !unit.trim()
      ) {
        return res.status(400).json({
          message:
            "Product Name, Category and Unit are required",
        });
      }

      // ==========================================
      // CHECK PRODUCT EXISTS
      // ==========================================

      const existingProduct =
        await Product.findById(req.params.id);

      if (!existingProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // ==========================================
      // CLEAN PRODUCT CODE
      // ==========================================

      const cleanedProductCode =
        typeof productCode === "string"
          ? productCode.trim()
          : "";

      // ==========================================
      // CHECK DUPLICATE PRODUCT CODE
      // Ignore current product
      // ==========================================

      if (cleanedProductCode) {
        const duplicateProduct =
          await Product.findOne({
            productCode: cleanedProductCode,
            _id: {
              $ne: req.params.id,
            },
          });

        if (duplicateProduct) {
          return res.status(400).json({
            message:
              "Product code already exists",
          });
        }
      }

      // ==========================================
      // UPDATE DATA
      // ==========================================

      const updateData = {
        productName: productName.trim(),
        category: category.trim(),
        unit: unit.trim(),
        currentStock:
          Number(currentStock) || 0,
        minimumStock:
          Number(minimumStock) || 0,
      };

      // If code exists, save it.
      // If user removes code, remove it from MongoDB.
      if (cleanedProductCode) {
        updateData.productCode =
          cleanedProductCode;
      } else {
        updateData.$unset = {
          productCode: 1,
        };
      }

      // ==========================================
      // UPDATE
      // ==========================================

      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        );

      res.status(200).json({
        message:
          "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      // Duplicate key protection
      if (error.code === 11000) {
        return res.status(400).json({
          message:
            "Product code already exists",
        });
      }

      res.status(500).json({
        message:
          "Failed to update product",
        error: error.message,
      });
    }
  }
);

// ==========================================
// DELETE PRODUCT
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.status(200).json({
        message:
          "Product deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete product",
        error: error.message,
      });
    }
  }
);

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;