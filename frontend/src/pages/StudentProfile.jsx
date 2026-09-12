import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Calendar, BookOpen, Plus } from 'lucide-react';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [showAttForm, setShowAttForm] = useState(false);
  const [attData, setAttData] = useState({ date: '', status: 'Present' });

  const [showGradeForm, setShowGradeForm] = useState(false);
  const [gradeData, setGradeData] = useState({ subject: '', marks: '', grade: 'A+' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, attRes, gradeRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/students/${id}`),
          axios.get(`http://localhost:5000/api/attendance/${id}`),
          axios.get(`http://localhost:5000/api/grades/${id}`)
        ]);
        setStudent(studentRes.data);
        setAttendance(attRes.data);
        setGrades(gradeRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/attendance', {
        studentId: id,
        ...attData
      });
      setAttendance([res.data, ...attendance]);
      setShowAttForm(false);
      setAttData({ date: '', status: 'Present' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/grades', {
        studentId: id,
        ...gradeData
      });
      setGrades([res.data, ...grades]);
      setShowGradeForm(false);
      setGradeData({ subject: '', marks: '', grade: 'A+' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading profile...</div>;
  if (!student) return <div className="text-center py-8 text-gray-500">Student not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card md:col-span-1 h-fit">
          <div className="text-center border-b border-gray-100 pb-6 mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 text-gray-400 mb-4">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
            <p className="text-gray-500 text-sm mt-1">{student.studentId}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Department</span>
              <span className="font-medium text-gray-900">{student.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{student.email}</span>
            </div>
          </div>
        </div>

        {/* Details Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Attendance Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                Attendance Record
              </h3>
              <button 
                onClick={() => setShowAttForm(!showAttForm)}
                className="btn-secondary text-sm py-1 px-3 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {showAttForm && (
              <form onSubmit={handleAddAttendance} className="bg-gray-50 p-4 rounded-md mb-4 flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" className="input-field py-1" required value={attData.date} max={new Date().toISOString().split('T')[0]} onChange={e => setAttData({...attData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select className="input-field py-1 bg-white" value={attData.status} onChange={e => setAttData({...attData, status: e.target.value})}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary py-1.5 text-sm">Save</button>
              </form>
            )}

            {attendance.length === 0 ? (
              <p className="text-gray-500 text-sm">No attendance records found.</p>
            ) : (
              <div className="space-y-2">
                {attendance.map(record => (
                  <div key={record._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border border-gray-100">
                    <span className="text-sm font-medium text-gray-900">{new Date(record.date).toLocaleDateString()}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' : 
                      record.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grades Section */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" />
                Academic Grades
              </h3>
              <button 
                onClick={() => setShowGradeForm(!showGradeForm)}
                className="btn-secondary text-sm py-1 px-3 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {showGradeForm && (
              <form onSubmit={handleAddGrade} className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" className="input-field py-1" required value={gradeData.subject} onChange={e => setGradeData({...gradeData, subject: e.target.value})} placeholder="e.g. Math" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Marks</label>
                  <input type="number" className="input-field py-1" required value={gradeData.marks} min="0" max="100" onChange={e => {
                    let val = e.target.value;
                    if (val !== "") {
                      val = parseInt(val, 10);
                      if (val < 0) val = 0;
                      if (val > 100) val = 100;
                    }
                    setGradeData({...gradeData, marks: val});
                  }} placeholder="0-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
                  <select className="input-field py-1 bg-white" required value={gradeData.grade} onChange={e => setGradeData({...gradeData, grade: e.target.value})}>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="F">F</option>
                  </select>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button type="submit" className="btn-primary py-1.5 text-sm w-full">Save</button>
                </div>
              </form>
            )}

            {grades.length === 0 ? (
              <p className="text-gray-500 text-sm">No grades recorded yet.</p>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-3 font-medium text-gray-500">Subject</th>
                      <th className="p-3 font-medium text-gray-500">Marks</th>
                      <th className="p-3 font-medium text-gray-500">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map(g => (
                      <tr key={g._id} className="border-b border-gray-100 last:border-0">
                        <td className="p-3 font-medium text-gray-900">{g.subject}</td>
                        <td className="p-3 text-gray-600">{g.marks}</td>
                        <td className="p-3 text-gray-900 font-semibold">{g.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
