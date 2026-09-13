import { useEffect, useState } from "react";
import API from "../api";

function Dispatch() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
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

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleDispatch = async () => {
    setMessage("");
    setError("");

    const dispatchItems = products
      .filter((product) => {
        const qty = Number(quantities[product._id] || 0);
        return qty > 0;
      })
      .map((product) => ({
        productId: product._id,
        quantity: Number(quantities[product._id]),
      }));

    if (dispatchItems.length === 0) {
      setError("Enter a dispatch quantity for at least one product.");
      return;
    }

    // Check stock before sending requests
    for (const item of dispatchItems) {
      const product = products.find(
        (p) => p._id === item.productId
      );

      if (item.quantity > product.currentStock) {
        setError(
          `Insufficient stock for ${product.productName}. Available: ${product.currentStock}.`
        );
        return;
      }
    }

    setLoading(true);

    try {
      for (const item of dispatchItems) {
        await API.post(
          "/stock/dispatch",
          {
            productId: item.productId,
            quantity: item.quantity,
            remarks,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setMessage("Dispatch saved successfully.");

      setQuantities({});
      setRemarks("");

      await loadProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save dispatch."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`

        .dispatch-page {
          max-width: 1200px;
          margin: auto;
        }

        .page-header {
          margin-bottom: 28px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 28px;
          color: #0f172a;
        }

        .page-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .dispatch-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;

          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .card-header {
          padding: 20px 22px;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-header h2 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
        }

        .card-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .date-box {
          padding: 18px 22px;
          border-bottom: 1px solid #e2e8f0;

          display: flex;
          align-items: center;
          gap: 12px;
        }

        .date-box label {
          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .date-box input {
          padding: 9px 11px;

          border: 1px solid #e2e8f0;
          border-radius: 8px;

          color: #334155;
          background: #f8fafc;
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
          white-space: nowrap;
        }

        td {
          padding: 13px 20px;

          border-top: 1px solid #f1f5f9;

          color: #334155;
          font-size: 12px;
        }

        .product-name {
          color: #0f172a;
          font-weight: 700;
        }

        .available {
          font-weight: 800;
        }

        .qty-input {
          width: 110px;

          padding: 9px 10px;

          border: 1px solid #e2e8f0;
          border-radius: 8px;

          background: #f8fafc;
        }

        .qty-input:focus {
          outline: none;
          border-color: #2563eb;
          background: white;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .remarks-section {
          padding: 20px 22px;
          border-top: 1px solid #e2e8f0;
        }

        .remarks-section label {
          display: block;
          margin-bottom: 7px;

          color: #334155;
          font-size: 12px;
          font-weight: 700;
        }

        .remarks-section textarea {
          width: 100%;
          min-height: 75px;

          padding: 11px;

          border: 1px solid #e2e8f0;
          border-radius: 8px;

          resize: vertical;
          background: #f8fafc;
        }

        .remarks-section textarea:focus {
          outline: none;
          border-color: #2563eb;
          background: white;
        }

        .bottom {
          padding: 18px 22px;

          display: flex;
          justify-content: flex-end;

          border-top: 1px solid #e2e8f0;
        }

        .dispatch-btn {
          padding: 12px 20px;

          border: none;
          border-radius: 9px;

          background: #2563eb;
          color: white;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
        }

        .dispatch-btn:hover {
          background: #1d4ed8;
        }

        .dispatch-btn:disabled {
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

        .empty {
          padding: 45px;
          text-align: center;

          color: #64748b;
          font-size: 13px;
        }

        @media (max-width: 600px) {
          .date-box {
            align-items: flex-start;
            flex-direction: column;
          }

          .bottom {
            justify-content: stretch;
          }

          .dispatch-btn {
            width: 100%;
          }
        }

      `}</style>

      <div className="dispatch-page">

        <div className="page-header">
          <h1>Daily Dispatch</h1>

          <p>
            Record products dispatched from your inventory.
          </p>
        </div>

        <div className="dispatch-card">

          <div className="card-header">
            <h2>Dispatch Stock</h2>

            <p>
              Enter the quantity dispatched for each product.
            </p>
          </div>

          <div className="date-box">
            <label>DATE</label>

            <input
              type="date"
              value={new Date().toISOString().split("T")[0]}
              readOnly
            />
          </div>

          {products.length === 0 ? (

            <div className="empty">
              No products available.
              <br />
              Add products first from Team & Products.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>AVAILABLE</th>
                    <th>UNIT</th>
                    <th>DISPATCH QTY</th>
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

                      <td className="available">
                        {product.currentStock}
                      </td>

                      <td>
                        {product.unit}
                      </td>

                      <td>
                        <input
                          className="qty-input"
                          type="number"
                          min="0"
                          max={product.currentStock}
                          placeholder="0"
                          value={
                            quantities[product._id] || ""
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              product._id,
                              e.target.value
                            )
                          }
                        />
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {products.length > 0 && (
            <>
              <div className="remarks-section">

                <label>REMARKS (OPTIONAL)</label>

                <textarea
                  placeholder="Add a note about this dispatch..."
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(e.target.value)
                  }
                />

              </div>

              <div className="bottom">

                <button
                  className="dispatch-btn"
                  onClick={handleDispatch}
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Dispatch"}
                </button>

              </div>
            </>
          )}

        </div>

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
    </>
  );
}

export default Dispatch;