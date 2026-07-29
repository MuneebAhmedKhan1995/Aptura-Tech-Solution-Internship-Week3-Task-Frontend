import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { exportReport } from '../../redux/actions/reportActions';
import { toast } from 'react-toastify';

const ReportFilters = ({ onFilterChange, initialFilters = {} }) => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    reportType: 'sales',
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    department: '',
    format: 'pdf',
    ...initialFilters
  });

  const [exporting, setExporting] = useState(false);

  const handleChange = (e) => {
    const newFilters = {
      ...filters,
      [e.target.name]: e.target.value
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    const result = await dispatch(exportReport(
      filters.reportType,
      filters.format,
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
        department: filters.department
      }
    ));
    setExporting(false);
    
    if (result.success) {
      toast.success('Report exported successfully');
    } else {
      toast.error(result.error || 'Failed to export report');
    }
  };

  return (
    <div className="report-filters">
      <div className="filter-group">
        <label>Report Type</label>
        <select
          name="reportType"
          value={filters.reportType}
          onChange={handleChange}
          className="form-control"
        >
          <option value="sales">Sales Report</option>
          <option value="inventory">Inventory Report</option>
          <option value="employees">Employee Performance</option>
        </select>
      </div>

      {filters.reportType !== 'inventory' && (
        <>
          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </>
      )}

      {filters.reportType === 'employees' && (
        <div className="filter-group">
          <label>Department</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
      )}

      <div className="filter-group">
        <label>Export Format</label>
        <select
          name="format"
          value={filters.format}
          onChange={handleChange}
          className="form-control"
        >
          <option value="pdf">PDF</option>
          <option value="excel">Excel</option>
          <option value="csv">CSV</option>
        </select>
      </div>

      <button
        onClick={handleExport}
        className="btn btn-success"
        disabled={exporting}
      >
        {exporting ? 'Exporting...' : 'Export Report'}
      </button>
    </div>
  );
};

export default ReportFilters;