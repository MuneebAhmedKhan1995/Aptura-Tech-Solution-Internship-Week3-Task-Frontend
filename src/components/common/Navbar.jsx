import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());
    if (result.success) {
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>ERP System</h2>
      </div>
      <div className="navbar-right">
        <span className="user-info">
          {user?.name} ({user?.role})
        </span>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;