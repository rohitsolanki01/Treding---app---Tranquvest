import React, { useEffect, useState } from 'react';
import api from '../Components/client'; // use the axios instance

const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);

      // If no token, prompt login instead of hitting API
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please login to view positions.');
        setPositions([]);
        return;
      }

      const res = await api.get('/api/positions?status=OPEN');
      const data = Array.isArray(res.data) ? res.data : (res.data.positions || []);
      setPositions(data);

      if (data.length > 0) {
        const syms = [...new Set(data.map(p => p.symbol))];
        await markLive(syms);
      }
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to fetch positions');
    } finally {
      setLoading(false);
    }
  };

  const markLive = async (symbolsParam = null) => {
    const symbols = symbolsParam ?? [...new Set(positions.map(p => p.symbol))];
    if (symbols.length === 0) return;
    try {
      setMarking(true);
      // quotes endpoint does not require auth
      const res = await api.post('/api/nse-quotes', { symbols });
      setPrices(res.data || {});
      setLastUpdate(new Date());
    } catch {
      // non-fatal; keep old marks
    } finally {
      setMarking(false);
    }
  };

  const squareOff = async (symbol) => {
    try {
      await api.put(`/api/positions/${symbol}/squareoff`, {});
      await fetchPositions();
    } catch (e) {
      alert(e?.response?.data?.error || 'Failed to square off');
    }
  };

  useEffect(() => { fetchPositions(); }, []);
  useEffect(() => {
    const t = setInterval(() => markLive(), 60000);
    return () => clearInterval(t);
  }, [positions]);

  const rows = positions.map(p => {
    const live = prices[p.symbol];
    const mark = num(live?.currentPrice, num(p.lastPrice));
    const netQty = num(p.netQty);
    const netAvg = num(p.netAvgPrice);
    const multiplier = num(p.contractMultiplier, 1);

    const unrealized = (p.side === 'LONG')
      ? (mark - netAvg) * netQty * multiplier
      : (netAvg - mark) * Math.abs(netQty) * multiplier;

    const basis = Math.abs(netAvg * netQty * multiplier);
    const upct = basis > 0 ? (unrealized / basis) * 100 : 0;

    return { ...p, mark, unrealized, upct };
  });

  const totals = rows.reduce((acc, r) => {
    acc.grossExposure += Math.abs(r.mark * r.netQty * num(r.contractMultiplier, 1));
    acc.unrealized += r.unrealized;
    acc.realized += num(r.realizedPnl);
    return acc;
  }, { grossExposure: 0, unrealized: 0, realized: 0 });

  if (loading) return <div style={{ padding: 16 }}>Loading positions…</div>;
  if (error) return <div style={{ padding: 16, color: '#c00' }}>Error: {error}</div>;

  return (
    <div className="positions-container">
      <div className="positions-header">
        <h2>Positions ({positions.length})</h2>
        <div className="positions-kpis">
          <div className="kpi">
            <div className="kpi-label">Gross Exposure</div>
            <div className="kpi-value">₹{num(totals.grossExposure).toLocaleString('en-IN')}</div>
          </div>
          <div className={`kpi ${totals.unrealized >= 0 ? 'profit' : 'loss'}`}>
            <div className="kpi-label">Unrealized P&L</div>
            <div className="kpi-value">₹{Math.abs(num(totals.unrealized)).toLocaleString('en-IN')}</div>
          </div>
          <div className={`kpi ${totals.realized >= 0 ? 'profit' : 'loss'}`}>
            <div className="kpi-label">Realized P&L</div>
            <div className="kpi-value">₹{Math.abs(num(totals.realized)).toLocaleString('en-IN')}</div>
          </div>
          <button className="refresh-btn" onClick={() => markLive()} disabled={marking}>
            {marking ? 'Marking…' : (lastUpdate ? `Mark: ${lastUpdate.toLocaleTimeString()}` : 'Mark Now')}
          </button>
        </div>
      </div>

      <div className="positions-table-card">
        <table className="positions-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Product</th>
              <th>Side</th>
              <th>Net Qty</th>
              <th>Net Avg</th>
              <th>LTP/Mark</th>
              <th>Unrlzd P&L</th>
              <th>%</th>
              <th>Rlzd P&L</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const unrealCls = r.unrealized >= 0 ? 'profit' : 'loss';
              const realizedCls = num(r.realizedPnl) >= 0 ? 'profit' : 'loss';
              return (
                <tr key={r._id || r.symbol + i}>
                  <td>{r.symbol}</td>
                  <td>{r.productType}</td>
                  <td>{r.side}</td>
                  <td>{num(r.netQty).toLocaleString('en-IN')}</td>
                  <td>₹{num(r.netAvgPrice).toFixed(2)}</td>
                  <td>₹{num(r.mark).toFixed(2)}</td>
                  <td className={unrealCls}>₹{Math.abs(num(r.unrealized)).toLocaleString('en-IN')}</td>
                  <td className={unrealCls}>{(num(r.upct)).toFixed(2)}%</td>
                  <td className={realizedCls}>₹{Math.abs(num(r.realizedPnl)).toLocaleString('en-IN')}</td>
                  <td>
                    <button onClick={() => squareOff(r.symbol)} disabled={num(r.netQty) === 0}>
                      Square Off
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 16 }}>No open positions</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Positions;
