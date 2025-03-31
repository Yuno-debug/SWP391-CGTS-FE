import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ConsultationRequests.css';
import { useNavigate } from 'react-router-dom';

const ConsultationRequests = (response) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChildrenLoaded, setIsChildrenLoaded] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState(null);

  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedRequestForResponse, setSelectedRequestForResponse] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [responseStatus, setResponseStatus] = useState('Active');
  const [diagnosis, setDiagnosis] = useState('');

  const [isViewResponseModalOpen, setIsViewResponseModalOpen] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [selectedRequestResponses, setSelectedRequestResponses] = useState([]);
  const [viewResponseLoading, setViewResponseLoading] = useState(false);

  const detailsModalRef = useRef(null);
  const responseModalRef = useRef(null);
  const viewResponseModalRef = useRef(null);
  const [doctorName, setDoctorName] = useState("Loading...");

  const navigate = useNavigate();

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:5200/api/Child/get-all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        setChildren(response.data.data.$values);
        setIsChildrenLoaded(true);
      } else {
        console.error("Unexpected children response format:", response.data);
        setError("Failed to load children: Invalid response format.");
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setError(`Failed to fetch children: ${error.message}`);
    }
  };
  useEffect(() => {
    if (response?.doctorId) {
      axios
        .get(`/api/Doctor/${response.doctorId}`)
        .then((res) => {
          if (res.data && res.data.name) {
            setDoctorName(res.data.name); // Set doctor name if it exists
          } else {
            setDoctorName("Doctor Name Not Found"); // Handle case if name is not found
          }
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
          setDoctorName("N/A"); // Default fallback
        });
    } else {
      setDoctorName("N/A"); // Fallback if doctorId is missing
    }
  }, [response?.doctorId]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
      });

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const requestsWithTimestamps = response.data.data.$values.map(req => ({
          ...req,
          childId: req.childId,
          requestDate: req.requestDate || new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }));
        setRequests(requestsWithTimestamps);
        setFilteredRequests(requestsWithTimestamps);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Invalid response format.");
      }
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      setError(`Failed to load requests: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllResponses = async () => {
    setViewResponseLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:5200/api/ConsultationResponse/get-all',
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
        }
      );
      
      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        setAllResponses(response.data.data.$values);
      } else {
        setAllResponses([]);
      }
    } catch (error) {
      console.error('Error fetching all responses:', error);
      setError(`Failed to fetch responses: ${error.message}`);
      setAllResponses([]);
    } finally {
      setViewResponseLoading(false);
    }
  };

  const handleViewResponse = (requestId) => {
    const filteredResponses = allResponses.filter(response => response.requestId === requestId);
    setSelectedRequestResponses(filteredResponses);
    setIsViewResponseModalOpen(true);
  };

  const closeViewResponseModal = () => {
    setIsViewResponseModalOpen(false);
    setSelectedRequestResponses([]);
  };

  const handleNavigateToGrowthData = () => {
    if (selectedChildId) {
      navigate(`/growth-data/${selectedChildId}`);
    } else {
      alert("Please select a child to view their growth data.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchChildren();
      await fetchRequests();
      await fetchAllResponses();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      const filtered = requests.filter(request => request.childId === parseInt(selectedChildId));
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
    setCurrentPage(1);
  }, [selectedChildId, requests]);

  const childrenWithRequests = children.filter(child =>
    requests.some(request => request.childId === child.childId)
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleChildSelect = (childId) => {
    setSelectedChildId(childId);
  };

  const handleBack = () => {
    setSelectedChildId(null);
  };

  const openDetailsModal = (request) => {
    setSelectedDetailsRequest(request);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDetailsRequest(null);
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5200/api/ConsultationRequest/delete/${requestId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      setError("Failed to delete request.");
    }
  };

  const handleNavigateToResponse = (requestId) => {
    navigate('/consultation-response');
  };

  const openResponseModal = (request) => {
    setSelectedRequestForResponse(request);
    setResponseContent('');
    setResponseStatus('Active');
    setDiagnosis('');
    setIsResponseModalOpen(true);
  };

  const closeResponseModal = () => {
    setIsResponseModalOpen(false);
    setSelectedRequestForResponse(null);
    setResponseContent('');
    setResponseStatus('Active');
    setDiagnosis('');
  };

  const handleCreateResponse = (request) => {
    openResponseModal(request);
  };

  const handleSubmitResponse = async () => {
  if (!responseContent || responseContent === '<p><br></p>') {
    alert("Please enter a response.");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    setError("No authorization token found.");
    return;
  }

  if (!selectedRequestForResponse.doctorId) {
    setError("Doctor ID is required.");
    return;
  }

  const payload = {
    requestId: selectedRequestForResponse.requestId,
    doctorId: selectedRequestForResponse.doctorId,  // Ensure doctorId is valid
    content: responseContent,
    attachments: "",  // Add file attachments if necessary
    diagnosis: diagnosis || "",
  };

  try {
    await axios.post(
      'http://localhost:5200/api/ConsultationResponse/create',
      payload,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    await fetchRequests();
    await fetchAllResponses();
    closeResponseModal();
  } catch (error) {
    console.error('Error submitting consultation response:', error);
    setError('Failed to submit response. Please try again.');
  }
};

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isDetailsModalOpen) closeDetailsModal();
        if (isResponseModalOpen) closeResponseModal();
        if (isViewResponseModalOpen) closeViewResponseModal();
      }
    };

    const handleOutsideClick = (e) => {
      if (detailsModalRef.current && !detailsModalRef.current.contains(e.target)) {
        closeDetailsModal();
      }
      if (responseModalRef.current && !responseModalRef.current.contains(e.target)) {
        closeResponseModal();
      }
      if (viewResponseModalRef.current && !viewResponseModalRef.current.contains(e.target)) {
        closeViewResponseModal();
      }
    };

    if (isDetailsModalOpen || isResponseModalOpen || isViewResponseModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isDetailsModalOpen, isResponseModalOpen, isViewResponseModalOpen]);

  const totalRequests = requests.length;
  const activeRequests = requests.filter(r => r.status === 'Active').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const inactiveRequests = requests.filter(r => r.status === 'Inactive').length;

  const recentRequests = requests.slice(0, 3);

  const getAvatarUrl = (child) => {
    return child.allergies || "https://placehold.co/50x50?text=No+Image";
  };

  const getRelationshipLabel = (relationship) => {
    return relationship === "D" ? "Dad" : relationship === "M" ? "Mom" : relationship;
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'bullet', 'indent',
    'color', 'background', 'link'
  ];

  if (!isChildrenLoaded || loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading data...</p>
    </div>
  );
  if (error) return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={fetchRequests} className="retry-button">Retry</button>
    </div>
  );

  return (
    <div className="consultation-requests-container">
      <div className="page-header">
        <div className="header-left">
          <h2>Consultation Requests Dashboard</h2>
          <p>Select a child to view their consultation requests and create responses.</p>
        </div>
        <div className="header-right">
          <button className="refresh-button" onClick={fetchRequests}>Refresh</button>
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-card">
          <h4>Total Requests</h4>
          <div className="summary-value">{totalRequests}</div>
        </div>
        <div className="summary-card">
          <h4>Active Requests</h4>
          <div className="summary-value">{activeRequests}</div>
        </div>
        <div className="summary-card">
          <h4>Pending Requests</h4>
          <div className="summary-value">{pendingRequests}</div>
        </div>
        <div className="summary-card">
          <h4>Inactive Requests</h4>
          <div className="summary-value">{inactiveRequests}</div>
        </div>
      </div>

      <div className="children-section">
        <h3 className="children-requests-title"> Children's Request List</h3>
        <div className="addchild-child-list">
          {selectedChildId ? (
            children.filter(child => child.childId === selectedChildId).map((child) => (
              <div
                key={child.childId}
                className="addchild-child-card addchild-child-card-selected"
              >
                <div className="addchild-child-card-content">
                  <img
                    src={getAvatarUrl(child)}
                    alt={`${child.name}'s Avatar`}
                    className="addchild-child-card-avatar"
                    onError={(e) => (e.target.src = "https://placehold.co/50x50?text=No+Image")}
                  />
                  <div className="addchild-child-card-name">{child.name}</div>
                  <div className="addchild-child-card-details">
                    <p>DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                    <p>Gender: {child.gender}</p>
                    <p>Weight: {child.birthWeight} kg</p>
                    <p>Height: {child.birthHeight} cm</p>
                    <p>Blood: {child.bloodType || "N/A"}</p>
                    <p>Rel: {getRelationshipLabel(child.relationship)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            childrenWithRequests.length > 0 ? (
              childrenWithRequests.map((child) => (
                <div
                  key={child.childId}
                  className="addchild-child-card"
                  onClick={() => handleChildSelect(child.childId)}
                >
                  <div className="addchild-child-card-content">
                    <img
                      src={getAvatarUrl(child)}
                      alt={`${child.name}'s Avatar`}
                      className="addchild-child-card-avatar"
                      onError={(e) => (e.target.src = "https://placehold.co/50x50?text=No+Image")}
                    />
                    <div className="addchild-child-card-name">{child.name}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="addchild-empty-state">
                <img
                  src="https://via.placeholder.com/300?text=No+Children"
                  alt="No children"
                  className="addchild-empty-illustration"
                />
                <p>No children with requests available.</p>
              </div>
            )
          )}
        </div>
      </div>

      {selectedChildId && (
        <div className="requests-section">
          <div className="table-header">
            <button className="back-button" onClick={handleBack}>Back</button>
            <h3>Requests for {children.find(c => c.childId === selectedChildId)?.name}</h3>
          </div>
          <div className="table-section">
            <table className="consultation-requests-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>CHILD</th>
                  <th>DESCRIPTION</th>
                  <th>REQUEST DATE</th>
                  <th>STATUS</th>
                  <th>LAST UPDATED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((request, index) => {
                    const child = children.find(c => c.childId === request.childId);
                    const childName = child ? child.name : 'Unknown Child';
                    return (
                      <tr key={request.requestId || index} className="request-table-row">
                        <td>{indexOfFirstRequest + index + 1}</td>
                        <td>
                          <div className="child-info">
                            <span className="child-avatar">{childName?.[0] || 'C'}</span>
                            {childName}
                          </div>
                        </td>
                        <td>
                          <div className="request-description" title={request.description || 'N/A'}>
                            {request.description || 'N/A'}
                          </div>
                        </td>
                        <td>{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`status-badge status-${request.status?.toLowerCase() || 'unknown'}`}>
                            {request.status || 'N/A'}
                          </span>
                        </td>
                        <td>{request.lastUpdated ? new Date(request.lastUpdated).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="create-response-button" 
                              onClick={() => handleCreateResponse(request)}
                            >
                              Create Response
                            </button>
                            <button 
                              className="doctor-sidebar__submenu-item"
                              onClick={() => handleViewResponse(request.requestId)}
                            >
                              <span className="doctor-sidebar__menu-text">View Response</span>
                            </button>
                            <button 
                              className="details-button" 
                              onClick={() => openDetailsModal(request)}
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>No requests available for this child.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination">
              <span className="pagination-info">
                Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} entries
              </span>
              <div className="pagination-buttons">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className={currentPage === 1 ? 'disabled' : ''}>
                  Previous
                </button>
                <span className="current-page">{currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className={currentPage === totalPages ? 'disabled' : ''}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recent-requests-section">
        <h3>Recent Requests</h3>
        <div className="recent-requests">
          {recentRequests.length > 0 ? (
            recentRequests.map(request => {
              const child = children.find(c => c.childId === request.childId);
              const childName = child ? child.name : 'Unknown Child';
              return (
                <div key={request.requestId} className="recent-request-card">
                  <div className="recent-request-header">
                    <h4>Request #{request.requestId}</h4>
                    <span className={`status-badge status-${request.status?.toLowerCase() || 'unknown'}`}>
                      {request.status || 'N/A'}
                    </span>
                  </div>
                  <p><strong>Child:</strong> {childName}</p>
                  <p><strong>Description:</strong> {request.description || 'N/A'}</p>
                  <p><strong>Request Date:</strong> {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              );
            })
          ) : (
            <p>No recent requests available.</p>
          )}
        </div>
      </div>

      <div className="page-footer">
        <div className="footer-left">
          <p>Last Updated: {new Date().toLocaleString()}</p>
        </div>
        <div className="footer-right">
          <a href="#">Help</a>
          <a href="#">Contact Support</a>
          <a href="#">Download as CSV</a>
        </div>
      </div>

      {isDetailsModalOpen && selectedDetailsRequest && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={detailsModalRef}>
            <button className="modal-close-button" onClick={closeDetailsModal} title="Close">×</button>
            <h2>Request Details</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Request ID</label>
                <p>{selectedDetailsRequest.requestId || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Child</label>
                <p>{children.find(c => c.childId === selectedDetailsRequest.childId)?.name || 'Unknown Child'}</p>
              </div>
              <div className="modal-field">
                <label>Description</label>
                <p>{selectedDetailsRequest.description || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Status</label>
                <p>{selectedDetailsRequest.status || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Request Date</label>
                <p>{selectedDetailsRequest.requestDate ? new Date(selectedDetailsRequest.requestDate).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Last Updated</label>
                <p>{selectedDetailsRequest.lastUpdated ? new Date(selectedDetailsRequest.lastUpdated).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="modal-buttons">
                <button onClick={closeDetailsModal} className="modal-button cancel">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isResponseModalOpen && selectedRequestForResponse && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={responseModalRef}>
            <button className="modal-close-button" onClick={closeResponseModal}>×</button>
            <h2>Create Consultation Response</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Child Name</label>
                <input
                  type="text"
                  value={children.find(c => c.childId === selectedRequestForResponse.childId)?.name || 'N/A'}
                  readOnly
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label>Request Description</label>
                <div className="response-content" dangerouslySetInnerHTML={{ __html: selectedRequestForResponse.description || 'N/A' }} />
              </div>
              <div className="modal-field">
                <label>Response Content</label>
                <ReactQuill
                  value={responseContent}
                  onChange={setResponseContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter your response here..."
                  className="modal-rich-text-editor"
                />
              </div>
              <div className="modal-field">
                <label>Status</label>
                <select
                  value={responseStatus}
                  onChange={(e) => setResponseStatus(e.target.value)}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis (optional)"
                  className="modal-input"
                />
              </div>
              <div className="modal-buttons">
                <button onClick={handleSubmitResponse} className="modal-button submit">
                  Submit
                </button>
                <button onClick={closeResponseModal} className="modal-button cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewResponseModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={viewResponseModalRef}>
            <button className="modal-close-button" onClick={closeViewResponseModal}>×</button>
            <h2>Consultation Responses</h2>
            <div className="modal-content">
              {viewResponseLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading responses...</p>
                </div>
              ) : selectedRequestResponses.length > 0 ? (
                selectedRequestResponses.map((response, index) => (
                  <div key={response.responseId} className="response-item">
                    <div className="modal-field">
                      <label>Response : </label>
                      <div 
                        className="response-content" 
                        dangerouslySetInnerHTML={{ __html: response.content || 'N/A' }} 
                      />
                    </div>
                    <div className="modal-field">
                      <label>Response Date</label>
                      <p>{response.responseDate ? new Date(response.responseDate).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div className="modal-field">
                      <label>Status</label>
                      <p>{response.status || 'N/A'}</p>
                    </div>
                    <div className="modal-field">
                      <label>Diagnosis</label>
                      <p>{response.diagnosis || 'N/A'}</p>
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <p>No responses found for this request.</p>
              )}
              <div className="modal-buttons">
                <button onClick={closeViewResponseModal} className="modal-button cancel">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRequests;