import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students:', err);
      alert('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete "${studentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(studentId);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Student deleted successfully!');
      loadStudents(); // Refresh list
    } catch (err) {
      console.error('Delete student error:', err);
      alert('Failed to delete student: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Students</h1>
      
      <div className="card">
        <div className="card-header">
          <h5>Total Students: {students.length}</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p className="text-muted">No students found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.name || 'N/A'}</td>
                      <td>{student.email}</td>
                      <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteStudent(student._id, student.name || student.email)}
                          disabled={deletingId === student._id}
                        >
                          {deletingId === student._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}