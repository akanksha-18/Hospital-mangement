import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]); 
    const [patients, setPatients] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorSpecialization, setDoctorSpecialization] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [doctorPassword, setDoctorPassword] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientPassword, setPatientPassword] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        // const token = localStorage.getItem('token');
        const role = localStorage.getItem('role'); 

      
        if (role !== 'super_admin') {
            alert('Access denied. Only super admins can access this page.');
            navigate('/'); 
        } else {
            fetchData();
        }
    }, [navigate]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const doctorResponse = await axios.get('http://localhost:4000/api/superadmin/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(doctorResponse.data);

            const patientResponse = await axios.get('http://localhost:4000/api/superadmin/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(patientResponse.data);
        } catch (err) {
            alert('Error fetching data: ' + (err.response?.data?.error || err.message));
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const addDoctor = async () => {
        const token = localStorage.getItem('token');
        if (!doctorName || !doctorEmail || !doctorPassword || !doctorSpecialization) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateEmail(doctorEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/superadmin/doctors', 
                { 
                    name: doctorName, 
                    specialization: doctorSpecialization, 
                    email: doctorEmail,
                    password: doctorPassword
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDoctors([...doctors, response.data.doctor]);
            setDoctorName('');
            setDoctorSpecialization('');
            setDoctorEmail('');
            setDoctorPassword('');
        } catch (err) {
            alert('Error adding doctor: ' + (err.response?.data?.error || err.message));
        }
    };

    const addPatient = async () => {
        const token = localStorage.getItem('token');
        if (!patientName || !patientEmail || !patientPassword) {
            alert('Please fill in all fields.');
            return;
        }
        if (!validateEmail(patientEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/superadmin/patients', 
                { 
                    name: patientName,
                    email: patientEmail,
                    password: patientPassword
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPatients([...patients, response.data.patient]);
            setPatientName('');
            setPatientEmail('');
            setPatientPassword('');
        } catch (err) {
            alert('Error adding patient: ' + (err.response?.data?.error || err.message));
        }
    };

    const deleteDoctor = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:4000/api/superadmin/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(doctors.filter(doctor => doctor._id !== id));
        } catch (err) {
            alert('Error deleting doctor: ' + (err.response?.data?.error || err.message));
        }
    };

    const deletePatient = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:4000/api/superadmin/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(patients.filter(patient => patient._id !== id));
        } catch (err) {
            alert('Error deleting patient: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Add Doctor</h2>
                <div className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Doctor's Name" 
                        value={doctorName} 
                        onChange={e => setDoctorName(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="text" 
                        placeholder="Specialization" 
                        value={doctorSpecialization} 
                        onChange={e => setDoctorSpecialization(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={doctorEmail} 
                        onChange={e => setDoctorEmail(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={doctorPassword} 
                        onChange={e => setDoctorPassword(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <button 
                        onClick={addDoctor} 
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Add Doctor
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Doctors</h2>
            <ul className="list-disc list-inside mb-6">
                {doctors.map(doctor => (
                    <li key={doctor._id} className="flex justify-between items-center mb-2">
                        <span>{doctor.name} - {doctor.specialization}</span>
                        <button onClick={() => deleteDoctor(doctor._id)} className="text-red-500 hover:text-red-600">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Add Patient</h2>
                <div className="flex flex-col space-y-4">
                    <input 
                        type="text" 
                        placeholder="Patient's Name" 
                        value={patientName} 
                        onChange={e => setPatientName(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={patientEmail} 
                        onChange={e => setPatientEmail(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={patientPassword} 
                        onChange={e => setPatientPassword(e.target.value)} 
                        className="border rounded p-2"
                    />
                    <button 
                        onClick={addPatient} 
                        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Add Patient
                    </button>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Patients</h2>
            <ul className="list-disc list-inside">
                {patients.map(patient => (
                    <li key={patient._id} className="flex justify-between items-center mb-2">
                        <span>{patient.name}</span>
                        <button onClick={() => deletePatient(patient._id)} className="text-red-500 hover:text-red-600">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;
