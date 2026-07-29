import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getSalesReport, 
  getInventoryReport,
  exportReport 
} from '../../redux/actions/reportActions';
import { Bar, Pie } from 'react-chartjs-2';
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
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportDashboard = () => {
  const dispatch = useDispatch();
  const { salesReport, inventoryReport, loading, exporting } = useSelector(
    (state) => state.reports
  );
  const { user } = useSelector((state) => state.auth);
  
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [exportFormat, setExportFormat] = useState('csv');

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      fetchReports();
    }
  }, [dispatch, reportType, dateRange, user]);

  const fetchReports = () => {
    if (reportType === 'sales') {
      dispatch(getSalesReport(dateRange));
    } else if (reportType === 'inventory') {
      dispatch(getInventoryReport());
    }
  };

  const handleExport = async () => {
    const result = await dispatch(exportReport(reportType, exportFormat, dateRange));
    if (result.success) {
      toast.success('Report exported successfully');
    } else {
      toast.error(result.error || 'Failed to export report');
    }
  };

  const salesChartData = {
    labels: salesReport?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales Revenue ($)',
        data: salesReport?.data || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Orders Count',
        data: salesReport?.counts || [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 4,
      }
    ],
  };

  const inventoryChartData = {
    labels: inventoryReport?.categories || ['Electronics', 'Furniture', 'Clothing', 'Food'],
    datasets: [
      {
        label: 'Stock Count',
        data: inventoryReport?.counts || [0, 0, 0, 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  if (user?.role === 'employee') {
    return <div className="access-denied">Access Denied</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          padding: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 12 },
          padding: 15
        }
      }
    }
  };

  return (
    <div className="report-dashboard">
      <h1>Reports Dashboard</h1>

      <div className="report-filters">
        <div className="filter-group">
          <label>Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-control"
          >
            <option value="sales">📊 Sales Report</option>
            <option value="inventory">📦 Inventory Report</option>
          </select>
        </div>

        {reportType !== 'inventory' && (
          <>
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="form-control"
              />
            </div>
          </>
        )}

        <div className="filter-group">
          <label>Export Format</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="form-control"
          >
            <option value="csv">📋 CSV</option>
          </select>
        </div>

        <button onClick={handleExport} className="btn btn-success" disabled={exporting}>
          {exporting ? '⏳ Exporting...' : '📥 Export Report'}
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading reports...</div>
      ) : (
        <div className="report-content">
          {reportType === 'sales' && salesReport && (
            <div className="report-card">
              <h3>📊 Sales Overview</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span>Total Revenue</span>
                  <strong>${(salesReport.totalRevenue || 0).toFixed(2)}</strong>
                </div>
                <div className="stat-item">
                  <span>Total Orders</span>
                  <strong>{salesReport.totalOrders || 0}</strong>
                </div>
                <div className="stat-item">
                  <span>Average Order Value</span>
                  <strong>${(salesReport.averageOrder || 0).toFixed(2)}</strong>
                </div>
              </div>
              <div className="chart-container">
                <Bar data={salesChartData} options={chartOptions} />
              </div>
            </div>
          )}

     
          {reportType === 'inventory' && inventoryReport && (
            <div className="report-card">
              <h3>📦 Inventory Overview</h3>
              <div className="report-stats">
                <div className="stat-item">
                  <span>Total Items</span>
                  <strong>{inventoryReport.totalItems || 0}</strong>
                </div>
                <div className="stat-item">
                  <span>Total Value</span>
                  <strong>${(inventoryReport.totalValue || 0).toFixed(2)}</strong>
                </div>
                <div className="stat-item">
                  <span>Low Stock Items</span>
                  <strong>{inventoryReport.lowStock || 0}</strong>
                </div>
                <div className="stat-item">
                  <span>Out of Stock</span>
                  <strong>{inventoryReport.outOfStock || 0}</strong>
                </div>
              </div>
              <div className="chart-container">
                <Pie data={inventoryChartData} options={pieOptions} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportDashboard;