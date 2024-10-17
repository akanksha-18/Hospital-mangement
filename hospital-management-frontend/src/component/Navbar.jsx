import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name);
        setUserRole(userData.role); 

        if (userData.role === 'patient' && isLoggedIn) {
          navigate('/appointment');
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    } else {
      setUserName('');
      setUserRole('');
    }
  }, [isLoggedIn]);

  const handleUserLogout = () => {
    handleLogout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
      <div className="flex items-center">
        <img src="https://img.freepik.com/premium-vector/hospital-logo-vector_1277164-14253.jpg" alt="Logo" className="h-10 w-10 mr-3" />
        <span className="text-xl font-bold">My Hospital</span>
      </div>
      <ul className="flex space-x-6">
        {userRole === 'patient' && (
          <>
            <li>
              <Link to="/appointment" className="hover:underline">Appointment</Link>
            </li>
            <li>
              <Link to="/my-appointments" className="hover:underline">My Appointments</Link>
            </li>
          </>
        )}
        {userRole === 'doctor' && (
          <>
            <li>
              <Link to="/manage-appointments" className="hover:underline">Manage Appointments</Link>
            </li>
          </>
        )}
        {userRole === 'super_admin' && (
          <>
            <li>
              <Link to="/appointment" className="hover:underline">Appointment</Link>
            </li>
            <li>
              <Link to="/my-appointments" className="hover:underline">My Appointments</Link>
            </li>
            <li>
              <Link to="/manage-appointments" className="hover:underline">Manage Appointments</Link>
            </li>
            <li>
              <Link to="/Admin-Dashboard" className="hover:underline">Admin Dashboard</Link>
            </li>
          </>
        )}
        {isLoggedIn ? (
          <li className="flex items-center  justify-between ">
            <span className="mr-2">{userName}</span>
            <button onClick={handleUserLogout} className="bg-red-500  text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200">
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
