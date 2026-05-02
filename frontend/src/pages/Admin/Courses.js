import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Courses() {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load courses on mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to load courses:', err);
      alert('Failed to load courses');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseData = {
      title: formData.get('title'),
      totalQuestions: parseInt(formData.get('totalQuestions')),
      totalMarks: parseInt(formData.get('totalMarks'))
    };

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/courses', courseData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Course created successfully!');
      setShowForm(false);
      loadCourses(); // Refresh list
    } catch (err) {
      console.error('Create course error:', err);
      alert('Failed to create course: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  // Add this inside the Courses component
const handleDeleteCourse = async (courseId, courseName) => {
  if (!window.confirm(`Are you sure you want to delete "${courseName}"? This action cannot be undone.`)) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert('Course deleted successfully!');
    loadCourses(); // Refresh the list
  } catch (err) {
    console.error('Delete course error:', err);
    alert('Failed to delete course: ' + (err.response?.data?.error || 'Unknown error'));
  }
};

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Courses</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {/* Add Course Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5>Add New Course</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateCourse}>
              <div className="mb-3">
                <label className="form-label">Course Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="title" 
                  required 
                />
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Total Questions *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="totalQuestions" 
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Total Marks *</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      name="totalMarks" 
                      min="1"
                      required 
                    />
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Courses List */}
      <div className="card">
        <div className="card-header">
          <h5>Existing Courses ({courses.length})</h5>
        </div>
        <div className="card-body">
          {courses.length === 0 ? (
            <p className="text-muted">No courses found. Click "Add Course" to create one.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Questions</th>
                    <th>Total Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course._id}>
                      <td>{course.title}</td>
                      <td>{course.totalQuestions}</td>
                      <td>{course.totalMarks}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                        >
                          Delete
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