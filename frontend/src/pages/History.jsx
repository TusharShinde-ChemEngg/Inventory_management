import { useEffect, useState } from "react";
import API from "../api";

function History() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await API.get("/stock/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setError("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType =
      filter === "ALL" ||
      transaction.type === filter;

    const productName =
      transaction.product?.productName || "";

    const productCode =
      transaction.product?.productCode || "";

    const matchesSearch =
      productName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      productCode
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <style>{`

        .history-page {
          max-width: 1250px;
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

        .history-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;

          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .filters {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 18px 22px;

          border-bottom: 1px solid #e2e8f0;
        }

        .filter-btn {
          padding: 8px 14px;

          border: 1px solid #e2e8f0;
          border-radius: 8px;

          background: white;
          color: #64748b;

          font-size: 12px;
          font-weight: 600;

          cursor: pointer;
        }

        .filter-btn:hover {
          background: #f8fafc;
        }

        .filter-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .search {
          margin-left: auto;

          width: 230px;
          padding: 9px 12px;

          border: 1px solid #e2e8f0;
          border-radius: 8px;

          background: #f8fafc;

          font-size: 12px;
        }

        .search:focus {
          outline: none;
          border-color: #2563eb;
          background: white;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          padding: 13px 18px;

          background: #f8fafc;

          color: #64748b;

          font-size: 10px;
          font-weight: 700;

          text-align: left;
          white-space: nowrap;
        }

        td {
          padding: 14px 18px;

          border-top: 1px solid #f1f5f9;

          color: #334155;
          font-size: 12px;
        }

        .product-name {
          color: #0f172a;
          font-weight: 700;
        }

        .product-code {
          margin-top: 3px;
          color: #94a3b8;
          font-size: 10px;
        }

        .type {
          display: inline-block;

          padding: 5px 9px;

          border-radius: 20px;

          font-size: 10px;
          font-weight: 700;
        }

        .received {
          background: #ecfdf3;
          color: #16a34a;
        }

        .dispatched {
          background: #eff6ff;
          color: #2563eb;
        }

        .adjustment {
          background: #fff7ed;
          color: #d97706;
        }

        .quantity {
          font-weight: 800;
        }

        .empty {
          padding: 50px 20px;

          text-align: center;

          color: #64748b;
          font-size: 13px;
        }

        .error {
          padding: 14px;

          margin-bottom: 18px;

          border-radius: 8px;

          background: #fef2f2;
          color: #dc2626;

          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 650px) {

          .filters {
            flex-wrap: wrap;
          }

          .search {
            width: 100%;
            margin-left: 0;
          }

        }

      `}</style>

      <div className="history-page">

        <div className="page-header">
          <h1>History</h1>

          <p>
            View all stock movements and transactions.
          </p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <div className="history-card">

          {/* FILTERS */}

          <div className="filters">

            <button
              className={`filter-btn ${
                filter === "ALL" ? "active" : ""
              }`}
              onClick={() => setFilter("ALL")}
            >
              All
            </button>

            <button
              className={`filter-btn ${
                filter === "RECEIVED" ? "active" : ""
              }`}
              onClick={() => setFilter("RECEIVED")}
            >
              Received
            </button>

            <button
              className={`filter-btn ${
                filter === "DISPATCHED" ? "active" : ""
              }`}
              onClick={() => setFilter("DISPATCHED")}
            >
              Dispatched
            </button>

            <input
              className="search"
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* TABLE */}

          {loading ? (

            <div className="empty">
              Loading history...
            </div>

          ) : filteredTransactions.length === 0 ? (

            <div className="empty">
              No transactions found.
            </div>

          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>PRODUCT</th>
                    <th>TYPE</th>
                    <th>QUANTITY</th>
                    <th>USER</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTransactions.map(
                    (transaction) => {

                      let typeClass = "adjustment";

                      if (
                        transaction.type === "RECEIVED"
                      ) {
                        typeClass = "received";
                      }

                      if (
                        transaction.type === "DISPATCHED"
                      ) {
                        typeClass = "dispatched";
                      }

                      return (
                        <tr key={transaction._id}>

                          <td>
                            {formatDate(
                              transaction.createdAt
                            )}
                          </td>

                          <td>
                            <div className="product-name">
                              {transaction.product
                                ?.productName ||
                                "Deleted Product"}
                            </div>

                            <div className="product-code">
                              {transaction.product
                                ?.productCode || "-"}
                            </div>
                          </td>

                          <td>
                            <span
                              className={`type ${typeClass}`}
                            >
                              {transaction.type}
                            </span>
                          </td>

                          <td className="quantity">
                            {transaction.quantity}
                          </td>

                          <td>
                            {transaction.user?.name ||
                              "Unknown"}
                          </td>

                          <td>
                            {transaction.remarks || "-"}
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default History;