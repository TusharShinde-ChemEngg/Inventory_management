
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;

    if (!/^\d{4}$/.test(pin)) {
      setError("PIN must contain exactly 4 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", {
        pin,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Incorrect PIN. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
          background: #f5f8fa;
        }

        /* ==========================================
           MAIN SCREEN
        ========================================== */

        .login-screen {
          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px;

          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(26, 110, 125, 0.08),
              transparent 32%
            ),
            radial-gradient(
              circle at 90% 90%,
              rgba(35, 91, 111, 0.08),
              transparent 32%
            ),
            #f5f8fa;
        }

        /* ==========================================
           LOGIN CARD
        ========================================== */

        .login-card {
          width: 100%;
          max-width: 470px;

          padding: 42px;

          background: rgba(255, 255, 255, 0.98);

          border: 1px solid #e3eaee;

          border-radius: 22px;

          box-shadow:
            0 20px 55px
            rgba(15, 45, 58, 0.11);

          position: relative;
          overflow: hidden;
        }

        /* Top accent */

        .login-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 0;
          right: 0;

          height: 4px;

          background:
            linear-gradient(
              90deg,
              #174d5d,
              #438995,
              #8bbeb8
            );
        }

        /* ==========================================
           COMPANY BRANDING
        ========================================== */

        .company-brand {
          display: flex;
          align-items: center;

          gap: 14px;

          margin-bottom: 35px;
        }

        /* ==========================================
           COMPANY LOGO
        ========================================== */

        .company-logo {
          width: 220px;
          height: 100px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 12px;

          background: #ffffff;

          border: 1px solid #e2e8eb;

          overflow: hidden;

          flex-shrink: 0;

          box-shadow:
            0 5px 15px
            rgba(20, 70, 85, 0.08);
        }

        .company-logo img {
          width: 100%;
          height: 100%;

          object-fit: contain;

          padding: 6px;

          display: block;
        }

        /* ==========================================
           COMPANY NAME
        ========================================== */

        .company-info {
          line-height: 1;
        }

        .company-name {
          color: #163f4d;

          font-size: 21px;

          font-weight: 800;

          letter-spacing: -0.4px;
        }

        .company-type {
          margin-top: 6px;

          color: #78909a;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 2.6px;
        }

        /* ==========================================
           SYSTEM LABEL
        ========================================== */

        .system-label {
          display: inline-flex;

          align-items: center;

          gap: 7px;

          margin-bottom: 20px;

          padding: 7px 10px;

          border-radius: 20px;

          background: #edf6f5;

          color: #356d75;

          font-size: 10px;

          font-weight: 700;

          letter-spacing: 0.4px;
        }

        .system-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #4c958d;
        }

        /* ==========================================
           TITLE
        ========================================== */

        .login-title {
          margin: 0;

          color: #172b34;

          font-size: 32px;

          font-weight: 800;

          letter-spacing: -0.8px;
        }

        .login-sub {
          margin: 8px 0 28px;

          color: #71828a;

          font-size: 13px;

          line-height: 1.6;
        }

        /* ==========================================
           PIN LABEL
        ========================================== */

        .pin-label {
          display: block;

          margin-bottom: 8px;

          color: #344b55;

          font-size: 12px;

          font-weight: 700;
        }

        /* ==========================================
           PIN INPUT
        ========================================== */

        .pin-row input {
          width: 100%;

          padding: 16px;

          border: 1px solid #dce5e9;

          border-radius: 10px;

          background: #f8fafb;

          color: #172b34;

          text-align: center;

          font-size: 23px;

          letter-spacing: 0.45em;

          outline: none;

          transition:
            border-color 0.2s,
            box-shadow 0.2s,
            background 0.2s;
        }

        .pin-row input::placeholder {
          color: #a4b0b5;

          letter-spacing: 0.05em;

          font-size: 14px;
        }

        .pin-row input:focus {
          border-color: #4d8b91;

          background: white;

          box-shadow:
            0 0 0 4px
            rgba(77, 139, 145, 0.1);
        }

        .pin-row input:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }

        /* ==========================================
           LOGIN BUTTON
        ========================================== */

        .btn-primary {
          width: 100%;

          margin-top: 16px;

          padding: 13px 16px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              135deg,
              #174d5d,
              #286878
            );

          color: white;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 7px 18px
            rgba(23, 77, 93, 0.18);

          transition:
            transform 0.2s,
            box-shadow 0.2s,
            background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 10px 22px
            rgba(23, 77, 93, 0.23);

          background:
            linear-gradient(
              135deg,
              #123f4d,
              #205b6a
            );
        }

        .btn-primary:disabled {
          opacity: 0.65;

          cursor: not-allowed;

          transform: none;
        }

        /* ==========================================
           ERROR
        ========================================== */

        .login-err {
          margin-top: 12px;

          padding: 10px 12px;

          border: 1px solid #f3d2d2;

          border-radius: 8px;

          background: #fff7f7;

          color: #c43d3d;

          font-size: 12px;

          font-weight: 600;

          line-height: 1.5;
        }

        /* ==========================================
           DIVIDER
        ========================================== */

        .login-divider {
          height: 1px;

          margin: 30px 0 18px;

          background: #edf1f3;
        }

        /* ==========================================
           FOOTER
        ========================================== */

        .login-footer {
          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 10px;

          color: #98a6ac;

          font-size: 10px;

          line-height: 1.5;
        }

        .footer-right {
          color: #71878f;

          font-weight: 600;
        }

        /* ==========================================
           SECURITY NOTE
        ========================================== */

        .security-note {
          display: flex;

          align-items: center;

          justify-content: center;

          gap: 6px;

          margin-top: 17px;

          color: #9aa7ac;

          font-size: 9px;
        }

        .security-icon {
          font-size: 11px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 480px) {

          .login-screen {
            padding: 18px;
          }

          .login-card {
            padding: 30px 22px;

            border-radius: 18px;
          }

          .company-brand {
            margin-bottom: 28px;

            flex-direction: column;
            align-items: flex-start;
          }

          .company-logo {
            width: 180px;
            height: 80px;
          }

          .company-name {
            font-size: 18px;
          }

          .company-type {
            font-size: 8px;
            letter-spacing: 2px;
          }

          .login-title {
            font-size: 28px;
          }

          .login-footer {
            flex-direction: column;

            justify-content: center;

            text-align: center;
          }
        }
      `}</style>

      <div className="login-screen">

        <div className="login-card">

          {/* ========================================
              COMPANY LOGO + NAME
          ======================================== */}

          <div className="company-brand">

            <div className="company-logo">

              <img
                src="/chemengg-logo.png"
                alt="ChemEngg Research"
              />

            </div>

            <div className="company-info">

              <div className="company-name">
                ChemEngg
              </div>

              <div className="company-type">
                RESEARCH
              </div>

            </div>

          </div>

          {/* ========================================
              SYSTEM LABEL
          ======================================== */}

          <div className="system-label">

            <span className="system-dot"></span>

            INVENTORY MANAGEMENT SYSTEM

          </div>

          {/* ========================================
              TITLE
          ======================================== */}

          <h1 className="login-title">
            Sign in
          </h1>

          <p className="login-sub">
            Enter your 4-digit PIN to access
            the inventory and stock management
            system.
          </p>

          {/* ========================================
              PIN
          ======================================== */}

          <label
            className="pin-label"
            htmlFor="pin"
          >
            Security PIN
          </label>

          <div className="pin-row">

            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              placeholder="Enter PIN"
              value={pin}
              disabled={loading}
              onChange={(e) => {

                const value =
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 4);

                setPin(value);

                setError("");

              }}
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  handleLogin();
                }

              }}
              autoFocus
            />

          </div>

          {/* ========================================
              ERROR
          ======================================== */}

          {error && (

            <div className="login-err">
              {error}
            </div>

          )}

          {/* ========================================
              LOGIN BUTTON
          ======================================== */}

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>

          {/* ========================================
              FOOTER
          ======================================== */}

          <div className="login-divider"></div>

          <div className="login-footer">

            <span>
              Internal Use Only
            </span>

            <span className="footer-right">
              ChemEngg Research
            </span>

          </div>

          {/* ========================================
              SECURITY NOTE
          ======================================== */}

          <div className="security-note">

            <span className="security-icon">
              🔒
            </span>

            Secure access to company inventory

          </div>

        </div>

      </div>
    </>
  );
}

export default Login;

