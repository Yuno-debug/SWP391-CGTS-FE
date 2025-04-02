import React, { useState, useEffect } from "react";
import axios from "axios";
import './User.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phoneNumber: "",
    address: "",
  });
  const [updateUser, setUpdateUser] = useState({
    username: "",
    phoneNumber: "",
    profilePicture: "",
    address: "",
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [selectedStatus, setSelectedStatus] = useState(''); // State cho bộ lọc trạng thái
  const [searchQuery, setSearchQuery] = useState(''); // State cho từ khóa tìm kiếm

  useEffect(() => {
    fetchUsers();
  }, []);

  const API_BASE_URL = "/api/UserAccount";

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-all`, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidHR0dHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBY3RpdmUiLCJleHAiOjE3NDAxMjMxMzUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MjAwIn0.iqjN7re4DlVr7y7EDpTVHsBBbT9Ds96daLkVFzAApFw'
        }
      });

      console.log("API Response:", response.data);

      if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.$values)) {
        setUsers(response.data.data.$values);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response format");
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
      setError('Error fetching users data');
    }
  };

  // Lấy danh sách trạng thái duy nhất cho dropdown
  const getUniqueStatuses = () => {
    const filteredUsers = users.filter(user => user.role !== 1);
    const statuses = [...new Set(filteredUsers.map(user => user.status))];
    return ['All', ...statuses];
  };

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi lọc
  };

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Lọc người dùng dựa trên trạng thái và từ khóa tìm kiếm
  const getFilteredUsers = () => {
    let filteredUsers = users.filter(user => user.role !== 1);

    // Lọc theo trạng thái
    if (selectedStatus && selectedStatus !== 'All') {
      filteredUsers = filteredUsers.filter(user => user.status === selectedStatus);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
      );
    }

    return filteredUsers;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, newUser, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("User added successfully!", response.data);
      alert("User added successfully!");
      setNewUser({ email: "", password: "", confirmPassword: "", username: "", phoneNumber: "", address: "" });
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to add user"}`);
    }
  };

  const handleShowUpdateModal = (user) => {
    setSelectedUserId(user.userId);
    setUpdateUser({
      username: user.username || "",
      phoneNumber: user.phoneNumber || "",
      profilePicture: user.profilePicture || "",
      address: user.address || "",
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Error: User ID is missing.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/update/${selectedUserId}`, updateUser, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("User updated successfully!", response.data);
      alert("User updated successfully!");
      setShowUpdateModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to update user"}`);
    }
  };

  const handleBan = async (id) => {
    console.log("Banning User ID:", id);
    if (!id) {
      alert("Error: User ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to ban this user?")) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/ban/${id}`, null, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("User banned successfully!", response.data);
      alert("User banned successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error banning user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to ban user"}`);
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting User ID:", id);
    if (!id) {
      alert("Error: User ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.put(`${API_BASE_URL}/remove/${id}`, null, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      console.log("User deleted successfully!", response.data);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to delete user"}`);
    }
  };

  // Logic phân trang với lọc
  const filteredUsers = getFilteredUsers();
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-table-container">
      <h2>Users</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="filter-search-container">
        <div className="filter-container">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            {getUniqueStatuses().map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>

      <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
        <span>+</span> Add User
      </button>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={newUser.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                required
              />
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                placeholder="Username"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
              <div className="modal-buttons">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Date of Joining</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={user.userId || index}>
              <td>{indexOfFirstUser + index + 1}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{new Date(user.registrationDate).toLocaleDateString("en-GB", { month: "2-digit", year: "numeric" })}</td>
              <td style={{ color: user.status === "Active" ? "green" : "red", fontWeight: "bold" }}>{user.status}</td>
              <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-GB", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: false
              }) : ""}</td>
              <td>
                <button onClick={() => handleShowUpdateModal(user)}>Update</button>
                <button onClick={() => handleBan(user.userId)}>Ban</button>
                <button onClick={() => handleDelete(user.userId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="paginationAdmin">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update User</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                name="username"
                value={updateUser.username}
                onChange={handleUpdateInputChange}
                placeholder="Username"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                value={updateUser.phoneNumber}
                onChange={handleUpdateInputChange}
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                name="profilePicture"
                value={updateUser.profilePicture}
                onChange={handleUpdateInputChange}
                placeholder="Profile Picture URL"
              />
              <input
                type="text"
                name="address"
                value={updateUser.address}
                onChange={handleUpdateInputChange}
                placeholder="Address"
                required
              />
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowUpdateModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;