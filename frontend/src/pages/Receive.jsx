import { useEffect, useState } from "react";
import API from "../api";

function Receive() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await API.get("/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    }
  };

  const handleReceive = async () => {
    setMessage("");
    setError("");

    if (!productId) {
      setError("Please select a product.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Enter a valid quantity.");
      return;
    }

    setLoading(true);

    try {
      await API.post(
        "/stock/receive",
        {
          productId,
          quantity: Number(quantity),
          remarks,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Stock added successfully.");

      setProductId("");
      setQuantity("");
      setRemarks("");

      loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to add stock."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        .receive-page {
          max-width: 1100px;
          margin: auto;
        }

        .page-header {
          margin-bottom: 28px;
        }

        .page-header h1 {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
        }

        .page-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .receive-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 24px;

          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .receive-card h2 {
          margin: 0 0 20px;

          color: #0f172a;
          font-size: 17px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        label {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        select,
        input,
        textarea {
          width: 100%;
          padding: 12px;

          border: 1px solid #e2e8f0;
          border-radius: 9px;

          background: #f8fafc;
          color: #0f172a;

          font-size: 13px;
        }

        select:focus,
        input:focus,
        textarea:focus {
          outline: none;
          border-color: #2563eb;
          background: white;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        textarea {
          min-height: 80px;
          resize: vertical;
        }

        .receive-btn {
          margin-top: 20px;

          padding: 12px 20px;

          border: none;
          border-radius: 9px;

          background: #2563eb;
          color: white;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
        }

        .receive-btn:hover {
          background: #1d4ed8;
        }

        .receive-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success {
          margin-top: 16px;
          padding: 11px 13px;

          border-radius: 8px;

          background: #ecfdf3;
          color: #16a34a;

          font-size: 12px;
          font-weight: 600;
        }

        .error {
          margin-top: 16px;
          padding: 11px 13px;

          border-radius: 8px;

          background: #fef2f2;
          color: #dc2626;

          font-size: 12px;
          font-weight: 600;
        }

        .stock-card {
          margin-top: 24px;

          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;

          overflow: hidden;
        }

        .stock-header {
          padding: 20px 22px;

          border-bottom: 1px solid #e2e8f0;
        }

        .stock-header h2 {
          margin: 0;
          color: #0f172a;
          font-size: 16px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 13px 20px;

          background: #f8fafc;

          color: #64748b;

          font-size: 11px;
          text-align: left;
        }

        td {
          padding: 14px 20px;

          border-top: 1px solid #f1f5f9;

          color: #334155;
          font-size: 12px;
        }

        .product-name {
          font-weight: 700;
          color: #0f172a;
        }

        .current-stock {
          font-weight: 800;
        }

        .empty {
          padding: 35px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        @media (max-width: 650px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full {
            grid-column: auto;
          }
        }

      `}</style>

      <div className="receive-page">

        <div className="page-header">
          <h1>Receive Stock</h1>

          <p>
            Add incoming stock to your inventory.
          </p>
        </div>

        <div className="receive-card">

          <h2>Add Stock</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>PRODUCT</label>

              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
              >
                <option value="">
                  Select product
                </option>

                {products.map((product) => (
                  <option
                    key={product._id}
                    value={product._id}
                  >
                    {product.productName} (
                    {product.productCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>QUANTITY</label>

              <input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
              />
            </div>

            <div className="form-group full">
              <label>REMARKS (OPTIONAL)</label>

              <textarea
                placeholder="Add a note..."
                value={remarks}
                onChange={(e) =>
                  setRemarks(e.target.value)
                }
              />
            </div>

          </div>

          <button
            className="receive-btn"
            onClick={handleReceive}
            disabled={loading}
          >
            {loading
              ? "Adding..."
              : "Add to Stock"}
          </button>

          {message && (
            <div className="success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </div>

        <div className="stock-card">

          <div className="stock-header">
            <h2>Current Stock</h2>
          </div>

          {products.length === 0 ? (

            <div className="empty">
              No products available.
              <br />
              Admin needs to add products first.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>CURRENT STOCK</th>
                    <th>UNIT</th>
                    <th>MINIMUM</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (
                    <tr key={product._id}>

                      <td className="product-name">
                        {product.productName}
                      </td>

                      <td>
                        {product.category}
                      </td>

                      <td className="current-stock">
                        {product.currentStock}
                      </td>

                      <td>
                        {product.unit}
                      </td>

                      <td>
                        {product.minimumStock}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Receive;