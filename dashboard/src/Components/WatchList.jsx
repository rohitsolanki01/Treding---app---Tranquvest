import React, { useState, useContext, useEffect, useRef } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import GeneralContext from "./GeneralContext";
import { Tooltip, Grow, CircularProgress } from "@mui/material";
import "../index.css";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  Refresh,
  Add,
  Remove,
  Close,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import DoughoutChart from "./DoughoutChart";

const WatchList = () => {
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalInvested: 0,
    currentHoldingsValue: 0,
    totalPnL: 0,
    totalPnLPercent: 0
  });

  const symbols = watchlist.map(stock => stock.name);

  // NEW: analytics scroll/highlight
  const chartRef = useRef(null);
  const [chartFlash, setChartFlash] = useState(false);
  const handleAnalyzeClick = (symbol) => {
    if (chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setChartFlash(true);
      setTimeout(() => setChartFlash(false), 1600);
    }
  };

  useEffect(() => {
    fetchLivePrices();
    fetchPortfolioData();
    const interval = setInterval(() => {
      fetchLivePrices();
      fetchPortfolioData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLivePrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:8080/api/nse-quotes', { symbols }, { timeout: 30000 });
      if (response.data) {
        setLivePrices(response.data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch live prices:', error);
      setError('Failed to fetch live prices');
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolioData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // holdings
      try {
        const holdingsResponse = await axios.get('http://localhost:8080/api/holdings', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 10000
        });
        if (holdingsResponse.data?.success) {
          const holdingsArray = holdingsResponse.data.holdings || [];
          setHoldings(holdingsArray);
        } else {
          setHoldings([]);
        }
      } catch (err) {
        setHoldings([]);
      }

      // portfolio summary
      try {
        const portfolioResponse = await axios.get('http://localhost:8080/api/portfolio', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 10000
        });
        if (portfolioResponse.data && portfolioResponse.data.success) {
          setPortfolioSummary(portfolioResponse.data.portfolio);
        }
      } catch (err) {
        // ignore to avoid UI spam
      }

    } catch (error) {
      console.error('General portfolio fetch error:', error);
      setHoldings([]);
    }
  };

  const getCombinedStockData = () => {
    return watchlist.map(stock => {
      const liveData = livePrices[stock.name];
      const holding = holdings.find(h => {
        if (!h || !h.symbol || !stock.name) return false;
        const a = stock.name.toString().trim();
        const b = h.symbol.toString().trim();
        return a === b || a.toLowerCase() === b.toLowerCase() || a.toUpperCase() === b.toUpperCase();
      });

      const baseStock = { ...stock, holding: holding || null };

      if (liveData) {
        return {
          ...baseStock,
          price: liveData.currentPrice || 0,
          percent: `${liveData.changePercent >= 0 ? '+' : ''}${(liveData.changePercent || 0).toFixed(2)}%`,
          change: liveData.change || 0,
          isDown: (liveData.change || 0) < 0,
          isLive: liveData.isRealData || false,
          lastUpdated: liveData.timestamp
        };
      }
      return baseStock;
    });
  };

  const combinedData = getCombinedStockData();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount || 0);

  return (
    <div className="watchlist-container">
      {/* Controls */}
      <div className="search-container">
        <input type="text" placeholder="Search stocks in watchlist..." className="search" />
        <span className="counts">{watchlist.length}</span>
        <div className="watchlist-controls">
          <Tooltip title="Refresh Data" placement="top">
            <button
              className="refresh-btn"
              onClick={() => { fetchLivePrices(); fetchPortfolioData(); }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={16} /> : <Refresh />}
            </button>
          </Tooltip>
          {lastUpdate && <span className="last-update">Updated: {lastUpdate.toLocaleTimeString()}</span>}
          {error && <span className="error-message">{error}</span>}
        </div>
      </div>

      {/* Data Status */}
      <div className="data-status">
        <span className={`status-indicator ${Object.keys(livePrices).length > 0 ? 'live' : 'static'}`}>
          {Object.keys(livePrices).length > 0
            ? `Live Data (${Object.values(livePrices).filter(p => p && p.isRealData).length}/${symbols.length} real)`
            : 'Static Data'}
        </span>
      </div>

      {/* Stock List */}
      <ul className="list">
        {combinedData.map((stock, index) => (
          <WatchListItem
            stock={stock}
            key={index}
            onOrderComplete={fetchPortfolioData}
            onAnalyze={handleAnalyzeClick}
          />
        ))}
      </ul>

      {/* Doughnut Chart with scroll target and highlight */}
      <div id="portfolio-chart" ref={chartRef} className={`chart-viewport ${chartFlash ? 'flash' : ''}`}>
        <DoughoutChart data={{
          labels: combinedData.map(stock => stock.name),
          datasets: [{
            label: "Current Price (₹)",
            data: combinedData.map(stock => stock.price || 0),
            backgroundColor: [
              "rgba(16, 185, 129, 0.5)",
              "rgba(59, 130, 246, 0.5)",
              "rgba(245, 158, 11, 0.5)",
              "rgba(239, 68, 68, 0.5)",
              "rgba(139, 92, 246, 0.5)",
            ],
            borderColor: [
              "rgba(16, 185, 129, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(239, 68, 68, 1)",
              "rgba(139, 92, 246, 1)",
            ],
            borderWidth: 2,
          }]
        }} />
      </div>
    </div>
  );
};

// Item
const WatchListItem = ({ stock, onOrderComplete, onAnalyze }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);
  const hasHolding = !!(stock.holding && stock.holding.totalQty > 0);
  const holdingQuantity = hasHolding ? stock.holding.totalQty : 0;

  return (
    <li onMouseEnter={() => setShowWatchlistActions(true)} onMouseLeave={() => setShowWatchlistActions(false)}>
      <div className="item">
        <div className="stock-info">
          <p className={stock.isDown ? "down" : "up"}>
            <span className="stock-symbol">{stock.name}</span>
            {stock.isLive && <span className="live-badge">LIVE</span>}
            {hasHolding ? (
              <span className="holding-badge">📦 {holdingQuantity} shares</span>
            ) : (
              <span className="no-holding-badge">Not held</span>
            )}
          </p>
        </div>

        <div className="itemInfo">
          <span className={`percent ${stock.isDown ? "down" : "up"}`}>{stock.percent || '0.00%'}</span>
          {stock.isDown ? <KeyboardArrowDown className="down" /> : <KeyboardArrowUp className="up" />}
          <span className="price">₹{typeof stock.price === 'number' ? stock.price.toFixed(2) : (stock.price || '0.00')}</span>
          {stock.change && (
            <span className={`change ${stock.isDown ? "down" : "up"}`}>
              ({stock.change >= 0 ? '+' : ''}₹{Math.abs(stock.change).toFixed(2)})
            </span>
          )}
          {hasHolding && (
            <span className={`pnl ${(stock.holding.pnl || 0) >= 0 ? "profit" : "loss"}`}>
              P&L: {(stock.holding.pnl || 0) >= 0 ? '+' : ''}₹{Math.abs(stock.holding.pnl || 0).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {showWatchlistActions && (
        <WatchListActions
          uid={stock.name}
          stock={stock}
          hasHolding={hasHolding}
          holdingQuantity={holdingQuantity}
          onOrderComplete={onOrderComplete}
          onAnalyze={onAnalyze}
        />
      )}
    </li>
  );
};

// Actions
const WatchListActions = ({ uid, stock, hasHolding, holdingQuantity, onOrderComplete, onAnalyze }) => {
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [orderMode, setOrderMode] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);

  const currentPrice = stock?.price || 0;
  const totalValue = quantity * currentPrice;
  const canSell = hasHolding && holdingQuantity > 0;

  const handleOrderClick = (mode) => {
    setOrderMode(mode);
    setShowOrderPanel(true);
    setQuantity(mode === 'sell' && canSell ? Math.min(1, holdingQuantity) : 1);
  };

  const executeOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) { toast.error('Please login to place orders'); return; }
    if (orderMode === 'sell' && !canSell) { toast.error(`You don't own any shares of ${uid}`); return; }
    if (orderMode === 'sell' && quantity > holdingQuantity) {
      toast.error(`Cannot sell ${quantity} shares. You only have ${holdingQuantity} shares.`);
      return;
    }

    setOrderLoading(true);
    try {
      const orderData = {
        name: stock?.name || uid,
        symbol: uid,
        qty: parseInt(quantity),
        price: parseFloat(currentPrice),
        mode: orderMode
      };
      const response = await axios.post('http://localhost:8080/api/neworder', orderData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        toast.success(`${orderMode.toUpperCase()} order executed! ${quantity} shares of ${uid} @ ₹${currentPrice.toFixed(2)}`);
        setShowOrderPanel(false);
        setQuantity(1);
        setTimeout(() => { onOrderComplete?.(); }, 1500);
      }
    } catch (error) {
      const message = error.response?.data?.details || error.response?.data?.error || `Failed to execute ${orderMode} order`;
      toast.error(message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (!showOrderPanel) {
    return (
      <span className="actions">
        <span>
          <Tooltip title="Buy Stock" placement="top" arrow TransitionComponent={Grow}>
            <button
              className="action-btn buy"
              aria-label={`Buy ${uid}`}
              onClick={() => handleOrderClick('buy')}
            >
              Buy
            </button>
          </Tooltip>

          <Tooltip
            title={!canSell ? `No ${uid} shares to sell` : `Sell ${holdingQuantity} ${uid} shares`}
            placement="top"
            arrow
            TransitionComponent={Grow}
          >
            <button
              className={`action-btn sell ${!canSell ? 'disabled' : ''}`}
              aria-label={`Sell ${uid}`}
              onClick={() => canSell && handleOrderClick('sell')}
              disabled={!canSell}
            >
              Sell {canSell ? `(${holdingQuantity})` : ''}
            </button>
          </Tooltip>

          <Tooltip title="View analytics" placement="top" arrow TransitionComponent={Grow}>
            <button
              className="action-btn analytics"
              aria-label={`View analytics for ${uid}`}
              onClick={() => onAnalyze?.(uid)}
            >
              <BarChartOutlined className="icon" />
              <span className="ml-6">Analytics</span>
            </button>
          </Tooltip>
        </span>
      </span>
    );
  }

  return (
    <div className="order-panel">
      <div className="order-header">
        <div className={`order-title ${orderMode}`}>
          <span className="order-type">{orderMode.toUpperCase()}</span>
          <span className="stock-symbol">{uid}</span>
        </div>
        <button className="close-panel-btn" onClick={() => setShowOrderPanel(false)} disabled={orderLoading}>
          <Close />
        </button>
      </div>

      <div className="order-body">
        <div className="price-section">
          <div className="current-price">
            <span className="price-label">Current Price</span>
            <span className="price-value">₹{currentPrice.toFixed(2)}</span>
          </div>
          {orderMode === 'sell' && (
            <div className="holding-info">
              <span className="holding-label">Available</span>
              <span className="holding-value">{holdingQuantity} shares</span>
            </div>
          )}
        </div>

        <div className="quantity-section">
          <label className="qty-label">Quantity</label>
          <div className="qty-controls">
            <button
              className="qty-btn decrease"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1 || orderLoading}
            >
              <Remove />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value) || 1);
                setQuantity(orderMode === 'sell' ? Math.min(val, holdingQuantity) : val);
              }}
              min="1"
              max={orderMode === 'sell' ? holdingQuantity : undefined}
              className="qty-input"
              disabled={orderLoading}
            />
            <button
              className="qty-btn increase"
              onClick={() => setQuantity(q => (orderMode === 'sell' ? Math.min(q + 1, holdingQuantity) : q + 1))}
              disabled={(orderMode === 'sell' && quantity >= holdingQuantity) || orderLoading}
            >
              <Add />
            </button>
          </div>
        </div>

        <div className="order-summary">
          <div className="total-value">
            <span className="total-label">Total Value</span>
            <span className="total-amount">₹{totalValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-actions">
          <button
            className={`execute-order-btn ${orderMode}`}
            onClick={executeOrder}
            disabled={orderLoading || (orderMode === 'sell' && (!canSell || quantity > holdingQuantity))}
          >
            {orderLoading ? (
              <>
                <CircularProgress size={16} color="inherit" />
                Processing...
              </>
            ) : (
              <>
                {orderMode === 'buy' ? 'Buy' : 'Sell'} {quantity} Share{quantity > 1 ? 's' : ''}
              </>
            )}
          </button>

          {orderMode === 'sell' && !canSell && (
            <div className="sell-warning">You don't own any shares of {uid}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchList;
