import React, { useState, useEffect } from "react";
import axios from "axios";
import './Doctor.css';

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Trạng thái modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dữ liệu form thêm bác sĩ
  const [addFormData, setAddFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
    fullname: "",
    specialization: "",
    degree: "",
    hospital: "",
    licenseNumber: "",
    biography: ""
  });

  // Dữ liệu form chỉnh sửa bác sĩ
  const [editFormData, setEditFormData] = useState({
    name: "",
    specialization: "",
    phoneNumber: "",
    degree: "",
    hospital: "",
    licenseNumber: "",
    biography: ""
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5200/api/Doctor', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`
        }
      });

      if (response.data?.$values && Array.isArray(response.data.$values)) {
        setDoctors(response.data.$values);
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError('Error fetching doctors data');
    } finally {
      setLoading(false);
    }
  };

  // Validation dữ liệu email và số điện thoại
  const validateForm = (formData) => {
    if (!formData.email || !formData.phoneNumber) {
      alert("Email và số điện thoại không được để trống.");
      return false;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ.");
      return false;
    }

    // Kiểm tra số điện thoại hợp lệ (8-15 số)
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert("Số điện thoại không hợp lệ.");
      return false;
    }

    return true;
  };

  // Xử lý thêm bác sĩ
  const handleAddSubmit = async () => {
    if (!validateForm(addFormData)) return;

    try {
      const response = await axios.post(`http://localhost:5200/api/UserAccount/create-doctor`, addFormData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'application/json'
        }
      });

      alert("Bác sĩ đã được thêm thành công!");
      setIsAddModalOpen(false);
      fetchDoctors();
    } catch (error) {
      alert(`Lỗi: ${error.response?.data?.message || "Không thể thêm bác sĩ"}`);
    }
  };

  // Xử lý mở modal chỉnh sửa
  const handleEdit = (doctor) => {
  console.log("Editing Doctor:", doctor); // Xem dữ liệu khi mở modal

  setEditingDoctorId(doctor.doctorId || doctor.id);
  setEditFormData({
    name: doctor.name || "",
    specialization: doctor.specialization || "",
    phoneNumber: doctor.phoneNumber?.trim() || "",
    email: doctor.email?.trim() || "",
    degree: doctor.degree || "",
    hospital: doctor.hospital || "",
    licenseNumber: doctor.licenseNumber || "",
    biography: doctor.biography || ""
  });

  setIsEditModalOpen(true);
};



  // Xử lý cập nhật thông tin bác sĩ
  const handleEditSubmit = async () => {
  if (!editingDoctorId) {
    alert("Lỗi: Không tìm thấy ID bác sĩ!");
    return;
  }

  // Cắt khoảng trắng trước khi kiểm tra
  const emailTrimmed = editFormData.email.trim();
  const phoneNumberTrimmed = editFormData.phoneNumber.trim();

  if (!emailTrimmed || !phoneNumberTrimmed) {
    alert("Email và số điện thoại không được để trống!");
    return;
  }

  try {
    await axios.put(`http://localhost:5200/api/Doctor/${editingDoctorId}`, 
      { ...editFormData, email: emailTrimmed, phoneNumber: phoneNumberTrimmed },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'application/json'
        }
      }
    );

    alert("Cập nhật thông tin bác sĩ thành công!");
    setIsEditModalOpen(false);
    fetchDoctors();
  } catch (error) {
    alert(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật bác sĩ"}`);
  }
};
  // Xử lý xóa bác sĩ
  const handleDelete = async (doctorId) => {
    if (!doctorId) {
        console.error("doctorId is undefined! Cannot delete.");
        return;
    }

    // Hiển thị hộp thoại xác nhận
    const isConfirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (!isConfirmed) return; // Nếu người dùng bấm "Cancel" thì dừng lại

    try {
        const response = await fetch(`http://localhost:5200/api/Doctor/${doctorId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Delete failed with status: ${response.status}`);
        }

        alert("Doctor deleted successfully!");
        fetchDoctors(); // Load lại danh sách bác sĩ sau khi xóa
    } catch (error) {
        console.error("Error deleting doctor:", error);
    }
};

  return (
    <div className="doctor-table-container">
      <h2>Doctors</h2>
      <button className="Add-btn" onClick={() => setIsAddModalOpen(true)}>Add More Doctor</button>
        {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Doctor</h2>
            <input type="text" placeholder="Username" value={addFormData.username} onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })} />
            <input type="password" placeholder="Password" value={addFormData.password} onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })} />
            <input type="email" placeholder="Email" value={addFormData.email} onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })} />
            <input type="text" placeholder="Phone Number" value={addFormData.phoneNumber} onChange={(e) => setAddFormData({ ...addFormData, phoneNumber: e.target.value })} />
            <input type="text" placeholder="Address" value={addFormData.address} onChange={(e) => setAddFormData({ ...addFormData, address: e.target.value })} />
            <input type="text" placeholder="Full Name" value={addFormData.fullname} onChange={(e) => setAddFormData({ ...addFormData, fullname: e.target.value })} />
            <input type="text" placeholder="Specialization" value={addFormData.specialization} onChange={(e) => setAddFormData({ ...addFormData, specialization: e.target.value })} />
            <input type="text" placeholder="Degree" value={addFormData.degree} onChange={(e) => setAddFormData({ ...addFormData, degree: e.target.value })} />
            <input type="text" placeholder="Hospital" value={addFormData.hospital} onChange={(e) => setAddFormData({ ...addFormData, hospital: e.target.value })} />
            <input type="text" placeholder="License Number" value={addFormData.licenseNumber} onChange={(e) => setAddFormData({ ...addFormData, licenseNumber: e.target.value })} />
            <input type="text" placeholder="Biography" value={addFormData.biography} onChange={(e) => setAddFormData({ ...addFormData, biography: e.target.value })} />
            <button onClick={handleAddSubmit}>Add</button>
            <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Loading...</p> : (
        <table className="doctor-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Specialization</th>
              <th>Degree</th>
              <th>Hospital</th>
              <th>License Number</th>
              <th>Biography</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id}>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phoneNumber}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.degree}</td>
                <td>{doctor.hospital}</td>
                <td>{doctor.licenseNumber}</td>
                <td>{doctor.biography}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(doctor)}>Edit</button>
                  <button className="del-btn" onClick={() => handleDelete(doctor.doctorId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Doctor Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Doctor</h2>
            <label>Name:</label>
            <input type="text" name="name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />

            <label>Specialization:</label>
            <input type="text" name="specialization" value={editFormData.specialization} onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })} />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })} />

            <label>Degree:</label>
            <input type="text" name="degree" value={editFormData.degree} onChange={(e) => setEditFormData({ ...editFormData, degree: e.target.value })} />

            <label>Hospital:</label>
            <input type="text" name="hospital" value={editFormData.hospital} onChange={(e) => setEditFormData({ ...editFormData, hospital: e.target.value })} />

            <label>License Number:</label>
            <input type="text" name="licenseNumber" value={editFormData.licenseNumber} onChange={(e) => setEditFormData({ ...editFormData, licenseNumber: e.target.value })} />


            <label>Biography:</label>
            <input type="text" name="biography" value={editFormData.biography} onChange={(e) => setEditFormData({ ...editFormData, biography: e.target.value })} />

            <button onClick={() => handleEditSubmit(editingDoctorId)}>Save</button>
            <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTable;
