import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GrowthData.css';

const GrowthData = () => {
  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedChildData, setSelectedChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false); // State để hiển thị modal
  const [alertData, setAlertData] = useState({
    alertType: '',
    alertDate: new Date().toISOString(),
    message: '',
    isRead: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const consultationResponse = await axios.get('/api/ConsultationRequest/get-all');
        const consultationData = consultationResponse.data.data.$values;
        setRequests(consultationData);

        const childIds = [...new Set(consultationData.map(req => req.childId))];
        const childrenData = await Promise.all(
          childIds.map(async (id) => {
            const response = await axios.get(`/api/Child/${id}`);
            return response.data.data;
          })
        );
        setChildren(childrenData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu ban đầu.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      const filtered = requests.filter(request => request.childId === parseInt(selectedChildId));
      setFilteredRequests(filtered);
    } else {
      setFilteredRequests(requests);
    }
  }, [selectedChildId, requests]);

  useEffect(() => {
    if (selectedChildId) {
      const fetchChildAndGrowthData = async () => {
        try {
          const childResponse = await axios.get(`/api/Child/${selectedChildId}`);
          setSelectedChildData(childResponse.data.data);

          const growthResponse = await axios.get(`/api/growth-records/child/${selectedChildId}`);
          setGrowthData(growthResponse.data.$values || []);
        } catch (err) {
          console.error('Error fetching child or growth data:', err);
          setError('Đã xảy ra lỗi khi tải dữ liệu.');
          setSelectedChildData(null);
          setGrowthData([]);
        }
      };
      fetchChildAndGrowthData();
    } else {
      setSelectedChildData(null);
      setGrowthData([]);
    }
  }, [selectedChildId]);

  const childrenWithRequests = children.filter(child =>
    requests.some(request => request.childId === child.childId)
  );

  const handleChildSelect = (childId) => {
    setSelectedChildId(childId);
  };

  const handleBack = () => {
    setSelectedChildId(null);
  };

  const getAvatarUrl = (child) => {
    return child?.allergies || "https://placehold.co/50x50?text=No+Image";
  };

  // Xử lý hiển thị modal
  const handleShowAlertModal = () => {
    setShowAlertModal(true);
    setAlertData({
      alertType: '',
      alertDate: new Date().toISOString(),
      message: '',
      isRead: false,
    });
  };

  // Xử lý đóng modal
  const handleCloseAlertModal = () => {
    setShowAlertModal(false);
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleAlertChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAlertData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Xử lý gửi alert đến API
  const handleSubmitAlert = async () => {
    try {
      const payload = {
        childId: selectedChildId,
        alertType: alertData.alertType,
        alertDate: alertData.alertDate,
        message: alertData.message,
        isRead: alertData.isRead,
      };
      await axios.post('/api/Alert', payload);
      alert('Alert created successfully!');
      setShowAlertModal(false); // Đóng modal sau khi gửi
    } catch (err) {
      console.error('Error creating alert:', err);
      alert('Failed to create alert.');
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="growth-data-container">
      <div className="page-header">
        <h2>Growth Records</h2>
        <p>All growth data for children</p>
      </div>

      <div className="children-section">
        <h3 className="children-requests-title">Children's Request List</h3>
        <div className="addchild-child-list">
          {selectedChildId && selectedChildData ? (
            <>
              <div className="back-button-container">
                <button className="back-button" onClick={handleBack}>
                  <span className="back-arrow"></span> Back
                </button>
              </div>
              <div
                key={selectedChildData.childId}
                className="addchild-child-card addchild-child-card-selected"
              >
                <div className="addchild-child-card-content">
                  <img
                    src={getAvatarUrl(selectedChildData)}
                    alt={`${selectedChildData.name}'s Avatar`}
                    className="addchild-child-card-avatar"
                    onError={(e) => (e.target.src = "https://placehold.co/50x50?text=No+Image")}
                  />
                  <div className="addchild-child-card-name">{selectedChildData.name}</div>
                  <div className="addchild-child-card-details">
                    <p>DOB: {new Date(selectedChildData.dateOfBirth).toLocaleDateString()}</p>
                    <p>Gender: {selectedChildData.gender}</p>
                    <p>Weight: {selectedChildData.birthWeight} kg</p>
                    <p>Height: {selectedChildData.birthHeight} cm</p>
                    <p>Blood: {selectedChildData.bloodType}</p>
                  </div>
                </div>
              </div>
            </>
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
              <p>No children with requests found.</p>
            )
          )}
        </div>
      </div>

      {selectedChildId && growthData.length > 0 && (
        <div className="growth-data-table-container">
          <h3>Growth Data for {selectedChildData?.name}</h3>
          <div className="alert-button-container">
            <button className="alert-button" onClick={handleShowAlertModal}>
              Add Alert
            </button>
          </div>
          <table className="growth-data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Weight (kg)</th>
                <th>Height (cm)</th>
                <th>BMI</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {growthData.map((record) => (
                <tr
                  key={record.recordId}
                  className={record.bmi > 18.5 ? 'bmi-high' : 'bmi-low'}
                >
                  <td>{record.month}</td>
                  <td>{record.weight}</td>
                  <td>{record.height}</td>
                  <td>{record.bmi}</td>
                  <td>{record.recordedByUser}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal cho form alert */}
      {showAlertModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Alert</h3>
            <div className="alert-form">
              <label>
                Alert Type:
                <select
                  name="alertType"
                  value={alertData.alertType}
                  onChange={handleAlertChange}
                >
                  <option value="">Select Type</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
              <label>
                Message:
                <input
                  type="text"
                  name="message"
                  value={alertData.message}
                  onChange={handleAlertChange}
                />
              </label>
              <label>
                Is Read:
                <input
                  type="checkbox"
                  name="isRead"
                  checked={alertData.isRead}
                  onChange={handleAlertChange}
                />
              </label>
              <div className="modal-buttons">
                <button
                  className="submit-alert-button"
                  onClick={handleSubmitAlert}
                >
                  Submit
                </button>
                <button
                  className="cancel-alert-button"
                  onClick={handleCloseAlertModal}
                >
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