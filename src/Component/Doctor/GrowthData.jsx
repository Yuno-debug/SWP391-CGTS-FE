import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import ReactQuill styles
import './GrowthData.css';

const GrowthData = () => {
  const [growthRecords, setGrowthRecords] = useState([]);
  const [children, setChildren] = useState({});
  const [alerts, setAlerts] = useState([]); // State để lưu danh sách alert
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Filter and search state
  const [selectedChildId, setSelectedChildId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state for creating alerts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('Growth Alert');
  const [isRead, setIsRead] = useState(false);

  const modalRef = useRef(null);

  // Fetch children from API
  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authorization token found. Please log in again.");
        return;
      }

      const response = await axios.get('http://localhost:5200/api/Child/get-all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        const childMap = response.data.data.$values.reduce((acc, child) => {
          acc[child.childId] = child.name;
          return acc;
        }, {});
        setChildren(childMap);
      } else {
        setError("Failed to load children: Invalid response format.");
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      setError(`Failed to fetch children: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
    }
  };

  // Fetch growth records from API
  const fetchGrowthRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5200/api/growth-records", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data?.$values && Array.isArray(response.data.$values)) {
        setGrowthRecords(response.data.$values);
      } else {
        setError("Failed to load growth records due to unexpected data format.");
      }
    } catch (error) {
      console.error("Error fetching growth records:", error);
      setError(`Failed to load growth records: ${error.response?.status ? `Error ${error.response.status}` : error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent alerts from API (giả định có endpoint /api/Alert/get-all)
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authorization token found. Please log in again.");
        return;
      }

      const response = await axios.get('http://localhost:5200/api/Alert', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
        setAlerts(response.data.data.$values);
      } else {
        console.error("Unexpected alert response format:", response.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchChildren();
      await fetchGrowthRecords();
      await fetchAlerts();
    };
    fetchData();
  }, []);

  // Function to check if weight exceeds standard BMI for height
  const checkAlertCondition = (record) => {
    const standardBmiRange = { min: 14, max: 18 };
    const bmi = parseFloat(record.bmi);

    if (bmi > standardBmiRange.max) {
      return {
        shouldAlert: true,
        message: `Child's BMI (${bmi}) exceeds the standard maximum (${standardBmiRange.max}) for their height (${record.height} cm).`,
        className: 'bmi-high',
      };
    } else if (bmi < standardBmiRange.min) {
      return {
        shouldAlert: true,
        message: `Child's BMI (${bmi}) is below the standard minimum (${standardBmiRange.min}) for their height (${record.height} cm).`,
        className: 'bmi-low',
      };
    }
    return { shouldAlert: false, message: '', className: '' };
  };

  // Filter and search logic
  const filteredRecords = growthRecords.filter(record => {
    const childName = children[record.childId]?.toLowerCase() || '';
    const month = new Date(2024, record.month - 1, 1).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    }).toLowerCase();
    const notes = record.notes?.toLowerCase() || '';

    return (
      (selectedChildId ? record.childId === parseInt(selectedChildId) : true) &&
      (searchTerm
        ? childName.includes(searchTerm.toLowerCase()) ||
          month.includes(searchTerm.toLowerCase()) ||
          notes.includes(searchTerm.toLowerCase())
        : true)
    );
  });

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

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

  // Open the modal to create an alert
  const openAlertModal = (record) => {
    setSelectedRecord(record);
    const { message } = checkAlertCondition(record);
    setAlertMessage(message || '');
    setAlertType('Growth Alert');
    setIsRead(false);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
    setAlertMessage('');
    setAlertType('Growth Alert');
    setIsRead(false);
  };

  // Handle outside click to close the modal
  const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen, handleOutsideClick]);

  // Function to send the alert to the backend
  const handleSubmitAlert = async () => {
    if (!alertMessage || alertMessage === '<p><br></p>') {
      alert("Please enter an alert message.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authorization token found. Please log in again.");
      return;
    }

    if (!selectedRecord?.childId) {
      alert("Child ID is missing. Cannot send alert.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5200/api/Alert",
        {
          childId: selectedRecord.childId,
          alertType: alertType,
          message: alertMessage,
          isRead: isRead,
          alertDate: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Alert response:", response.data);
      alert("Alert sent successfully!");
      await fetchAlerts(); // Refresh danh sách alert
      closeModal();
    } catch (error) {
      console.error("Error sending alert:", error);
      setError(`Failed to send alert: ${error.response?.data?.message || error.message}`);
    }
  };

  // Calculate summary stats
  const totalRecords = growthRecords.length;
  const totalChildren = new Set(growthRecords.map(record => record.childId)).size;
  const abnormalRecords = growthRecords.filter(record => checkAlertCondition(record).shouldAlert).length;

  // Get recent alerts (last 3)
  const recentAlerts = alerts.slice(0, 3);

  // ReactQuill toolbar configuration
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

  if (loading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} style={{ marginTop: '10px' }}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="growth-data-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-left">
          <h2>Growth Data Dashboard</h2>
          <p>Track and monitor the growth metrics of children over time. Create alerts for any concerning trends.</p>
        </div>
        <div className="header-right">
          <button className="refresh-button" onClick={fetchGrowthRecords}>
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>Total Records</h4>
          <div className="summary-value">{totalRecords}</div>
        </div>
        <div className="summary-card">
          <h4>Children Monitored</h4>
          <div className="summary-value">{totalChildren}</div>
        </div>
        <div className="summary-card">
          <h4>Abnormal BMI Records</h4>
          <div className="summary-value">{abnormalRecords}</div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="filter-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by child name, month, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="child-filter">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            <option value="">All Children</option>
            {Object.entries(children).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        <table className="growth-data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Child Name</th>
              <th>Month</th>
              <th>Weight (kg)</th>
              <th>Height (cm)</th>
              <th>BMI</th>
              <th>Head Circumference (cm)</th>
              <th>Upper Arm Circumference (cm)</th>
              <th>Recorded By</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => {
                const { shouldAlert, className } = checkAlertCondition(record);
                return (
                  <tr key={record.recordId || index} className={shouldAlert ? className : ''}>
                    <td>{indexOfFirstRecord + index + 1}</td>
                    <td>{children[record.childId] || record.childId || 'N/A'}</td>
                    <td>
                      {new Date(2024, record.month - 1, 1).toLocaleDateString("en-GB", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>{record.weight || 'N/A'}</td>
                    <td>{record.height || 'N/A'}</td>
                    <td>{record.bmi || 'N/A'}</td>
                    <td>{record.headCircumference || 'N/A'}</td>
                    <td>{record.upperArmCircumference || 'N/A'}</td>
                    <td>{record.recordedByUser || 'N/A'}</td>
                    <td>{record.notes || 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="alert-button"
                          onClick={() => openAlertModal(record)}
                        >
                          Alert
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="11" style={{ textAlign: 'center' }}>
                  No growth records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <span className="pagination-info">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredRecords.length)} of {filteredRecords.length} entries
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

      {/* Recent Alerts Section */}
      <div className="recent-alerts-section">
        <h3>Recent Alerts</h3>
        <div className="recent-alerts">
          {recentAlerts.length > 0 ? (
            recentAlerts.map(alert => (
              <div key={alert.alertId} className="recent-alert-card">
                <div className="recent-alert-header">
                  <h4>Alert #{alert.alertId}</h4>
                  <span className={`status-badge ${alert.isRead ? 'read' : 'unread'}`}>
                    {alert.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
                <p><strong>Child:</strong> {children[alert.childId] || alert.childId || 'N/A'}</p>
                <p><strong>Type:</strong> {alert.alertType || 'N/A'}</p>
                <p><strong>Message:</strong> <span dangerouslySetInnerHTML={{ __html: alert.message || 'N/A' }} /></p>
                <p><strong>Date:</strong> {alert.alertDate ? new Date(alert.alertDate).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))
          ) : (
            <p>No recent alerts available.</p>
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

      {/* Modal for Creating Alerts */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-modal-in" ref={modalRef}>
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
            <h2>Create Alert</h2>
            <div className="modal-content">
              <div className="modal-field">
                <label>Child Name</label>
                <input
                  type="text"
                  value={children[selectedRecord?.childId] || selectedRecord?.childId || 'N/A'}
                  readOnly
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label>Alert Type</label>
                <input
                  type="text"
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value)}
                  placeholder="Enter alert type..."
                  className="modal-input"
                />
              </div>
              <div className="modal-field">
                <label>Message</label>
                <ReactQuill
                  value={alertMessage}
                  onChange={setAlertMessage}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter your alert message here..."
                  className="modal-rich-text-editor"
                />
              </div>
              <div className="modal-field">
                <label>Is Read</label>
                <select
                  value={isRead}
                  onChange={(e) => setIsRead(e.target.value === 'true')}
                  className="modal-select"
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button onClick={handleSubmitAlert} className="modal-button submit">
                  Submit
                </button>
                <button onClick={closeModal} className="modal-button cancel">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthData;