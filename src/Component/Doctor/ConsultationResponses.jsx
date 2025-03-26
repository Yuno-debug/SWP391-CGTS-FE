import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ConsultationResponses.css';

const ConsultationResponse = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [children, setChildren] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const responsesPerPage = 5;

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sort state
  const [sortField, setSortField] = useState('responseId');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal state for Create/Edit Response
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [responseContent, setResponseContent] = useState('');
  const [responseStatus, setResponseStatus] = useState('Active');
  const [diagnosis, setDiagnosis] = useState('');

  // Modal state for Response Details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailsResponse, setSelectedDetailsResponse] = useState(null);

  const modalRef = useRef(null);
  const detailsModalRef = useRef(null);

  // Fetch child data
  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:5200/api/Child/get-all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Children Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const childMap = response.data.data.$values.reduce((acc, child) => {
          acc[child.id] = child.name; // Map childId to name
          return acc;
        }, {});
        setChildren(childMap);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:5200/api/UserAccount/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Doctors Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const doctorMap = response.data.data.$values
          .filter(user => user.role === 3) // Assuming role 3 is Doctor
          .reduce((acc, doctor) => {
            acc[doctor.id] = doctor.username; // Map doctorId to username
            return acc;
          }, {});
        setDoctors(doctorMap);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const fetchResponses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5200/api/ConsultationResponse/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Consultation Responses Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const responsesWithTimestamps = response.data.data.$values.map(resp => ({
          ...resp,
          createdDate: new Date().toISOString(), // Mock created date
          lastUpdated: new Date().toISOString(), // Mock last updated
        }));
        setResponses(responsesWithTimestamps);
        setFilteredResponses(responsesWithTimestamps);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Invalid response format. Expected an array of responses in data.$values.");
      }
    } catch (error) {
      console.error('Error fetching consultation responses:', error);
      setError(`Failed to load consultation responses: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchChildren();
      await fetchDoctors();
      await fetchResponses();
    };
    fetchData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...responses];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(response => response.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(response =>
        (response.responseId?.toString().includes(searchTerm) ||
        response.requestId?.toString().includes(searchTerm) ||
        children[response.childId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctors[response.doctorId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        response.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      if (sortField === 'childId') {
        const childA = children[fieldA] || fieldA;
        const childB = children[fieldB] || fieldB;
        return sortOrder === 'asc' ? childA.localeCompare(childB) : childB.localeCompare(childA);
      }
      if (sortField === 'doctorId') {
        const doctorA = doctors[fieldA] || fieldA;
        const doctorB = doctors[fieldB] || fieldB;
        return sortOrder === 'asc' ? doctorA.localeCompare(doctorB) : doctorB.localeCompare(doctorA);
      }
      if (typeof fieldA === 'string') {
        return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    setFilteredResponses(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, statusFilter, sortField, sortOrder, responses, doctors, children]);

  // Pagination logic
  const indexOfLastResponse = currentPage * responsesPerPage;
  const indexOfFirstResponse = indexOfLastResponse - responsesPerPage;
  const currentResponses = filteredResponses.slice(indexOfFirstResponse, indexOfLastResponse);
  const totalPages = Math.ceil(filteredResponses.length / responsesPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Sort handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Modal handlers for Create/Edit Response
  const openCreateModal = (response) => {
    setIsEditMode(false);
    setSelectedResponse(response);
    setResponseContent('');
    setResponseStatus('Active');
    setDiagnosis('');
    setIsModalOpen(true);
  };

  const openEditModal = (response) => {
    setIsEditMode(true);
    setSelectedResponse(response);
    setResponseContent(response.content || '');
    setResponseStatus(response.status || 'Active');
    setDiagnosis(response.diagnosis || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedResponse(null);
    setResponseContent('');
    setResponseStatus('Active');
    setDiagnosis('');
  };

  // Modal handlers for Response Details
  const openDetailsModal = (response) => {
    setSelectedDetailsResponse(response);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDetailsResponse(null);
  };

  // Delete handler
  const handleDeleteResponse = async (responseId) => {
    if (!window.confirm('Are you sure you want to delete this response?')) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5200/api/ConsultationResponse/delete/${responseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchResponses(); // Refresh the responses
    } catch (error) {
      console.error("Error deleting consultation response:", error);
      setError("Failed to delete response. Please try again.");
    }
  };

  // Close modals on outside click
  const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
    if (detailsModalRef.current && !detailsModalRef.current.contains(e.target)) {
      closeDetailsModal();
    }
  }, []);

  // Close modals on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isModalOpen) closeModal();
        if (isDetailsModalOpen) closeDetailsModal();
      }
    };

    if (isModalOpen || isDetailsModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen, isDetailsModalOpen, handleOutsideClick]);

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

    try {
      const payload = {
        requestId: selectedResponse.requestId,
        doctorId: selectedResponse.doctorId,
        childId: selectedResponse.childId,
        childName: children[selectedResponse.childId] || 'Unknown Child',
        content: responseContent,
        status: responseStatus,
        diagnosis: diagnosis || null,
      };

      if (isEditMode) {
        await axios.put(
          `http://localhost:5200/api/ConsultationResponse/update/${selectedResponse.responseId}`,
          payload,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          'http://localhost:5200/api/ConsultationResponse/create',
          payload,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      }
      await fetchResponses();
      closeModal();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} consultation response:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'submit'} response. Please try again.`);
    }
  };

  // Calculate summary stats
  const totalResponses = responses.length;
  const activeResponses = responses.filter(r => r.status === 'Active').length;
  const pendingResponses = responses.filter(r => r.status === 'Pending').length;
  const inactiveResponses = responses.filter(r => r.status === 'Inactive').length;

  // Get recent responses (last 3)
  const recentResponses = responses.slice(0, 3);

  // React-Quill toolbar configuration
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
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'list', 'bullet',
    'indent',
    'color', 'background',
    'link',
  ];

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading data...</p>
    </div>
  );
  if (error) return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={fetchResponses} className="retry-button">
        Retry
      </button>
    </div>
  );

  return (
    <div className="consultation-response-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <h2>Consultation Responses Dashboard</h2>
          <p>Manage and review all consultation responses here. Create, edit, or delete responses as needed.</p>
        </div>
        <div className="header-right">
          <button className="refresh-button" onClick={fetchResponses}>
            Refresh
          </button>
          <button className="action-button" onClick={() => openCreateModal({ requestId: null, doctorId: null, childId: null })}>
            Create New Response
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>Total Responses</h4>
          <div className="summary-value">{totalResponses}</div>
        </div>
        <div className="summary-card">
          <h4>Active Responses</h4>
          <div className="summary-value">{activeResponses}</div>
        </div>
        <div className="summary-card">
          <h4>Pending Responses</h4>
          <div className="summary-value">{pendingResponses}</div>
        </div>
        <div className="summary-card">
          <h4>Inactive Responses</h4>
          <div className="summary-value">{inactiveResponses}</div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by child, doctor, content, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <table className="consultation-response-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('childId')}>
                CHILD NAME {sortField === 'childId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('doctorId')}>
                DOCTOR NAME {sortField === 'doctorId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('content')}>
                CONTENT {sortField === 'content' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('createdDate')}>
                DATE {sortField === 'createdDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')}>
                STATUS {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('diagnosis')}>
                DIAGNOSIS {sortField === 'diagnosis' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentResponses.length > 0 ? (
              currentResponses.map((response, index) => (
                <tr key={response.responseId || index} className="response-table-row">
                  <td>{children[response.childId] || response.childId || 'N/A'}</td>
                  <td>
                    <div className="doctor-info">
                      <span className="doctor-avatar">{doctors[response.doctorId]?.[0] || 'U'}</span>
                      {doctors[response.doctorId] || response.doctorId || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <div className="response-content" dangerouslySetInnerHTML={{ __html: response.content || 'N/A' }} />
                  </td>
                  <td>{response.createdDate ? new Date(response.createdDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${response.status?.toLowerCase() || 'unknown'}`}>
                      {response.status || 'N/A'}
                    </span>
                  </td>
                  <td>{response.diagnosis || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => openEditModal(response)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteResponse(response.responseId)}>
                        Delete
                      </button>
                      <button className="details-button" onClick={() => openDetailsModal(response)}>
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No responses available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <span className="pagination-info">
            Showing {indexOfFirstResponse + 1} to {Math.min(indexOfLastResponse, filteredResponses.length)} of {filteredResponses.length} entries
          </span>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'disabled' : ''}
            >
              Previous
            </button>
            <span className="current-page">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'disabled' : ''}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Recent Responses Section */}
      <div className="recent-responses-section">
        <h3>Recent Responses</h3>
        <div className="recent-responses">
          {recentResponses.length > 0 ? (
            recentResponses.map(response => (
              <div key={response.responseId} className="recent-response-card">
                <div className="recent-response-header">
                  <h4>Response #{response.responseId}</h4>
                  <span className={`status-badge status-${response.status?.toLowerCase() || 'unknown'}`}>
                    {response.status || 'N/A'}
                  </span>
                </div>
                <p><strong>Child:</strong> {children[response.childId] || 'N/A'}</p>
                <p><strong>Doctor:</strong> {doctors[response.doctorId] || 'N/A'}</p>
                <p><strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: response.content || 'N/A' }} /></p>
                <p><strong>Created:</strong> {response.createdDate ? new Date(response.createdDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No recent responses available.</p>
          )}
        </div>
      </div>

      {/* Footer Section */}
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

      {/* Modal for Creating/Editing Consultation Response */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={modalRef}>
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
            <h2>{isEditMode ? 'Edit Consultation Response' : 'Create Consultation Response'}</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Child Name</label>
                <input
                  type="text"
                  value={children[selectedResponse?.childId] || 'N/A'}
                  readOnly
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label>Doctor Name</label>
                <input
                  type="text"
                  value={doctors[selectedResponse?.doctorId] || 'N/A'}
                  readOnly
                  className="modal-input"
                />
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
                  {isEditMode ? 'Update' : 'Submit'}
                </button>
                <button onClick={closeModal} className="modal-button cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Response Details */}
      {isDetailsModalOpen && selectedDetailsResponse && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={detailsModalRef}>
            <button className="modal-close-button" onClick={closeDetailsModal}>
              ×
            </button>
            <h2>Response Details</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Child Name</label>
                <p>{children[selectedDetailsResponse.childId] || selectedDetailsResponse.childId || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Doctor Name</label>
                <p>{doctors[selectedDetailsResponse.doctorId] || selectedDetailsResponse.doctorId || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Response Content</label>
                <div className="response-content" dangerouslySetInnerHTML={{ __html: selectedDetailsResponse.content || 'N/A' }} />
              </div>
              <div className="modal-field">
                <label>Date</label>
                <p>{selectedDetailsResponse.createdDate ? new Date(selectedDetailsResponse.createdDate).toLocaleString() : 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Status</label>
                <p>{selectedDetailsResponse.status || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Diagnosis</label>
                <p>{selectedDetailsResponse.diagnosis || 'N/A'}</p>
              </div>
              <div className="modal-buttons">
                <button onClick={closeDetailsModal} className="modal-button cancel">
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

export default ConsultationResponse;