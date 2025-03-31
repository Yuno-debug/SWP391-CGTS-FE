import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GrowthData.css';

const GrowthData = () => {
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5; // Số bản ghi trên mỗi trang

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await axios.get('/api/growth-records');
        
        if (response && response.data && response.data.$values) {
          setGrowthData(response.data.$values); // Lưu dữ liệu vào state
        } else {
          setError('Không có dữ liệu phát triển nào.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthData();
  }, []);

  // Tính toán chỉ số bản ghi cho trang hiện tại
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = growthData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(growthData.length / recordsPerPage);

  // Hàm điều hướng trang
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

  if (loading) {
    return <div>Loading growth data...</div>;
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
      
      <div className="growth-data-table-container">
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
            {currentRecords.map((record) => (
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

        {/* Phần phân trang */}
        <div className="pagination">
          <span className="pagination-info">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, growthData.length)} of {growthData.length} entries
          </span>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? 'pagination-button-disabled' : ''}
            >
              Previous
            </button>
            <span className="current-page">{currentPage}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? 'pagination-button-disabled' : ''}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthData;