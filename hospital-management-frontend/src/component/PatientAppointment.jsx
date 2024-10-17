import { useState, useEffect } from 'react';
import axios from 'axios';

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchAppointments = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('http://localhost:4000/api/appointments/patient', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res.data); 
            setAppointments(res.data);
        } catch (err) {
            console.error('Error fetching appointments', err);
            if (err.response && err.response.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else {
                setError('Error fetching appointments. Please try again later.');
            }
        }
    };

    fetchAppointments();
}, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'UTC'  
    };
    return date.toLocaleString('en-US', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {appointments.length > 0 ? (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="bg-white shadow-md rounded-lg p-4">
              <p><strong>Doctor:</strong> {appointment.doctor ? appointment.doctor.name : 'N/A'}</p>
              <p><strong>Specialization:</strong> {appointment.doctor ? appointment.doctor.specialization : 'N/A'}</p>
              <p><strong>Date and Time:</strong> {formatDate(appointment.date)}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`font-bold ${getStatusColor(appointment.status)}`}>
                  {' '}{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </p>
              <p><strong>Symptoms:</strong> {appointment.symptoms || 'N/A'}</p> {/* Display symptoms */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No appointments found.</p>
      )}
    </div>
  );
}

export default PatientAppointments;
