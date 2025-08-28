import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {};
      
      if (filter !== 'all') {
        if (['buy', 'sell'].includes(filter)) {
          params.mode = filter;
        } else if (['pending', 'executed', 'cancelled'].includes(filter)) {
          params.status = filter;
        }
      }

      const response = await axios.get('http://localhost:8080/api/orders', {
        params,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/api/orders/${orderId}/cancel`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        toast.success('Order cancelled');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  // Professional data processing
  const processedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (searchTerm) {
        return order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               order.symbol?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [orders, searchTerm, sortBy, sortOrder]);

  // Portfolio analytics
  const analytics = useMemo(() => {
    const buyOrders = orders.filter(o => o.mode === 'buy');
    const sellOrders = orders.filter(o => o.mode === 'sell');
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const executedOrders = orders.filter(o => o.status === 'executed');

    const totalInvested = buyOrders
      .filter(o => o.status === 'executed')
      .reduce((sum, o) => sum + o.totalValue, 0);

    const totalRealized = sellOrders
      .filter(o => o.status === 'executed')
      .reduce((sum, o) => sum + o.totalValue, 0);

    const pendingValue = pendingOrders
      .reduce((sum, o) => sum + o.totalValue, 0);

    return {
      totalOrders: orders.length,
      buyOrders: buyOrders.length,
      sellOrders: sellOrders.length,
      pendingOrders: pendingOrders.length,
      executedOrders: executedOrders.length,
      totalInvested,
      totalRealized,
      pendingValue,
      netPosition: totalRealized - totalInvested
    };
  }, [orders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Executive Summary Dashboard */}
      <div className="executive-summary">
        <div className="summary-header">
          <h1 className="page-title">Order Management</h1>
          <div className="summary-subtitle">
            Real-time portfolio tracking and order execution
          </div>
        </div>
        
        <div className="kpi-grid">
          <div className="kpi-card primary">
            <div className="kpi-header">
              <span className="kpi-label">Total Orders</span>
              <div className="kpi-trend positive">
                <span className="trend-indicator">↗</span>
              </div>
            </div>
            <div className="kpi-value">{analytics.totalOrders}</div>
            <div className="kpi-detail">
              {analytics.executedOrders} executed, {analytics.pendingOrders} pending
            </div>
          </div>

          <div className="kpi-card success">
            <div className="kpi-header">
              <span className="kpi-label">Invested Capital</span>
              <div className="kpi-trend positive">
                <span className="trend-indicator">↗</span>
              </div>
            </div>
            <div className="kpi-value">{formatCurrency(analytics.totalInvested)}</div>
            <div className="kpi-detail">{analytics.buyOrders} buy orders</div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-header">
              <span className="kpi-label">Realized Value</span>
              <div className="kpi-trend neutral">
                <span className="trend-indicator">→</span>
              </div>
            </div>
            <div className="kpi-value">{formatCurrency(analytics.totalRealized)}</div>
            <div className="kpi-detail">{analytics.sellOrders} sell orders</div>
          </div>

          <div className="kpi-card info">
            <div className="kpi-header">
              <span className="kpi-label">Net Position</span>
              <div className={`kpi-trend ${analytics.netPosition >= 0 ? 'positive' : 'negative'}`}>
                <span className="trend-indicator">
                  {analytics.netPosition >= 0 ? '↗' : '↘'}
                </span>
              </div>
            </div>
            <div className={`kpi-value ${analytics.netPosition >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(Math.abs(analytics.netPosition))}
            </div>
            <div className="kpi-detail">
              {analytics.netPosition >= 0 ? 'Profit' : 'Loss'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="controls-panel">
        <div className="controls-left">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search orders by symbol or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <div className="search-icon">🔍</div>
          </div>
        </div>
        
        <div className="controls-right">
          <div className="filter-group">
            {['all', 'buy', 'sell', 'pending', 'executed', 'cancelled'].map(filterType => (
              <button
                key={filterType}
                className={`filter-chip ${filter === filterType ? 'active' : ''}`}
                onClick={() => setFilter(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="data-table-container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr className="table-header">
                <th className="sortable" onClick={() => handleSort('name')}>
                  <div className="header-content">
                    <span>Instrument</span>
                    <span className="sort-indicator">
                      {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('mode')}>
                  <div className="header-content">
                    <span>Order Type</span>
                    <span className="sort-indicator">
                      {sortBy === 'mode' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable numeric" onClick={() => handleSort('qty')}>
                  <div className="header-content">
                    <span>Quantity</span>
                    <span className="sort-indicator">
                      {sortBy === 'qty' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable numeric" onClick={() => handleSort('price')}>
                  <div className="header-content">
                    <span>Price</span>
                    <span className="sort-indicator">
                      {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable numeric" onClick={() => handleSort('totalValue')}>
                  <div className="header-content">
                    <span>Total Value</span>
                    <span className="sort-indicator">
                      {sortBy === 'totalValue' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('status')}>
                  <div className="header-content">
                    <span>Status</span>
                    <span className="sort-indicator">
                      {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('createdAt')}>
                  <div className="header-content">
                    <span>Order Time</span>
                    <span className="sort-indicator">
                      {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </span>
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <div className="empty-content">
                      <div className="empty-icon">📊</div>
                      <p>No orders found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                processedOrders.map((order) => {
                  const datetime = formatDateTime(order.createdAt);
                  return (
                    <tr key={order._id} className={`table-row ${order.mode} ${order.status}`}>
                      <td className="instrument-cell">
                        <div className="instrument-info">
                          <div className="symbol">{order.symbol || order.name}</div>
                          <div className="company-name">{order.name}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`order-badge ${order.mode}`}>
                          <span className="badge-dot"></span>
                          {order.mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="numeric">
                        <span className="quantity">{order.qty.toLocaleString()}</span>
                      </td>
                      <td className="numeric">
                        <span className="price">{formatCurrency(order.price)}</span>
                      </td>
                      <td className="numeric">
                        <span className="total-value">{formatCurrency(order.totalValue)}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="datetime-cell">
                        <div className="datetime-info">
                          <div className="date">{datetime.date}</div>
                          <div className="time">{datetime.time}</div>
                        </div>
                      </td>
                      <td className="actions-cell">
                        {order.status === 'pending' && (
                          <button
                            className="action-button cancel"
                            onClick={() => handleCancelOrder(order._id)}
                            title="Cancel Order"
                          >
                            Cancel
                          </button>
                        )}
                        {order.status !== 'pending' && (
                          <span className="status-text">
                            {order.status === 'executed' ? 'Completed' : 'Cancelled'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <div className="summary-text">
          Showing {processedOrders.length} of {orders.length} orders
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>
    </div>
  );
};

export default Orders;
