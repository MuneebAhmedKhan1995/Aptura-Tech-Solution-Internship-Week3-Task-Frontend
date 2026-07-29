import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className="sidebar-link">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className="sidebar-link">
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/inventory" className="sidebar-link">
            Inventory
          </NavLink>
        </li>
        <li>
          <NavLink to="/sales" className="sidebar-link">
            Sales
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className="sidebar-link">
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/logs" className="sidebar-link">
            Activity Logs
          </NavLink>
        </li>
        {(role === 'admin' || role === 'manager') && (
          <li className="sidebar-submenu">
            <span className="sidebar-label">Admin</span>
            <ul>
              <li>
                <NavLink to="/admin/roles" className="sidebar-link">
                  Roles
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className="sidebar-link">
                  Users
                </NavLink>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;