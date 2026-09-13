import { NavLink, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">SR</div>
          <div>
            <h2>Stock Register</h2>
            <span>Inventory Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <NavLink to="/dashboard">
            <span>▣</span>
            Dashboard
          </NavLink>

          <NavLink to="/receive">
            <span>＋</span>
            Receive Stock
          </NavLink>

          <NavLink to="/dispatch">
            <span>⇧</span>
            Daily Dispatch
          </NavLink>

          <NavLink to="/history">
            <span>◷</span>
            History
          </NavLink>

          {user.role === "admin" && (
            <NavLink to="/products">
              <span>▤</span>
              Team & Products
            </NavLink>
          )}

        </nav>

        {/* USER FOOTER */}
        <div className="sidebar-footer">

          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user.name || "User"}</strong>
              <small>
                {user.role === "admin" ? "Administrator" : "Staff"}
              </small>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>

      <style>{`

        * {
          box-sizing: border-box;
        }

        .app-layout {
          min-height: 100vh;
          display: flex;
          background: #f4f7fb;
        }

        /* SIDEBAR */

        .sidebar {
          width: 245px;
          min-height: 100vh;

          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;

          display: flex;
          flex-direction: column;

          padding: 24px 16px;

          background:
            linear-gradient(
              180deg,
              #0f172a,
              #111c33
            );

          color: white;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 4px 8px 28px;

          border-bottom: 1px solid
            rgba(255,255,255,0.08);
        }

        .brand-logo {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background:
            linear-gradient(
              135deg,
              #2563eb,
              #60a5fa
            );

          font-size: 13px;
          font-weight: 800;
        }

        .brand h2 {
          margin: 0;
          font-size: 15px;
        }

        .brand span {
          display: block;
          margin-top: 3px;

          color: #94a3b8;
          font-size: 10px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;

          gap: 6px;

          margin-top: 24px;
        }

        .sidebar-nav a {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 12px 13px;

          border-radius: 9px;

          color: #cbd5e1;
          text-decoration: none;

          font-size: 13px;
          font-weight: 600;

          transition: 0.2s;
        }

        .sidebar-nav a span {
          width: 20px;
          text-align: center;
          font-size: 16px;
        }

        .sidebar-nav a:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .sidebar-nav a.active {
          background: #2563eb;
          color: white;

          box-shadow:
            0 7px 18px
            rgba(37,99,235,0.25);
        }

        /* FOOTER */

        .sidebar-footer {
          margin-top: auto;

          padding-top: 18px;

          border-top: 1px solid
            rgba(255,255,255,0.08);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;

          margin-bottom: 14px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: #2563eb;

          font-size: 13px;
          font-weight: 800;
        }

        .user-info strong {
          display: block;
          font-size: 12px;
        }

        .user-info small {
          display: block;
          margin-top: 2px;

          color: #94a3b8;
          font-size: 10px;
        }

        .logout-btn {
          width: 100%;

          padding: 9px;

          border: 1px solid
            rgba(255,255,255,0.1);

          border-radius: 8px;

          background: transparent;

          color: #cbd5e1;

          cursor: pointer;
          font-size: 12px;
        }

        .logout-btn:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        /* MAIN */

        .main-content {
          flex: 1;
          margin-left: 245px;

          min-width: 0;

          padding: 32px 38px;
        }

        @media (max-width: 720px) {

          .app-layout {
            display: block;
          }

          .sidebar {
            position: relative;

            width: 100%;
            min-height: auto;

            padding: 14px;
          }

          .brand {
            padding-bottom: 14px;
          }

          .sidebar-nav {
            flex-direction: row;

            overflow-x: auto;

            margin-top: 14px;
          }

          .sidebar-nav a {
            white-space: nowrap;
          }

          .sidebar-footer {
            display: none;
          }

          .main-content {
            margin-left: 0;
            padding: 22px 16px;
          }
        }

      `}</style>
    </div>
  );
}

export default Layout;