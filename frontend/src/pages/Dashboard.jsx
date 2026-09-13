import { useEffect, useState } from "react";
import API from "../api";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, productsResponse] = await Promise.all([
        API.get("/dashboard/stats", { headers }),
        API.get("/products", { headers }),
      ]);

      setStats(statsResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard. Please try again."
      );
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (!stats && !error) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>

        <style>{`
          .dashboard-loading {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #64748b;
          }

          .loading-spinner {
            width: 34px;
            height: 34px;
            border: 4px solid #e2e8f0;
            border-top-color: #2563eb;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 12px;
          }

          .dashboard-loading p {
            margin: 0;
            font-size: 13px;
            font-weight: 600;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // ==============================
  // ERROR
  // ==============================

  if (error) {
    return (
      <>
        <style>{`
          .dashboard-error {
            max-width: 600px;
            margin: 80px auto;
            padding: 30px;
            background: white;
            border: 1px solid #fecaca;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
          }

          .dashboard-error-icon {
            width: 50px;
            height: 50px;
            margin: 0 auto 15px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #fef2f2;
            color: #dc2626;
            font-size: 22px;
            font-weight: 800;
          }

          .dashboard-error h2 {
            margin: 0 0 8px;
            color: #0f172a;
            font-size: 20px;
          }

          .dashboard-error p {
            margin: 0 0 20px;
            color: #64748b;
            font-size: 13px;
          }

          .retry-button {
            border: none;
            padding: 10px 18px;
            border-radius: 8px;
            background: #2563eb;
            color: white;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }

          .retry-button:hover {
            background: #1d4ed8;
          }
        `}</style>

        <div className="dashboard-error">
          <div className="dashboard-error-icon">!</div>

          <h2>Unable to load dashboard</h2>

          <p>{error}</p>

          <button className="retry-button" onClick={loadDashboard}>
            Try Again
          </button>
        </div>
      </>
    );
  }

  // ==============================
  // PRODUCT STATUS
  // ==============================

  const getStatus = (product) => {
    const stock = Number(product.currentStock) || 0;
    const minimum = Number(product.minimumStock) || 0;

    if (stock === 0) {
      return {
        text: "Out of Stock",
        className: "status-out",
      };
    }

    if (stock <= minimum) {
      return {
        text: "Low Stock",
        className: "status-low",
      };
    }

    return {
      text: "In Stock",
      className: "status-ok",
    };
  };

  return (
    <>
      <style>{`

        * {
          box-sizing: border-box;
        }

        .dashboard {
          width: 100%;
          max-width: 1450px;
          margin: 0 auto;
          padding: 4px 0 30px;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 26px;
        }

        .dashboard-title h1 {
          margin: 0;
          color: #0f172a;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .dashboard-title p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          border: 1px solid #dbe3ee;
          border-radius: 9px;
          background: white;
          color: #334155;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover {
          border-color: #93c5fd;
          background: #f8fbff;
          color: #2563eb;
        }

        .refresh-icon {
          font-size: 15px;
        }

        /* ==========================================
           STATS GRID
        ========================================== */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .stat-card {
          position: relative;
          overflow: hidden;

          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;

          padding: 20px;

          box-shadow:
            0 4px 14px rgba(15, 23, 42, 0.045);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);

          box-shadow:
            0 8px 24px rgba(15, 23, 42, 0.08);
        }

        .stat-card::after {
          content: "";
          position: absolute;
          width: 80px;
          height: 80px;
          right: -35px;
          bottom: -35px;

          border-radius: 50%;
          background: #f8fafc;
        }

        .stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .stat-icon {
          position: relative;
          z-index: 1;

          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #eff6ff;
          color: #2563eb;

          font-size: 17px;
          font-weight: 800;
        }

        .stat-value {
          margin-top: 13px;

          color: #0f172a;
          font-size: 30px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .stat-description {
          margin-top: 8px;

          color: #94a3b8;
          font-size: 11px;
        }

        /* Different icon backgrounds */

        .icon-stock {
          background: #ecfdf5;
          color: #059669;
        }

        .icon-low {
          background: #fff7ed;
          color: #d97706;
        }

        .icon-users {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .icon-received {
          background: #ecfeff;
          color: #0891b2;
        }

        .icon-dispatched {
          background: #fff1f2;
          color: #e11d48;
        }

        /* ==========================================
           TABLE CARD
        ========================================== */

        .table-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 15px;
          overflow: hidden;

          box-shadow:
            0 4px 14px rgba(15, 23, 42, 0.045);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          padding: 20px 22px;

          border-bottom: 1px solid #e2e8f0;
        }

        .table-header-left h2 {
          margin: 0;

          color: #0f172a;
          font-size: 16px;
          font-weight: 800;
        }

        .table-header-left p {
          margin: 5px 0 0;

          color: #94a3b8;
          font-size: 11px;
        }

        .product-count {
          padding: 6px 10px;

          border-radius: 20px;

          background: #eff6ff;
          color: #2563eb;

          font-size: 10px;
          font-weight: 800;
        }

        /* ==========================================
           TABLE
        ========================================== */

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        th {
          padding: 13px 20px;

          background: #f8fafc;

          color: #64748b;

          font-size: 10px;
          font-weight: 800;

          text-align: left;

          letter-spacing: 0.4px;
          white-space: nowrap;
        }

        td {
          padding: 15px 20px;

          border-top: 1px solid #f1f5f9;

          color: #475569;
          font-size: 12px;
        }

        tbody tr {
          transition: background 0.15s ease;
        }

        tbody tr:hover {
          background: #f8fafc;
        }

        .product-name {
          color: #0f172a;
          font-weight: 750;
        }

        .product-code {
          color: #64748b;
          font-family: monospace;
          font-size: 11px;
        }

        .stock {
          color: #0f172a;
          font-weight: 800;
        }

        .unit {
          color: #64748b;
          font-weight: 600;
        }

        /* ==========================================
           STATUS
        ========================================== */

        .status {
          display: inline-flex;
          align-items: center;
          gap: 5px;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status::before {
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .status-ok {
          background: #ecfdf3;
          color: #16a34a;
        }

        .status-ok::before {
          background: #22c55e;
        }

        .status-low {
          background: #fff7ed;
          color: #d97706;
        }

        .status-low::before {
          background: #f59e0b;
        }

        .status-out {
          background: #fef2f2;
          color: #dc2626;
        }

        .status-out::before {
          background: #ef4444;
        }

        /* ==========================================
           EMPTY STATE
        ========================================== */

        .empty {
          padding: 60px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          margin: 0 auto 12px;

          border-radius: 12px;

          background: #f1f5f9;
          color: #64748b;

          font-size: 20px;
        }

        .empty h3 {
          margin: 0;

          color: #334155;
          font-size: 14px;
        }

        .empty p {
          margin: 6px 0 0;

          color: #94a3b8;
          font-size: 11px;
        }

        /* ==========================================
           RESPONSIVE
        ========================================== */

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .dashboard {
            padding: 0 0 20px;
          }

          .dashboard-header {
            align-items: stretch;
            flex-direction: column;
            gap: 15px;
          }

          .refresh-button {
            align-self: flex-start;
          }

          .dashboard-title h1 {
            font-size: 24px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .stat-card {
            padding: 17px;
          }

          .stat-value {
            font-size: 26px;
          }

          .table-header {
            padding: 17px;
          }

          th,
          td {
            padding-left: 14px;
            padding-right: 14px;
          }
        }

      `}</style>

      <div className="dashboard">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="dashboard-header">

          <div className="dashboard-title">
            <h1>Dashboard</h1>

            <p>
              Overview of your inventory and stock activity.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={loadDashboard}
          >
            <span className="refresh-icon">↻</span>
            Refresh
          </button>

        </div>

        {/* ==========================================
            SIX STAT CARDS
        ========================================== */}

        <div className="stats-grid">

          {/* TOTAL PRODUCTS */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Products
              </span>

              <div className="stat-icon">
                ▦
              </div>

            </div>

            <div className="stat-value">
              {stats.totalProducts}
            </div>

            <div className="stat-description">
              Products registered in inventory
            </div>

          </div>

          {/* TOTAL STOCK */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Stock
              </span>

              <div className="stat-icon icon-stock">
                📦
              </div>

            </div>

            <div className="stat-value">
              {stats.totalStock}
            </div>

            <div className="stat-description">
              Current combined stock quantity
            </div>

          </div>

          {/* LOW STOCK */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Low Stock
              </span>

              <div className="stat-icon icon-low">
                !
              </div>

            </div>

            <div className="stat-value">
              {stats.lowStockProducts}
            </div>

            <div className="stat-description">
              Products requiring attention
            </div>

          </div>

          {/* TOTAL USERS */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Team Members
              </span>

              <div className="stat-icon icon-users">
                ♙
              </div>

            </div>

            <div className="stat-value">
              {stats.totalUsers}
            </div>

            <div className="stat-description">
              Authorized inventory users
            </div>

          </div>

          {/* TOTAL RECEIVED */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Received
              </span>

              <div className="stat-icon icon-received">
                ↓
              </div>

            </div>

            <div className="stat-value">
              {stats.totalReceived}
            </div>

            <div className="stat-description">
              Quantity received into stock
            </div>

          </div>

          {/* TOTAL DISPATCHED */}

          <div className="stat-card">

            <div className="stat-top">

              <span className="stat-label">
                Total Dispatched
              </span>

              <div className="stat-icon icon-dispatched">
                ↑
              </div>

            </div>

            <div className="stat-value">
              {stats.totalDispatched}
            </div>

            <div className="stat-description">
              Quantity dispatched from stock
            </div>

          </div>

        </div>

        {/* ==========================================
            CURRENT STOCK
        ========================================== */}

        <div className="table-card">

          <div className="table-header">

            <div className="table-header-left">

              <h2>
                Current Stock
              </h2>

              <p>
                Live inventory status from MongoDB
              </p>

            </div>

            <span className="product-count">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </span>

          </div>

          {products.length === 0 ? (

            <div className="empty">

              <div className="empty-icon">
                📦
              </div>

              <h3>
                No products available
              </h3>

              <p>
                Admin can add products from Team & Products.
              </p>

            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>

                  <tr>
                    <th>PRODUCT</th>
                    <th>CODE</th>
                    <th>CATEGORY</th>
                    <th>STOCK</th>
                    <th>UNIT</th>
                    <th>MINIMUM</th>
                    <th>STATUS</th>
                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => {

                    const status = getStatus(product);

                    return (

                      <tr key={product._id}>

                        <td className="product-name">
                          {product.productName}
                        </td>

                        <td className="product-code">
                          {product.productCode}
                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td className="stock">
                          {product.currentStock}
                        </td>

                        <td className="unit">
                          {product.unit}
                        </td>

                        <td>
                          {product.minimumStock}
                        </td>

                        <td>

                          <span
                            className={`status ${status.className}`}
                          >
                            {status.text}
                          </span>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Dashboard;