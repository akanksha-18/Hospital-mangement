import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appointment from "./component/Appointment";
import Login from "./component/Login";
import Register from "./component/Register";
import ManageAppointments from "./component/ManageAppointments";
import ProtectedRoute from "./component/ProtectedRoute";
import PatientAppointments from "./component/PatientAppointment";
import Navbar from "./component/Navbar";
import AdminDashboard from "./component/AdminDashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

        <Routes>
          <Route path="/appointment" element={<Appointment />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/manage-appointments" element={<ManageAppointments />} />
          <Route path="/my-appointments" element={<PatientAppointments />} />
          <Route path="/Admin-Dashboard" element={<AdminDashboard />} />
          <Route
            path="*"
            element={
              <img
                src="https://img.freepik.com/free-photo/3d-cartoon-style-character_23-2151034061.jpg"
                width="100%"
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
