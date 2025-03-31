import React, { useState, useEffect, useContext } from 'react';
import './ConsultationRequest.css';
import Navbar from '../HomePage/NavBar/NavBar';
import Footer from '../HomePage/Footer/Footer'; 
import { AuthContext } from '../LoginPage/AuthContext';
import { FaChild, FaCalendarAlt, FaFileAlt, FaExclamationCircle, FaTag } from 'react-icons/fa'; // Importing icons from react-icons

const ConsultationRequest = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [children, setChildren] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('userId') || 0,
    childId: '',
    description: '',
    urgency: 'Normal',
    category: ''
  });

  useEffect(() => {
    const fetchConsultationRequests = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in local storage');

        const response = await fetch('/api/ConsultationRequest/get-all');
        if (!response.ok) throw new Error(`Failed to fetch consultation requests: ${response.status}`);
        
        const data = await response.json();
        if (!data || !data.data || !Array.isArray(data.data.$values)) {
          throw new Error('Unexpected data format from API');
        }

        const requestsArray = data.data.$values;
        let userRequests = requestsArray;
        if (requestsArray.some(request => request.userId !== null)) {
          userRequests = requestsArray.filter(request => request.userId === parseInt(userId));
        }

        const requestsWithChildName = await Promise.all(
          userRequests.map(async (request) => {
            try {
              const childResponse = await fetch(`/api/Child/${request.childId}`);
              const childData = await childResponse.json();
              if (!childResponse.ok) throw new Error(`Failed to fetch child ${request.childId}`);
              return {
                ...request,
                childName: childData.data?.name || childData.data?.childName || 'Unknown'
              };
            } catch (childError) {
              console.error(`Error fetching child ${request.childId}:`, childError);
              return { ...request, childName: 'Error loading name' };
            }
          })
        );

        setRequests(requestsWithChildName);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchChildren = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in local storage');

        const response = await fetch('/api/Child/get-all');
        const data = await response.json();
        if (data && data.data && Array.isArray(data.data.$values)) {
          const userChildren = data.data.$values.filter(child => 
            child.userId === parseInt(userId)
          );
          setChildren(userChildren);
          console.log('Filtered Children:', userChildren);
        }
      } catch (err) {
        console.error('Error fetching children:', err);
      }
    };

    fetchConsultationRequests();
    fetchChildren();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ConsultationRequest/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: parseInt(formData.userId),
          childId: parseInt(formData.childId)
        })
      });
      if (!response.ok) throw new Error('Failed to create consultation request');
      
      const newRequest = await response.json();
      setRequests(prev => [...prev, { 
        ...newRequest.data, 
        childName: children.find(c => c.childId === parseInt(formData.childId))?.name || 'Unknown' 
      }]);
      setIsModalOpen(false);
      setFormData({
        userId: localStorage.getItem('userId') || 0,
        childId: '',
        description: '',
        urgency: 'Normal',
        category: ''
      });
    } catch (err) {
      console.error('Error creating request:', err);
      alert('Failed to create request');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="cr-container">
        <button className="cr-create-btn" onClick={() => setIsModalOpen(true)}>
          <span className="cr-plus-icon">+</span> Create Consultation Request
        </button>

        {isModalOpen && (
          <div className="cr-modal">
            <div className="cr-modal-content">
              <h3>Create Consultation Request</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Child:
                  <select name="childId" value={formData.childId} onChange={handleChange} required>
                    <option value="">-- Select a child --</option>
                    {children.map((child) => (
                      <option key={child.childId} value={child.childId}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Description:
                  <textarea name="description" value={formData.description} onChange={handleChange} required />
                </label>

                <label>
                  Urgency:
                  <select name="urgency" value={formData.urgency} onChange={handleChange}>
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>

                <label>
                  Category:
                  <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                </label>

                <div className="cr-modal-buttons">
                  <button type="submit" className="cr-submit-btn">Submit</button>
                  <button type="button" className="cr-cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <h2>Consultation Requests</h2>
        {requests.length === 0 && <p>No consultation requests found.</p>}
        <div className="cr-table-container">
          <table className="cr-table">
            <thead>
              <tr>
                <th>No</th>
                <th><FaChild /> Child Name</th>
                <th><FaCalendarAlt /> Request Date</th>
                <th><FaFileAlt /> Description</th>
                <th><FaExclamationCircle /> Urgency</th>
                <th><FaTag /> Category</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.requestId || index}>
                  <td>{index + 1}</td>
                  <td><FaChild className="row-icon" /> {request.childName}</td>
                  <td><FaCalendarAlt className="row-icon" /> {new Date(request.requestDate).toLocaleString()}</td>
                  <td><FaFileAlt className="row-icon" /> {request.description || 'N/A'}</td>
                  <td><FaExclamationCircle className="row-icon" /> {request.urgency || 'N/A'}</td>
                  <td><FaTag className="row-icon" /> {request.category || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConsultationRequest;