import React, { useEffect, useState } from "react";
import API from "../api";

// ==========================================
// PRODUCTS PAGE
// ==========================================

function Products() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    productCode: "",
    category: "",
    unit: "",
    currentStock: "",
    minimumStock: "",
  });

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      const response = await API.get(
        "/products",
        config
      );

      setProducts(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );
    }
  };

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      const response = await API.get(
        "/auth/users",
        config
      );

      setUsers(response.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  // ==========================================
  // HANDLE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Product Code is OPTIONAL
    // Product Name, Category and Unit are REQUIRED
    if (
      !form.productName.trim() ||
      !form.category.trim() ||
      !form.unit.trim()
    ) {
      setError(
        "Please fill Product Name, Category and Unit."
      );
      return;
    }

    try {
      const productData = {
        productName: form.productName.trim(),
        category: form.category.trim(),
        unit: form.unit.trim(),
        currentStock:
          Number(form.currentStock) || 0,
        minimumStock:
          Number(form.minimumStock) || 0,
      };

      // Product Code is OPTIONAL.
      // Only send it if the user entered one.
      if (form.productCode.trim()) {
        productData.productCode =
          form.productCode.trim();
      }

      await API.post(
        "/products",
        productData,
        config
      );

      setMessage(
        "Product added successfully."
      );

      clearForm();
      loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    setMessage("");
    setError("");

    try {
      await API.delete(
        `/products/${id}`,
        config
      );

      setMessage(
        "Product deleted successfully."
      );

      loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const startEdit = (product) => {
    setMessage("");
    setError("");

    setEditingProduct(product);

    setForm({
      productName:
        product.productName || "",

      productCode:
        product.productCode || "",

      category:
        product.category || "",

      unit:
        product.unit || "",

      currentStock:
        product.currentStock ?? 0,

      minimumStock:
        product.minimumStock ?? 0,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Product Code is OPTIONAL
    // Product Name, Category and Unit are REQUIRED
    if (
      !form.productName.trim() ||
      !form.category.trim() ||
      !form.unit.trim()
    ) {
      setError(
        "Please fill Product Name, Category and Unit."
      );
      return;
    }

    try {
      const productData = {
        productName: form.productName.trim(),
        category: form.category.trim(),
        unit: form.unit.trim(),
        currentStock:
          Number(form.currentStock) || 0,
        minimumStock:
          Number(form.minimumStock) || 0,
      };

      // Product Code is OPTIONAL.
      // Only send it when the user enters a value.
      if (form.productCode.trim()) {
        productData.productCode =
          form.productCode.trim();
      }

      await API.put(
        `/products/${editingProduct._id}`,
        productData,
        config
      );

      setMessage(
        "Product updated successfully."
      );

      cancelEdit();
      loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

  // ==========================================
  // CLEAR FORM
  // ==========================================

  const clearForm = () => {
    setForm({
      productName: "",
      productCode: "",
      category: "",
      unit: "",
      currentStock: "",
      minimumStock: "",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setEditingProduct(null);
    clearForm();
  };

  // ==========================================
  // ROLE DISPLAY
  // ==========================================

  const displayRole = (role) => {
    if (role === "admin") return "Admin";
    if (role === "staff") return "Staff";

    return role;
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="products-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .products-page {
          font-family: Inter, Arial, sans-serif;
          color: #0f172a;
        }

        /* ================================
           HEADER
        ================================= */

        .page-header {
          margin-bottom: 25px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 700;
        }

        .page-header p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        /* ================================
           MESSAGES
        ================================= */

        .message {
          background: #ecfdf3;
          color: #166534;
          border: 1px solid #bbf7d0;
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 12px 15px;
          border-radius: 10px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        /* ================================
           PANEL
        ================================= */

        .panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 25px;
          box-shadow:
            0 8px 25px
            rgba(15, 23, 42, 0.04);
        }

        .panel-header {
          margin-bottom: 20px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 20px;
          color: #0f172a;
        }

        .panel-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        /* ================================
           FORM
        ================================= */

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 17px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field label {
          font-size: 13px;
          font-weight: 600;
          color: #475569;
        }

        .field input {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          outline: none;
          font-size: 14px;
          background: #ffffff;
        }

        .field input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px #eff6ff;
        }

        .button-row {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        .btn {
          border: none;
          border-radius: 9px;
          padding: 11px 19px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #e2e8f0;
          color: #334155;
        }

        .btn-secondary:hover {
          background: #cbd5e1;
        }

        /* ================================
           TABLE
        ================================= */

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 850px;
        }

        th {
          text-align: left;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          padding: 13px 14px;
          border-bottom:
            1px solid #e2e8f0;
          white-space: nowrap;
        }

        th:first-child {
          border-top-left-radius: 8px;
        }

        th:last-child {
          border-top-right-radius: 8px;
        }

        td {
          padding: 14px;
          border-bottom:
            1px solid #e2e8f0;
          color: #334155;
          font-size: 14px;
          white-space: nowrap;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        .product-name {
          font-weight: 600;
          color: #0f172a;
        }

        .product-code {
          font-family: monospace;
          color: #475569;
        }

        .no-code {
          color: #94a3b8;
          font-style: italic;
          font-family:
            Inter, Arial, sans-serif;
        }

        /* ================================
           STATUS
        ================================= */

        .status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-ok {
          background: #ecfdf3;
          color: #15803d;
        }

        .status-low {
          background: #fff7ed;
          color: #c2410c;
        }

        /* ================================
           ACTION BUTTONS
        ================================= */

        .edit-btn {
          background: #eff6ff;
          color: #2563eb;
          border: none;
          padding: 7px 11px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
          margin-right: 7px;
        }

        .edit-btn:hover {
          background: #dbeafe;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
          border: none;
          padding: 7px 11px;
          border-radius: 7px;
          cursor: pointer;
          font-weight: 600;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        /* ================================
           EMPTY
        ================================= */

        .empty {
          text-align: center;
          padding: 35px !important;
          color: #64748b;
        }

        /* ================================
           TEAM
        ================================= */

        .team-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #eff6ff;
          color: #2563eb;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          margin-right: 10px;
        }

        .team-name {
          display: flex;
          align-items: center;
          font-weight: 600;
          color: #0f172a;
        }

        .role-admin {
          display: inline-block;
          background: #eff6ff;
          color: #2563eb;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .role-staff {
          display: inline-block;
          background: #f1f5f9;
          color: #475569;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .pin-hidden {
          letter-spacing: 3px;
          color: #64748b;
        }

        /* ================================
           RESPONSIVE
        ================================= */

        @media (max-width: 900px) {
          .form-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .panel {
            padding: 17px;
          }

          .page-header h1 {
            font-size: 25px;
          }

          .button-row {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }

      `}</style>

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="page-header">
        <h1>Team & Products</h1>

        <p>
          Manage company products and view
          team members.
        </p>
      </div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* ==========================================
          ADD / EDIT PRODUCT
      ========================================== */}

      <div className="panel">

        <div className="panel-header">

          <h2>
            {editingProduct
              ? "Edit Product"
              : "Add Product"}
          </h2>

          <p>
            {editingProduct
              ? "Update product information and stock."
              : "Add a new product to your inventory."}
          </p>

        </div>

        <form
          onSubmit={
            editingProduct
              ? handleUpdate
              : handleAddProduct
          }
        >

          <div className="form-grid">

            {/* PRODUCT NAME */}

            <div className="field">

              <label>
                Product Name *
              </label>

              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="Example: Glue"
              />

            </div>

            {/* PRODUCT CODE */}

            <div className="field">

              <label>
                Product Code (Optional)
              </label>

              <input
                name="productCode"
                value={form.productCode}
                onChange={handleChange}
                placeholder="Example: GL-001"
              />

            </div>

            {/* CATEGORY */}

            <div className="field">

              <label>
                Category *
              </label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Raw Material"
              />

            </div>

            {/* UNIT */}

            <div className="field">

              <label>
                Unit *
              </label>

              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="kg / pcs / box"
              />

            </div>

            {/* CURRENT STOCK */}

            <div className="field">

              <label>
                {editingProduct
                  ? "Current Stock"
                  : "Initial Stock"}
              </label>

              <input
                type="number"
                min="0"
                name="currentStock"
                value={form.currentStock}
                onChange={handleChange}
                placeholder="0"
              />

            </div>

            {/* MINIMUM STOCK */}

            <div className="field">

              <label>
                Minimum Stock
              </label>

              <input
                type="number"
                min="0"
                name="minimumStock"
                value={form.minimumStock}
                onChange={handleChange}
                placeholder="0"
              />

            </div>

          </div>

          <div className="button-row">

            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingProduct
                ? "Save Changes"
                : "Add Product"}
            </button>

            {editingProduct && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ==========================================
          PRODUCTS
      ========================================== */}

      <div className="panel">

        <div className="panel-header">

          <h2>
            Products
          </h2>

          <p>
            {products.length} product
            {products.length !== 1
              ? "s"
              : ""}{" "}
            in inventory
          </p>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Unit</th>
                <th>Minimum</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty"
                  >
                    No products added yet.
                  </td>

                </tr>

              ) : (

                products.map((product) => {

                  const isLow =
                    product.currentStock <=
                    product.minimumStock;

                  return (

                    <tr
                      key={product._id}
                    >

                      {/* PRODUCT */}

                      <td>

                        <span
                          className="product-name"
                        >
                          {product.productName}
                        </span>

                      </td>

                      {/* PRODUCT CODE */}

                      <td>

                        {product.productCode ? (

                          <span
                            className="product-code"
                          >
                            {product.productCode}
                          </span>

                        ) : (

                          <span
                            className="no-code"
                          >
                            —
                          </span>

                        )}

                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.category}
                      </td>

                      {/* STOCK */}

                      <td>

                        <strong>
                          {product.currentStock}
                        </strong>

                      </td>

                      {/* UNIT */}

                      <td>
                        {product.unit}
                      </td>

                      {/* MINIMUM */}

                      <td>
                        {product.minimumStock}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`status ${
                            isLow
                              ? "status-low"
                              : "status-ok"
                          }`}
                        >
                          {isLow
                            ? "Low Stock"
                            : "Available"}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            startEdit(product)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==========================================
          TEAM MEMBERS
      ========================================== */}

      <div className="panel">

        <div className="panel-header">

          <h2>
            Team Members
          </h2>

          <p>
            Authorized users of the inventory
            system
          </p>

        </div>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>PIN</th>
              </tr>

            </thead>

            <tbody>

              {users.length === 0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="empty"
                  >
                    No team members found.
                  </td>

                </tr>

              ) : (

                users.map((user) => (

                  <tr
                    key={user._id}
                  >

                    {/* NAME */}

                    <td>

                      <div
                        className="team-name"
                      >

                        <span
                          className="team-avatar"
                        >
                          {user.name
                            ? user.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}
                        </span>

                        {user.name}

                      </div>

                    </td>

                    {/* ROLE */}

                    <td>

                      <span
                        className={
                          user.role === "admin"
                            ? "role-admin"
                            : "role-staff"
                        }
                      >
                        {displayRole(
                          user.role
                        )}
                      </span>

                    </td>

                    {/* PIN */}

                    <td>

                      <span
                        className="pin-hidden"
                      >
                        ••••
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Products;