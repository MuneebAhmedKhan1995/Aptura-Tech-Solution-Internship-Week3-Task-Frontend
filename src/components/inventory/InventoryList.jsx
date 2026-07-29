import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInventory, deleteInventoryItem } from '../../redux/actions/inventoryActions';
import { toast } from 'react-toastify';

const InventoryList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.inventory);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  useEffect(() => {
    dispatch(getInventory());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const result = await dispatch(deleteInventoryItem(id));
      if (result.success) {
        toast.success('Item deleted successfully');
        dispatch(getInventory());
      } else {
        toast.error(result.error || 'Failed to delete item');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.category === category;
    const matchesStock = !stockFilter || 
                         (stockFilter === 'low' && item.stock > 0 && item.stock <= 10) ||
                         (stockFilter === 'out' && item.stock === 0) ||
                         (stockFilter === 'in' && item.stock > 10);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.createdAt || a._id?.getTimestamp?.() || 0);
    const dateB = new Date(b.createdAt || b._id?.getTimestamp?.() || 0);
    return dateB - dateA;
  });


  const canViewInventory = user?.permissions?.includes('view_inventory') || user?.role === 'admin';
  const canManageInventory = user?.permissions?.includes('manage_inventory') || user?.role === 'admin';

  const getId = (item) => item._id || item.id;

  return (
    <div className="inventory-list">
      <div className="page-header">
        <h1>Inventory</h1>
        {canManageInventory && (
          <Link to="/inventory/add" className="btn btn-primary">
            + Add Item
          </Link>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="form-control"
        >
          <option value="">All Stock</option>
          <option value="in">In Stock (&gt;10)</option>
          <option value="low">Low Stock (1-10)</option>
          <option value="out">Out of Stock</option>
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
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems && sortedItems.length > 0 ? (
              sortedItems.map((item, index) => {
                const itemId = getId(item);
                return (
                  <tr key={itemId}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>${item.price?.toFixed(2) || '0.00'}</td>
                    <td>{item.stock}</td>
                    <td>{item.supplier || '-'}</td>
                    <td>
                      <span className={`status-badge ${item.stock > 10 ? 'in-stock' : item.stock > 0 ? 'low-stock' : 'out-of-stock'}`}>
                        {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/inventory/${itemId}`} className="btn btn-sm btn-info">
                        View
                      </Link>
                      {canManageInventory && (
                        <>
                          <Link to={`/inventory/edit/${itemId}`} className="btn btn-sm btn-warning">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(itemId)} className="btn btn-sm btn-danger">
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
                  No inventory items found. Add your first item!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryList;