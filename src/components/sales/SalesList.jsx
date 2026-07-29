import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSales, deleteSale, updateSaleStatus } from '../../redux/actions/salesActions';
import { toast } from 'react-toastify';

const SalesList = () => {
  const dispatch = useDispatch();
  const { sales, loading, error } = useSelector((state) => state.sales);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    dispatch(getSales());
  }, [dispatch]);

  useEffect(() => {
    console.log('📦 Sales Data:', sales);
    console.log('📊 Total Sales:', sales?.length);
  }, [sales]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      const result = await dispatch(deleteSale(id));
      if (result.success) {
        toast.success('Sale deleted successfully');
        dispatch(getSales());
      } else {
        toast.error(result.error || 'Failed to delete sale');
      }
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
   
    const statusOptions = ['pending', 'paid', 'failed', 'refunded'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    const newStatus = statusOptions[nextIndex];

    if (!window.confirm(`Change status from "${currentStatus}" to "${newStatus}"?`)) return;

    setUpdatingStatus(id);
    const result = await dispatch(updateSaleStatus(id, newStatus));
    setUpdatingStatus(null);

    if (result.success) {
      toast.success(`Status updated to "${newStatus}"`);
      dispatch(getSales());
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const getProductName = (sale) => {
    if (sale?.items && sale.items.length > 0) {
      return sale.items[0]?.product?.name || sale.items[0]?.productName || 'Product';
    }
    return sale?.productName || 'Product';
  };

  const getTotalQuantity = (sale) => {
    if (sale?.items && sale.items.length > 0) {
      return sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    return sale?.quantity || 1;
  };

  const getCustomerName = (sale) => {
    return sale?.customer?.name || sale?.customerName || 'Walk-in Customer';
  };

  const getStatus = (sale) => {
    return sale?.paymentStatus || sale?.status || 'pending';
  };

  const filteredSales = sales && sales.length > 0 ? sales.filter(sale => {
    const customerName = getCustomerName(sale).toLowerCase();
    const productName = getProductName(sale).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = customerName.includes(search) || productName.includes(search);
    const matchesStatus = !statusFilter || getStatus(sale) === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const canViewSales = user?.permissions?.includes('view_sales') || user?.role === 'admin';
  const canManageSales = user?.permissions?.includes('manage_sales') || user?.role === 'admin';

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'status-pending',
      paid: 'status-paid',
      failed: 'status-failed',
      refunded: 'status-refunded'
    };
    return classes[status] || 'status-pending';
  };

  if (!canViewSales) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view sales.</p>
      </div>
    );
  }

  return (
    <div className="sales-list">
      <div className="page-header">
        <h1>Sales</h1>
        {canManageSales && (
          <Link to="/sales/add" className="btn btn-primary">
            + Create Sale
          </Link>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search sales..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Product</th>
              <th>Customer</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales && filteredSales.length > 0 ? (
              filteredSales.map((sale) => {
                const saleId = sale._id || sale.id;
                const status = getStatus(sale);
                const isUpdating = updatingStatus === saleId;
                
                return (
                  <tr key={saleId || Math.random()}>
                    <td>
                      <span className="invoice-badge">
                        {sale.invoiceNumber || saleId?.slice(-6) || 'N/A'}
                      </span>
                    </td>
                    <td>{getProductName(sale)}</td>
                    <td>{getCustomerName(sale)}</td>
                    <td>{getTotalQuantity(sale)}</td>
                    <td className="amount">${(sale.total || 0).toFixed(2)}</td>
                    <td>
                      {/* ✅ Status with Update Button */}
                      <div className="status-with-update">
                        <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                          {status.toUpperCase()}
                        </span>
                        {canManageSales && (
                          <button
                            onClick={() => handleStatusUpdate(saleId, status)}
                            className="btn btn-sm btn-outline-primary"
                            disabled={isUpdating}
                            title="Click to change status"
                          >
                            {isUpdating ? '⏳' : '🔄'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      <Link to={`/sales/${saleId}`} className="btn btn-sm btn-info">
                        View
                      </Link>
                      {canManageSales && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(saleId, status)} 
                            className="btn btn-sm btn-warning"
                            disabled={isUpdating}
                          >
                            {isUpdating ? '...' : 'Status'}
                          </button>
                          <button onClick={() => handleDelete(saleId)} className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#6c757d' }}>
                  No sales found. Create your first sale!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesList;