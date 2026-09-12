import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Plus, User, Edit2, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let query = 'http://localhost:5000/api/students?';
      if (search) query += `search=${search}&`;
      if (department) query += `department=${department}`;
      
      const res = await axios.get(query);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student and all their records?')) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        setStudents(students.filter(s => s._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete student');
      }
    }
  };

  const departments = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business', 'Arts'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        <Link to="/students/new" className="btn-primary inline-flex items-center gap-2 w-fit">
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="input-field pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              className="input-field appearance-none bg-white"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No students found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200 text-sm font-medium text-gray-500">
                  <th className="pb-3 pr-4">Student ID</th>
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 pr-4 font-medium text-gray-900">{student.studentId}</td>
                    <td className="py-4 pr-4">
                      <Link to={`/students/${student._id}`} className="hover:underline text-gray-900">
                        {student.firstName} {student.lastName}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 text-gray-600">{student.department}</td>
                    <td className="py-4 pr-4 text-gray-600">{student.email}</td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/students/edit/${student._id}`} className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(student._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
