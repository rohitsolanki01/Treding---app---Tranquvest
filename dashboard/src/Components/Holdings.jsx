import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './Holding.css';

ChartJS.register(
  ArcElement,
  ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [realTimePrices, setRealTimePrices] = useState({});
  const [backendSummary, setBackendSummary] = useState(null); // NEW: /api/portfolio summary
  const [loading, setLoading] = useState(true);
  const [updatingPrices, setUpdatingPrices] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvestment: 0,
    currentValue: 0,
    totalPL: 0,
    totalPLPercent: 0
  });

  useEffect(() => {
    // Load holdings and backend summary in parallel on mount
    (async () => {
      setLoading(true);
      try {
        await Promise.all([fetchHoldings(), fetchPortfolioSummary()]);
      } finally {
        setLoading(false);
      }
    })();

    const interval = setInterval(() => {
      updateRealTimePrices();
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  // Recompute KPIs whenever live prices, holdings, or backend summary change
  useEffect(() => {
    computeLivePortfolio();
  }, [allHoldings, realTimePrices, backendSummary]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchHoldings = async () => {
    try {
      setError(null);
      const res = await axios.get("http://localhost:8080/api/holdings", {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        timeout: 15000
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.holdings || []);
      setAllHoldings(data);
      // Kick initial live update
      if (data.length > 0) {
        const symbols = data.map(h => h.symbol).filter(Boolean);
        await updateRealTimePrices(symbols);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to fetch holdings';
      setError(`Failed to fetch holdings: ${msg}`);
    }
  };

  const fetchPortfolioSummary = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/portfolio", {
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        timeout: 15000
      });
      if (res.data?.success) {
        setBackendSummary(res.data.portfolio || null);
      } else {
        setBackendSummary(null);
      }
    } catch (err) {
      // Don’t hard-fail UI; just proceed without backend summary
      setBackendSummary(null);
    }
  };

  const updateRealTimePrices = async (symbolsParam = null) => {
    const symbols = symbolsParam ?? allHoldings.map(h => h.symbol).filter(Boolean);
    if (symbols.length === 0) return;
    try {
      setUpdatingPrices(true);
      setError(null);
      const batch = await axios.post(
        "http://localhost:8080/api/nse-quotes",
        { symbols },
        { headers: { 'Content-Type': 'application/json' }, timeout: 25000 }
      );
      const prices = batch.data || {};
      setRealTimePrices(prices);
      setLastUpdate(new Date());
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to update prices';
      setError(`Failed to update prices: ${msg}`);
    } finally {
      setUpdatingPrices(false);
    }
  };

  const num = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
  };

  // NEW: unified live KPI computation that uses backend invested + live prices for current value
  const computeLivePortfolio = () => {
    // Invested capital: prefer backend summary (orders-aware), fallback to client calc
    const investedFromBackend = num(backendSummary?.totalInvested, null);
    let totalInvestment = investedFromBackend ?? allHoldings.reduce((sum, h) => {
      return sum + num(h.avgPrice) * num(h.totalQty);
    }, 0);

    // Live current value: sum qty * (live currentPrice || persisted holding.currentPrice)
    let currentValue = allHoldings.reduce((sum, h) => {
      const live = realTimePrices[h.symbol];
      const current = num(live?.currentPrice, num(h.currentPrice));
      return sum + current * num(h.totalQty);
    }, 0);

    // Derive P&L from live current value and invested
    const totalPL = currentValue - totalInvestment;
    const totalPLPercent = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

    setPortfolioStats({
      totalInvestment,
      currentValue,
      totalPL,
      totalPLPercent
    });
  };

  const getUpdatedHoldings = () => {
    return allHoldings.map((h, idx) => {
      const live = realTimePrices[h.symbol];
      const qty = num(h.totalQty);
      const avg = num(h.avgPrice);
      const currentPrice = num(live?.currentPrice, num(h.currentPrice));
      const changePercent = num(live?.changePercent, 0);
      const investment = avg * qty;
      const currentValue = currentPrice * qty;
      const profitLoss = currentValue - investment;
      const profitLossPercent = avg > 0 ? ((currentPrice / avg - 1) * 100) : 0;

      return {
        ...h,
        _idx: idx,
        qty,
        avg,
        currentPrice,
        changePercent,
        investment,
        currentValue,
        profitLoss,
        profitLossPercent,
        hasRealTimeData: !!live
      };
    });
  };

  const updatedHoldings = getUpdatedHoldings();

  const colors = [
    '#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2',
    '#073B4C', '#EF476F', '#FFD166', '#06D6A0', '#118AB2'
  ];

  if (loading) {
    return (
      <div className="holdings-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading holdings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="holdings-container">
        <div className="error-state">
          <h3>⚠️ Error Loading Data</h3>
          <p>{error}</p>
          <button onClick={() => { fetchHoldings(); fetchPortfolioSummary(); }}>🔄 Retry</button>
          <details style={{ marginTop: '20px', textAlign: 'left' }}>
            <summary>Debug Information</summary>
            <pre>
{`Backend URL: http://localhost:8080/api/holdings
Holdings Count: ${allHoldings.length}
Price Data Count: ${Object.keys(realTimePrices).length}
Last Update: ${lastUpdate ? lastUpdate.toLocaleTimeString() : 'None'}`}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  const pieChartData = {
    labels: updatedHoldings.map(stock => stock.symbol || stock.name || `S${stock._idx + 1}`),
    datasets: [{
      data: updatedHoldings.map(stock => num(stock.currentValue)),
      backgroundColor: colors.slice(0, updatedHoldings.length),
      borderColor: '#ffffff',
      borderWidth: 3,
    }],
  };

  const barChartData = {
    labels: updatedHoldings.map(stock => stock.symbol || stock.name || `S${stock._idx + 1}`),
    datasets: [{
      data: updatedHoldings.map(stock => num(stock.profitLoss)),
      backgroundColor: updatedHoldings.map(stock =>
        num(stock.profitLoss) >= 0 ? '#06D6A0' : '#EF476F'
      ),
      borderRadius: 8,
    }],
  };

  return (
    <div className="holdings-container">
      <div className="holdings-header">
        <h2>Indian Stock Holdings ({allHoldings.length})</h2>
        <div className="header-stats">
          <span className="update-time">
            {lastUpdate ? `Updated: ${lastUpdate.toLocaleTimeString()}` : 'No updates yet'}
          </span>
          <button
            className="refresh-btn"
            onClick={() => updateRealTimePrices()}
            disabled={updatingPrices}
          >
            {updatingPrices ? '🔄 Updating...' : '🔄 Refresh Data'}
          </button>
        </div>
      </div>

      {/* Portfolio Summary (now live) */}
      <div className="portfolio-summary">
        <div className="summary-card investment">
          <div className="card-content">
            <div className="card-value">₹{num(portfolioStats.totalInvestment).toLocaleString('en-IN')}</div>
            <div className="card-label">Total Investment</div>
          </div>
        </div>

        <div className="summary-card current">
          <div className="card-content">
            <div className="card-value">₹{num(portfolioStats.currentValue).toLocaleString('en-IN')}</div>
            <div className="card-label">Current Value</div>
          </div>
        </div>

        <div className={`summary-card pnl ${num(portfolioStats.totalPL) >= 0 ? 'profit' : 'loss'}`}>
          <div className="card-content">
            <div className="card-value">
              ₹{Math.abs(num(portfolioStats.totalPL)).toLocaleString('en-IN')}
              <span className="percentage">
                ({num(portfolioStats.totalPL) >= 0 ? '+' : '-'}{Math.abs(num(portfolioStats.totalPLPercent)).toFixed(2)}%)
              </span>
            </div>
            <div className="card-label">Total P&L</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-wrapper">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Portfolio Distribution',
                    font: { size: 18, weight: '600' }
                  },
                  legend: { position: 'bottom' }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-wrapper">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'P&L Analysis',
                    font: { size: 18, weight: '600' }
                  },
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        const v = Number(value);
                        return '₹' + (Number.isFinite(v) ? v.toLocaleString('en-IN') : value);
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="holdings-table-card">
        <div className="table-header">
          <h3>Stock Holdings</h3>
        </div>
        <div className="table-container">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Data</th>
                <th>Qty</th>
                <th>Avg Price</th>
                <th>Current Price</th>
                <th>Day Change</th>
                <th>P&L</th>
                <th>% Change</th>
              </tr>
            </thead>
            <tbody>
              {updatedHoldings.map((stock, index) => {
                const isProfit = num(stock.profitLoss) >= 0;
                const dayChangeClass = num(stock.changePercent) >= 0 ? 'profit' : 'loss';
                return (
                  <tr key={stock._id || stock.symbol || index}>
                    <td>{stock.symbol}</td>
                    <td>{stock.name || '-'}</td>
                    <td>
                      <span className={`data-source-badge ${stock.hasRealTimeData ? 'live' : 'static'}`}>
                        {stock.hasRealTimeData ? '🟢 LIVE' : '🔴 STATIC'}
                      </span>
                    </td>
                    <td>{num(stock.totalQty, num(stock.qty)).toLocaleString('en-IN')}</td>
                    <td>₹{num(stock.avgPrice, num(stock.avg)).toFixed(2)}</td>
                    <td>₹{num(stock.currentPrice).toFixed(2)}</td>
                    <td className={dayChangeClass}>
                      {num(stock.changePercent) !== 0 ? (
                        <>
                          {num(stock.changePercent) >= 0 ? '+' : ''}
                          {Math.abs(num(stock.changePercent)).toFixed(2)}%
                        </>
                      ) : '--'}
                    </td>
                    <td className={isProfit ? 'profit' : 'loss'}>
                      ₹{Math.abs(num(stock.profitLoss)).toLocaleString('en-IN')}
                    </td>
                    <td className={isProfit ? 'profit' : 'loss'}>
                      {isProfit ? '+' : '-'}{Math.abs(num(stock.profitLossPercent)).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
              {updatedHoldings.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '16px' }}>
                    No holdings to display
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Holdings;
