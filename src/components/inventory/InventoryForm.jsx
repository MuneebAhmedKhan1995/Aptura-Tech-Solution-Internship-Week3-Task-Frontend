import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createInventoryItem, updateInventoryItem, getInventoryById } from '../../redux/actions/inventoryActions';
import { toast } from 'react-toastify';

const InventoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedItem, loading } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    supplier: '',
    description: '',
    status: 'In Stock'
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      dispatch(getInventoryById(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && selectedItem) {
      setFormData({
        name: selectedItem.name || '',
        category: selectedItem.category || '',
        price: selectedItem.price || '',
        stock: selectedItem.stock || '',
        supplier: selectedItem.supplier || '',
        description: selectedItem.description || '',
        status: selectedItem.status || 'In Stock'
      });
    }
  }, [isEdit, selectedItem]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Item name is required';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      errors.stock = 'Stock must be 0 or greater';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    let result;
    if (isEdit) {
      result = await dispatch(updateInventoryItem(id, submitData));
    } else {
      result = await dispatch(createInventoryItem(submitData));
    }

    if (result.success) {
      toast.success(isEdit ? 'Item updated successfully' : 'Item created successfully');
      navigate('/inventory');
    } else {
      toast.error(result.error || 'Operation failed');
    }
  };

  if (user?.role === 'employee') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to manage inventory.</p>
        <button onClick={() => navigate('/inventory')} className="btn btn-secondary">
          Back to Inventory
        </button>
      </div>
    );
  }

  return (
    <div className="inventory-form">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h1>
        <button onClick={() => navigate('/inventory')} className="btn btn-secondary">
          ← Back to Inventory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Item Name <span className="required">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${formErrors.name ? 'error' : ''}`}
              placeholder="Enter item name"
              required
            />
            {formErrors.name && <span className="error-text">{formErrors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Category <span className="required">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-control ${formErrors.category ? 'error' : ''}`}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">📱 Electronics</option>
              <option value="Furniture">🪑 Furniture</option>
              <option value="Clothing">👕 Clothing</option>
              <option value="Food">🍔 Food</option>
              <option value="Office Supplies">📎 Office Supplies</option>
              <option value="Hardware">🔧 Hardware</option>
              <option value="Software">💻 Software</option>
              <option value="Other">📦 Other</option>
            </select>
            {formErrors.category && <span className="error-text">{formErrors.category}</span>}
          </div>
          
          <div className="form-group">
            <label>Price ($) <span className="required">*</span></label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-control ${formErrors.price ? 'error' : ''}`}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            {formErrors.price && <span className="error-text">{formErrors.price}</span>}
          </div>
          
          <div className="form-group">
            <label>Stock Quantity <span className="required">*</span></label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`form-control ${formErrors.stock ? 'error' : ''}`}
              placeholder="0"
              min="0"
              required
            />
            {formErrors.stock && <span className="error-text">{formErrors.stock}</span>}
          </div>
          
          <div className="form-group">
            <label>Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter supplier name"
            />
          </div>
          
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="In Stock">✅ In Stock</option>
              <option value="Low Stock">⚠️ Low Stock</option>
              <option value="Out of Stock">❌ Out of Stock</option>
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Enter item description (optional)"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEdit ? 'Update Item' : 'Create Item'}</>
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/inventory')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryForm;