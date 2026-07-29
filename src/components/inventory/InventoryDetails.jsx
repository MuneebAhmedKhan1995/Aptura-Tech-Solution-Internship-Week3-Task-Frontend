import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInventoryById } from '../../redux/actions/inventoryActions';
import { toast } from 'react-toastify';

const InventoryDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedItem, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      console.log('🔍 Fetching item with ID:', id);
      dispatch(getInventoryById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedItem) {
      console.log('📦 Selected Item:', JSON.stringify(selectedItem, null, 2));
    }
  }, [selectedItem]);

  const handleEdit = () => {
    navigate(`/inventory/edit/${id}`);
  };

  const handleBack = () => {
    navigate('/inventory');
  };

  const getItemId = () => {
    return selectedItem?._id || selectedItem?.id || 'N/A';
  };
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader-spinner"></div>
        <p>Loading inventory item details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button onClick={handleBack} className="btn btn-secondary">
          Back to Inventory
        </button>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="error-container">
        <div className="error">Inventory item not found</div>
        <button onClick={handleBack} className="btn btn-secondary">
          Back to Inventory
        </button>
      </div>
    );
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', className: 'out-of-stock' };
    if (stock <= 10) return { label: 'Low Stock', className: 'low-stock' };
    return { label: 'In Stock', className: 'in-stock' };
  };

  const stockStatus = getStockStatus(selectedItem.stock);

  return (
    <div className="inventory-details">
      <div className="page-header">
        <h1>Inventory Item Details</h1>
        <div className="header-actions">
          <button onClick={handleBack} className="btn btn-secondary">
            ← Back
          </button>
          {canManage && (
            <>
              <button onClick={handleEdit} className="btn btn-primary">
                ✏️ Edit Item
              </button>
            </>
          )}
        </div>
      </div>

      <div className="details-card">
        <div className="details-header">
          <div className="item-icon">
            📦
          </div>
          <div className="item-title">
            <h2>{selectedItem.name}</h2>
            <div className="item-meta">
              <span className={`status-badge ${stockStatus.className}`}>
                {stockStatus.label}
              </span>
              <span className="category-badge">
                {selectedItem.category || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div className="details-section">
            <h3>📋 Product Information</h3>
            <div className="details-row">
              <span className="label">Item ID:</span>
              <span className="value">#{getItemId()}</span>
            </div>
            <div className="details-row">
              <span className="label">Name:</span>
              <span className="value">{selectedItem.name}</span>
            </div>
            <div className="details-row">
              <span className="label">Category:</span>
              <span className="value">
                <span className={`category-tag ${selectedItem.category?.toLowerCase()}`}>
                  {selectedItem.category || '-'}
                </span>
              </span>
            </div>
            <div className="details-row">
              <span className="label">Price:</span>
              <span className="value amount">${selectedItem.price?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="details-row">
              <span className="label">Stock Quantity:</span>
              <span className={`value stock-count ${selectedItem.stock > 10 ? 'high' : selectedItem.stock > 0 ? 'low' : 'zero'}`}>
                {selectedItem.stock || 0} units
              </span>
            </div>
          </div>

          <div className="details-section">
            <h3>🏢 Supplier Information</h3>
            <div className="details-row">
              <span className="label">Supplier:</span>
              <span className="value">{selectedItem.supplier || 'Not specified'}</span>
            </div>
            <div className="details-row">
              <span className="label">Description:</span>
              <span className="value description-text">
                {selectedItem.description || 'No description available'}
              </span>
            </div>
            <div className="details-row">
              <span className="label">Status:</span>
              <span className={`value status-badge ${stockStatus.className}`}>
                {stockStatus.label}
              </span>
            </div>
            <div className="details-row">
              <span className="label">Total Value:</span>
              <span className="value amount">
                ${((selectedItem.price || 0) * (selectedItem.stock || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="details-footer">
          <h3>📅 Timestamps</h3>
          <div className="details-row">
            <span className="label">Created At:</span>
            <span className="value">
              {selectedItem.createdAt
                ? new Date(selectedItem.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'}
            </span>
          </div>
          {selectedItem.updatedAt && (
            <div className="details-row">
              <span className="label">Last Updated:</span>
              <span className="value">
                {new Date(selectedItem.updatedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>
      </div>
      {canManage && (
        <div className="quick-actions-card">
          <h3>⚡ Quick Actions</h3>
          <div className="quick-actions-grid">
            <div className="quick-action-item">
              <h4>📦 Update Stock</h4>
              <div className="quick-action-buttons">
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => toast.info('Add stock feature coming soon')}
                >
                  + Add Stock
                </button>
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => toast.info('Remove stock feature coming soon')}
                >
                  - Remove Stock
                </button>
              </div>
            </div>
            <div className="quick-action-item">
              <h4>🏷️ Update Price</h4>
              <button 
                className="btn btn-info btn-sm"
                onClick={() => toast.info('Update price feature coming soon')}
              >
                Update Price
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Similar Items Card */}
      <div className="similar-items-card">
        <h3>🔄 Similar Items</h3>
        <div className="similar-items-placeholder">
          <p>No similar items found in this category.</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetails;