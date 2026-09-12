import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const StudentForm = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: 'Computer Science'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business', 'Arts'];

  useEffect(() => {
    if (isEdit) {
      const fetchStudent = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/students/${id}`);
          setFormData({
            studentId: res.data.studentId,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            department: res.data.department
          });
        } catch (err) {
          console.error(err);
          alert('Failed to fetch student data');
          navigate('/');
        }
      };
      fetchStudent();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/api/students/${id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/students', formData);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Student' : 'Add New Student'}</h1>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input 
                type="text" 
                name="firstName"
                className="input-field" 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input 
                type="text" 
                name="lastName"
                className="input-field" 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
            <input 
              type="text" 
              name="studentId"
              className="input-field" 
              value={formData.studentId}
              onChange={handleChange}
              disabled={isEdit} // Cannot change ID after creation usually
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              name="department"
              className="input-field bg-white"
              value={formData.department}
              onChange={handleChange}
              required
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <Link to="/" className="btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Save Student')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
