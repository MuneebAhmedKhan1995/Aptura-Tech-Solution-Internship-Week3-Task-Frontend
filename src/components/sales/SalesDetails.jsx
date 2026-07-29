import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSaleById } from '../../redux/actions/salesActions';

const SalesDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedSale, loading, error } = useSelector((state) => state.sales);

  useEffect(() => {
    if (id) {
      dispatch(getSaleById(id));
    }
  }, [dispatch, id]);

  const getSaleId = () => {
    return selectedSale?._id || selectedSale?.id || 'N/A';
  };

  const getInvoiceNumber = () => {
    return selectedSale?.invoiceNumber || 'N/A';
  };

  const getProductName = () => {
    if (selectedSale?.items && selectedSale.items.length > 0) {
      return selectedSale.items[0]?.product?.name || selectedSale.items[0]?.productName || 'Product';
    }
    return selectedSale?.productName || 'Product';
  };

  const getTotalQuantity = () => {
    if (selectedSale?.items && selectedSale.items.length > 0) {
      return selectedSale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    return selectedSale?.quantity || 1;
  };

  const getCustomerName = () => {
    return selectedSale?.customer?.name || selectedSale?.customerName || 'Walk-in Customer';
  };

  const getCustomerEmail = () => {
    return selectedSale?.customer?.email || selectedSale?.customerEmail || '-';
  };

  const getCustomerPhone = () => {
    return selectedSale?.customer?.phone || selectedSale?.customerPhone || '-';
  };

  const getStatus = () => {
    return selectedSale?.paymentStatus || selectedSale?.status || 'Pending';
  };

  const getTotal = () => {
    return selectedSale?.total || 0;
  };

  const getSaleDate = () => {
    const date = selectedSale?.saleDate || selectedSale?.createdAt;
    if (date) {
      return new Date(date).toLocaleString();
    }
    return 'Invalid Date';
  };

  const getCreatedBy = () => {
    return selectedSale?.user?.name || selectedSale?.createdBy || 'Unknown';
  };

  const getItems = () => {
    if (selectedSale?.items && selectedSale.items.length > 0) {
      return selectedSale.items;
    }
  
    return [{
      product: { name: selectedSale?.productName || 'Product' },
      quantity: selectedSale?.quantity || 1,
      price: selectedSale?.price || 0,
      total: selectedSale?.total || 0
    }];
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!selectedSale) return <div>No sale found</div>;

  const items = getItems();

  return (
    <div className="sales-details">
      <div className="page-header">
        <h1>Sale Details</h1>
        <button onClick={() => navigate('/sales')} className="btn btn-secondary">
          ← Back to Sales
        </button>
      </div>
      
      <div className="details-card">
       
        <div className="details-header">
          <div className="invoice-info">
            <h2>Invoice: {getInvoiceNumber()}</h2>
            <span className={`status-badge ${getStatus().toLowerCase()}`}>
              {getStatus()}
            </span>
          </div>
        </div>

        <div className="details-grid">
         
          <div className="details-section">
            <h3>Customer Information</h3>
            <div className="details-row">
              <span className="label">Name:</span>
              <span>{getCustomerName()}</span>
            </div>
            <div className="details-row">
              <span className="label">Email:</span>
              <span>{getCustomerEmail()}</span>
            </div>
            <div className="details-row">
              <span className="label">Phone:</span>
              <span>{getCustomerPhone()}</span>
            </div>
          </div>

          
          <div className="details-section">
            <h3>Sale Information</h3>
            <div className="details-row">
              <span className="label">Sale ID:</span>
              <span>{getSaleId()}</span>
            </div>
            <div className="details-row">
              <span className="label">Date:</span>
              <span>{getSaleDate()}</span>
            </div>
            <div className="details-row">
              <span className="label">Payment Method:</span>
              <span>{selectedSale?.paymentMethod || '-'}</span>
            </div>
            <div className="details-row">
              <span className="label">Total Amount:</span>
              <span className="amount">${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

     
        <div className="items-section">
          <h3>Order Items</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.product?.name || item.productName || 'Product'}</td>
                  <td>${(item.price || 0).toFixed(2)}</td>
                  <td>{item.quantity || 1}</td>
                  <td>${(item.total || item.price * item.quantity || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Subtotal:</td>
                <td>${(selectedSale?.subtotal || getTotal()).toFixed(2)}</td>
              </tr>
              {selectedSale?.tax > 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'right' }}>Tax:</td>
                  <td>${(selectedSale?.tax || 0).toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
                  Total:
                </td>
                <td style={{ fontWeight: 'bold', fontSize: '18px', color: '#1a237e' }}>
                  ${getTotal().toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {selectedSale?.notes && (
          <div className="notes-section">
            <h3>Notes</h3>
            <p>{selectedSale.notes}</p>
          </div>
        )}

        <div className="details-footer">
          <div className="details-row">
            <span className="label">Created At:</span>
            <span>{getSaleDate()}</span>
          </div>
          <div className="details-row">
            <span className="label">Created By:</span>
            <span>{getCreatedBy()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDetails;