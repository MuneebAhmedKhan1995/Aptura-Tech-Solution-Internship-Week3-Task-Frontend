import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployees } from '../../redux/actions/employeeActions';
import { getInventory } from '../../redux/actions/inventoryActions';
import { getSales } from '../../redux/actions/salesActions';
import { getSalesReport } from '../../redux/actions/reportActions';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { employees, total: employeeTotal } = useSelector((state) => state.employees);
  const { items: inventory, total: inventoryTotal } = useSelector((state) => state.inventory);
  const { sales, total: salesTotal } = useSelector((state) => state.sales);
  const { salesReport } = useSelector((state) => state.reports);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStock: 0
  });

  useEffect(() => {
    dispatch(getEmployees());
    dispatch(getInventory());
    dispatch(getSales());
    dispatch(getSalesReport({ period: 'month' }));
  }, [dispatch]);

  useEffect(() => {
    if (employees.length && inventory.length && sales.length) {
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const lowStock = inventory.filter(item => item.stock < 10).length;
      
      setStats({
        totalEmployees: employeeTotal || employees.length,
        totalProducts: inventoryTotal || inventory.length,
        totalSales: salesTotal || sales.length,
        totalRevenue,
        lowStock
      });
    }
  }, [employees, inventory, sales, employeeTotal, inventoryTotal, salesTotal]);

  const barData = {
    labels: salesReport?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: salesReport?.data || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [
          inventory.filter(item => item.stock > 20).length,
          inventory.filter(item => item.stock > 0 && item.stock <= 20).length,
          inventory.filter(item => item.stock === 0).length,
        ],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 1,
      },
    ],
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


  const getSaleId = (sale) => {
    return sale?._id || sale?.id || 'N/A';
  };

  
  const getSaleDate = (sale) => {
    return sale?.saleDate || sale?.createdAt;
  };


  const sortedSales = [...sales].sort((a, b) => {
    const dateA = new Date(getSaleDate(a) || 0);
    const dateB = new Date(getSaleDate(b) || 0);
    return dateB - dateA;
  });

  const recentSales = sortedSales.slice(0, 5);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Employees</h3>
          <p className="stat-number">{stats.totalEmployees}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-number">{stats.totalSales}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card warning">
          <h3>Low Stock Alert</h3>
          <p className="stat-number">{stats.lowStock}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Sales</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>Inventory Status</h3>
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Sales</h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.length > 0 ? (
              recentSales.map((sale, index) => (
                <tr key={getSaleId(sale) || index}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="invoice-badge">
                      {sale.invoiceNumber || 'N/A'}
                    </span>
                  </td>
                  <td>{getProductName(sale)}</td>
                  <td>{getTotalQuantity(sale)}</td>
                  <td className="amount">${(sale.total || 0).toFixed(2)}</td>
                  <td>
                    {getSaleDate(sale) 
                      ? new Date(getSaleDate(sale)).toLocaleDateString() 
                      : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;