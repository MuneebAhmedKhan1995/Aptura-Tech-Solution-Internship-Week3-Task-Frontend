import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSale, getSaleById } from '../../redux/actions/salesActions';
import { getInventory } from '../../redux/actions/inventoryActions';
import { toast } from 'react-toastify';

const SalesForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedSale, loading } = useSelector((state) => state.sales);
  const { items: inventory } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: 'cash',
    status: 'Pending'
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getInventory());
    if (isEdit && !selectedSale) {
      dispatch(getSaleById(id));
    }
    if (isEdit && selectedSale) {
      setFormData({
        productId: selectedSale.productId || selectedSale.items?.[0]?.product?._id || '',
        quantity: selectedSale.quantity || selectedSale.items?.[0]?.quantity || 1,
        customerName: selectedSale.customer?.name || selectedSale.customerName || '',
        customerEmail: selectedSale.customer?.email || selectedSale.customerEmail || '',
        customerPhone: selectedSale.customer?.phone || selectedSale.customerPhone || '',
        paymentMethod: selectedSale.paymentMethod || 'cash',
        status: selectedSale.status || 'Pending'
      });
      const product = inventory.find(p => p.id === (selectedSale.productId || selectedSale.items?.[0]?.product?._id));
      setSelectedProduct(product);
    }
  }, [dispatch, id, selectedSale, isEdit, inventory]);

  useEffect(() => {
    if (formData.productId) {
      const product = inventory.find(p => p.id === formData.productId || p._id === formData.productId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, inventory]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.productId || formData.quantity < 1) {
      toast.error('Please select a product and enter valid quantity');
      return;
    }

    const saleData = {
      customer: {
        name: formData.customerName || 'Walk-in Customer',
        email: formData.customerEmail || '',
        phone: formData.customerPhone || ''
      },
      items: [
        {
          product: formData.productId,
          quantity: parseInt(formData.quantity),
          price: selectedProduct?.price || 0,
          total: (selectedProduct?.price || 0) * parseInt(formData.quantity)
        }
      ],
      paymentMethod: formData.paymentMethod || 'cash',
      notes: `Sale for ${formData.customerName || 'Walk-in Customer'}`
    };

    const result = await dispatch(createSale(saleData));
    
    if (result.success) {
      toast.success('Sale created successfully');
      navigate('/sales');
    } else {
      toast.error(result.error || 'Failed to create sale');
    }
  };

  if (user?.role === 'employee') {
    return <div className="access-denied">Access Denied</div>;
  }

  return (
    <div className="sales-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Sale' : 'Create Sale'}</h1>
        <button onClick={() => navigate('/sales')} className="btn btn-secondary">
          ← Back to Sales
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="form-control"
              required
              disabled={isEdit}
            >
              <option value="">Select Product</option>
              {inventory && inventory.length > 0 ? (
                inventory.map((product) => (
                  <option key={product.id || product._id} value={product.id || product._id}>
                    {product.name} - ${product.price} (Stock: {product.stock})
                  </option>
                ))
              ) : (
                <option value="">No products available</option>
              )}
            </select>
            {selectedProduct && (
              <small className="text-muted">
                Price: ${selectedProduct.price} | Stock: {selectedProduct.stock}
              </small>
            )}
          </div>
          
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control"
              min="1"
              max={selectedProduct?.stock || 100}
              required
              disabled={isEdit}
            />
            {selectedProduct && formData.quantity > selectedProduct.stock && (
              <small className="text-danger">Not enough stock!</small>
            )}
          </div>
          
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter customer name"
            />
          </div>
          
          <div className="form-group">
            <label>Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter customer email"
            />
          </div>
          
          <div className="form-group">
            <label>Customer Phone</label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter customer phone"
            />
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="form-control"
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="online">Online Payment</option>
            </select>
          </div>
          
          {selectedProduct && !isEdit && (
            <div className="form-group full-width">
              <div className="total-amount">
                <strong>Total Amount:</strong> ${(selectedProduct.price * formData.quantity).toFixed(2)}
              </div>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Sale' : 'Create Sale')}
          </button>
          <button type="button" onClick={() => navigate('/sales')} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesForm;