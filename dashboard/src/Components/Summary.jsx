import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Summary = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // NEW: portfolio/holdings state
  const [hLoading, setHLoading] = useState(false);
  const [hError, setHError] = useState(null);
  const [holdingsCount, setHoldingsCount] = useState(0);
  const [investment, setInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [totalPL, setTotalPL] = useState(0);
  const [totalPLPercent, setTotalPLPercent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeAgo = (dateInput) => {
    if (!dateInput) return "N/A";
    const now = new Date();
    const d = new Date(dateInput);
    const diffMin = Math.floor((now - d) / (1000 * 60));
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)} hours ago`;
    return d.toLocaleDateString();
  };

  const formatINR = (v) => {
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(Number(v) || 0);
    } catch {
      return `₹${Number(v || 0).toLocaleString("en-IN")}`;
    }
  };

  // NEW: fetch holdings + portfolio for live metrics
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      const token = localStorage.getItem("token");
      if (!token) {
        setHError("Not authenticated. Please login.");
        return;
      }
      setHLoading(true);
      setHError(null);
      try {
        // Fetch holdings for count and fallback calculations
        const [hRes, pRes] = await Promise.all([
          axios.get("http://localhost:8080/api/holdings", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
          axios.get("http://localhost:8080/api/portfolio", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            timeout: 15000,
          }),
        ]);

        const holdings = Array.isArray(hRes.data) ? hRes.data : (hRes.data?.holdings || []);
        const count = holdings.filter(h => Number(h?.totalQty) > 0).length;

        // Prefer backend summary if available
        const portfolio = pRes.data?.success ? pRes.data?.portfolio : null;

        const sumInvestment = portfolio?.totalInvested ??
          holdings.reduce((s, h) => s + Number(h?.totalInvested || 0), 0);
        const sumCurrent = portfolio?.currentHoldingsValue ??
          holdings.reduce((s, h) => s + Number(h?.marketValue || 0), 0);
        const sumPL = portfolio?.totalPnL ??
          holdings.reduce((s, h) => s + Number(h?.pnl || 0), 0);
        const plPct = sumInvestment > 0 ? (sumPL / sumInvestment) * 100 : 0;

        setHoldingsCount(count);
        setInvestment(sumInvestment);
        setCurrentValue(sumCurrent);
        setTotalPL(sumPL);
        setTotalPLPercent(plPct);
      } catch (err) {
        setHError(err?.response?.data?.error || err.message || "Failed to load portfolio");
      } finally {
        setHLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="summary-container">
        <div className="summary-card skeleton">
          <div className="skeleton-line lg" />
          <div className="skeleton-line md" />
          <div className="skeleton-line sm" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="summary-container">
        <div className="summary-card">
          <div className="summary-header">
            <div className="avatar placeholder" aria-hidden="true" />
            <div className="header-text">
              <h6 className="title">Guest</h6>
              <p className="subtext">Not signed in</p>
            </div>
          </div>
          <div className="divider" />
          <div className="empty-state">
            <p className="muted">Please sign in to view account details.</p>
          </div>
        </div>
      </div>
    );
  }

  const providerLabel = user.provider === "google" ? "Google" : "Email";
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A";
  const lastLoginLabel = timeAgo(user.lastLogin);

  return (
    <div className="summary-container">
      {/* User profile */}
      <section className="summary-card">
        <header className="summary-header">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="avatar initials" aria-hidden="true">
              {(user.name || user.email || "U").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="header-text">
            <h6 className="title">{user.name || "User"}</h6>
            <p className="subtext">{user.email}</p>
            <div className="meta-row">
              <span className="badge">{providerLabel}</span>
              {user.isEmailVerified && <span className="badge success">Verified</span>}
            </div>
            <p className="muted small">
              Last login: <span className="strong">{lastLoginLabel}</span>
            </p>
          </div>
        </header>
        <div className="divider" />
        {/* Account status */}
        <div className="section">
          <div className="section-title">Account Status</div>
          <div className="grid grid-3">
            <div className="stat">
              <div className="label">Account Type</div>
              <div className="value">{providerLabel}</div>
            </div>
            <div className="stat">
              <div className="label">Member Since</div>
              <div className="value">{createdAt}</div>
            </div>
            <div className="stat">
              <div className="label">Email</div>
              <div className={`value ${user.isEmailVerified ? "ok" : "warn"}`}>
                {user.isEmailVerified ? "Verified" : "Unverified"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equity (optional static or wire to backend balance endpoint if available) */}
      <section className="summary-card">
        <div className="section-title">Equity</div>
        <div className="grid grid-3 fit">
          <div className="metric">
            <div className="metric-value">{formatINR(0)}</div>
            <div className="metric-label">Margin Available</div>
          </div>
          <div className="metric">
            <div className="metric-value">{formatINR(0)}</div>
            <div className="metric-label">Margins Used</div>
          </div>
          <div className="metric">
            <div className="metric-value">{formatINR(0)}</div>
            <div className="metric-label">Opening Balance</div>
          </div>
        </div>
      </section>

      {/* Holdings (now live) */}
      <section className="summary-card">
        <div className="section-title">Holdings ({holdingsCount})</div>
        {hLoading ? (
          <div className="muted">Loading holdings…</div>
        ) : hError ? (
          <div className="muted" style={{ color: '#c94f4f' }}>{hError}</div>
        ) : (
          <div className="grid grid-3 fit">
            <div className="metric">
              <div className={`metric-value ${totalPL >= 0 ? "profit" : "loss"}`}>
                {formatINR(Math.abs(totalPL))}
                <span className="metric-chip">
                  {(totalPL >= 0 ? "+" : "-") + Math.abs(totalPLPercent).toFixed(2)}%
                </span>
              </div>
              <div className="metric-label">Total P&L</div>
            </div>
            <div className="metric">
              <div className="metric-value">{formatINR(currentValue)}</div>
              <div className="metric-label">Current Value</div>
            </div>
            <div className="metric">
              <div className="metric-value">{formatINR(investment)}</div>
              <div className="metric-label">Investment</div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Summary;
