import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './ConsultationRequests.css';

const ConsultationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [children, setChildren] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sort state
  const [sortField, setSortField] = useState('requestId');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal state for Create/Edit Request
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestDescription, setRequestDescription] = useState('');
  const [requestStatus, setRequestStatus] = useState('Pending');
  const [childId, setChildId] = useState('');

  // Modal state for Request Details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState(null);

  const modalRef = useRef(null);
  const detailsModalRef = useRef(null);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('http://localhost:5200/api/Child/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
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

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5200/api/ConsultationRequest/get-all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log("Consultation Requests Response:", response.data);

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const requestsWithTimestamps = response.data.data.$values.map(req => ({
          ...req,
          requestDate: req.requestDate || new Date().toISOString(), // Use existing or mock request date
          lastUpdated: new Date().toISOString(), // Mock last updated
        }));
        setRequests(requestsWithTimestamps);
        setFilteredRequests(requestsWithTimestamps);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Invalid response format. Expected an array of requests in data.$values.");
      }
    } catch (error) {
      console.error('Error fetching consultation requests:', error);
      setError(`Failed to load consultation requests: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchChildren();
      await fetchRequests();
    };
    fetchData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...requests];

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(request =>
        (request.requestId?.toString().includes(searchTerm) ||
        request.childId?.toString().includes(searchTerm) ||
        children[request.childId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchTerm.toLowerCase()))
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
      if (typeof fieldA === 'string') {
        return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page on filter/sort change
  }, [searchTerm, statusFilter, sortField, sortOrder, requests, children]);

  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

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

  // Modal handlers for Create/Edit Request
  const openCreateModal = (request) => {
    setIsEditMode(false);
    setSelectedRequest(request);
    setRequestDescription('');
    setRequestStatus('Pending');
    setChildId('');
    setIsModalOpen(true);
  };

  const openEditModal = (request) => {
    setIsEditMode(true);
    setSelectedRequest(request);
    setRequestDescription(request.description || '');
    setRequestStatus(request.status || 'Pending');
    setChildId(request.childId || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedRequest(null);
    setRequestDescription('');
    setRequestStatus('Pending');
    setChildId('');
  };

  // Modal handlers for Request Details
  const openDetailsModal = (request) => {
    setSelectedDetailsRequest(request);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedDetailsRequest(null);
  };

  // Delete handler
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5200/api/ConsultationRequest/delete/${requestId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchRequests(); // Refresh the requests
    } catch (error) {
      console.error("Error deleting consultation request:", error);
      setError("Failed to delete request. Please try again.");
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

  const handleSubmitRequest = async () => {
    if (!requestDescription) {
      alert("Please enter a description.");
      return;
    }

    if (!childId) {
      alert("Please select a child.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found.");
      return;
    }

    try {
      if (isEditMode) {
        // Update existing request
        await axios.put(
          `http://localhost:5200/api/ConsultationRequest/update/${selectedRequest.requestId}`,
          {
            childId: parseInt(childId),
            description: requestDescription,
            status: requestStatus,
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      } else {
        // Create new request
        await axios.post(
          'http://localhost:5200/api/ConsultationRequest/create',
          {
            childId: parseInt(childId),
            description: requestDescription,
            status: requestStatus,
          },
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
      }
      await fetchRequests();
      closeModal();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'submitting'} consultation request:`, error);
      setError(`Failed to ${isEditMode ? 'update' : 'submit'} request. Please try again.`);
    }
  };

  // Calculate summary stats
  const totalRequests = requests.length;
  const activeRequests = requests.filter(r => r.status === 'Active').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const inactiveRequests = requests.filter(r => r.status === 'Inactive').length;

  // Get recent requests (last 3)
  const recentRequests = requests.slice(0, 3);

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading data...</p>
    </div>
  );
  if (error) return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={fetchRequests} className="retry-button">
        Retry
      </button>
    </div>
  );

  return (
    <div className="consultation-requests-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <h2>Consultation Requests Dashboard</h2>
          <p>Manage and review all consultation requests here. Create, edit, or delete requests as needed.</p>
        </div>
        <div className="header-right">
          <button className="refresh-button" onClick={fetchRequests}>
            Refresh
          </button>
          <button className="action-button" onClick={() => openCreateModal({ childId: null })}>
            Create New Request
          </button>
        </div>
      </div>

      {/* Summary Section */}
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

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by child, description, or status..."
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
        <table className="consultation-requests-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('requestId')}>
                REQUEST ID {sortField === 'requestId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('childId')}>
                CHILD {sortField === 'childId' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('description')}>
                DESCRIPTION {sortField === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('requestDate')}>
                REQUEST DATE {sortField === 'requestDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')}>
                STATUS {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('lastUpdated')}>
                LAST UPDATED {sortField === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentRequests.length > 0 ? (
              currentRequests.map((request, index) => (
                <tr key={request.requestId || index} className="request-table-row">
                  <td>{request.requestId || 'N/A'}</td>
                  <td>
                    <div className="child-info">
                      <span className="child-avatar">{children[request.childId]?.[0] || 'C'}</span>
                      {children[request.childId] || request.childId || 'N/A'}
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
                      <button className="edit-button" onClick={() => openEditModal(request)}>
                        Edit
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteRequest(request.requestId)}>
                        Delete
                      </button>
                      <button className="details-button" onClick={() => openDetailsModal(request)}>
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <span className="pagination-info">
            Showing {indexOfFirstRequest + 1} to {Math.min(indexOfLastRequest, filteredRequests.length)} of {filteredRequests.length} entries
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

      {/* Recent Requests Section */}
      <div className="recent-requests-section">
        <h3>Recent Requests</h3>
        <div className="recent-requests">
          {recentRequests.length > 0 ? (
            recentRequests.map(request => (
              <div key={request.requestId} className="recent-request-card">
                <div className="recent-request-header">
                  <h4>Request #{request.requestId}</h4>
                  <span className={`status-badge status-${request.status?.toLowerCase() || 'unknown'}`}>
                    {request.status || 'N/A'}
                  </span>
                </div>
                <p><strong>Child:</strong> {children[request.childId] || 'N/A'}</p>
                <p><strong>Description:</strong> {request.description || 'N/A'}</p>
                <p><strong>Request Date:</strong> {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No recent requests available.</p>
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

      {/* Modal for Creating/Editing Consultation Request */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={modalRef}>
            <button className="modal-close-button" onClick={closeModal} title="Close">
              ×
            </button>
            <h2>{isEditMode ? 'Edit Consultation Request' : 'Create Consultation Request'}</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Child</label>
                <select
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  className="modal-select"
                >
                  <option value="">Select a child</option>
                  {Object.entries(children).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>Description</label>
                <textarea
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Enter request description..."
                  className="modal-textarea"
                />
              </div>
              <div className="modal-field">
                <label>Status</label>
                <select
                  value={requestStatus}
                  onChange={(e) => setRequestStatus(e.target.value)}
                  className="modal-select"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button onClick={handleSubmitRequest} className="modal-button submit">
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

      {/* Modal for Request Details */}
      {isDetailsModalOpen && selectedDetailsRequest && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={detailsModalRef}>
            <button className="modal-close-button" onClick={closeDetailsModal} title="Close">
              ×
            </button>
            <h2>Request Details</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Request ID</label>
                <p>{selectedDetailsRequest.requestId || 'N/A'}</p>
              </div>
              <div className="modal-field">
                <label>Child</label>
                <p>{children[selectedDetailsRequest.childId] || selectedDetailsRequest.childId || 'N/A'}</p>
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

export default ConsultationRequests;