import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Appointment() {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [symptoms, setSymptoms] = useState(''); 
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/users?role=doctor');
        if (res.data.length === 0) {
          setError('No doctors found');
        } else {
          setDoctors(res.data);
        }
      } catch (err) {
        console.error('Error fetching doctors', err);
        setError('Error fetching doctors. Please try again later.');
      }
    };

    fetchDoctors();
  }, []);

  const bookAppointment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setError('You need to log in to book an appointment.');
      return;
    }

    if (!doctorId || !selectedDate || !symptoms) { 
      setError('Please select a doctor, a valid date/time, and enter your symptoms before booking.');
      return;
    }

    try {
      const utcDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
      const response = await axios.post('http://localhost:4000/api/appointments/book', {
        doctorId: doctorId,
        slot: utcDate.toISOString(),
        symptoms: symptoms 
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Appointment booked successfully!');
      setError('');
      setDoctorId('');
      setSelectedDate(null);
      setSymptoms('');
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred while booking the appointment.');
      setMessage('');
    }
  };

  const filterTime = (time) => {
    const hour = time.getHours();
    return hour >= 9 && hour <= 17; 
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <form onSubmit={bookAppointment} className=" bg-gray-100 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Book Appointment</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
        {doctors.length > 0 ? (
          <>
            <label htmlFor="doctor" className="block mb-2 font-medium text-gray-700">Select Doctor:</label>
            <select
              id="doctor"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            
            <label htmlFor="date" className="block mb-2 font-medium text-gray-700">Select Date and Time:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select Date and Time"
              className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              minDate={new Date()}
              // filterTime={(time) => {
              //   const currentDate = new Date();
              //   const selectedDate = new Date(time);
              //   return currentDate.getTime() < selectedDate.getTime();
              // }}
              filterTime={filterTime}
            />
            
            <label htmlFor="symptoms" className="block mb-2 font-medium text-gray-700">Describe your symptoms:</label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms"
              className="border border-gray-300 p-2 w-full mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600 transition-colors">
              Book Appointment
            </button>
          </>
        ) : (
          <p className="text-center">No doctors available at the moment.</p>
        )}
      </form>
    </div>
  );
}

export default Appointment;
