import React, { useState, useEffect } from "react";
import axios from "axios";
import './User.css';

const UserTable = () => {
  const [users, setUsers] = useState([]); // Ensure initial state is an empty array
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/UserAccount/get-all', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoidHR0dHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBY3RpdmUiLCJleHAiOjE3NDAxMjMxMzUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjUyMDAiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo1MjAwIn0.iqjN7re4DlVr7y7EDpTVHsBBbT9Ds96daLkVFzAApFw' // Replace 'YOUR_ACCESS_TOKEN' with the actual token
          }
        });

        console.log("API Response:", response.data); // Debugging

        // Ensure response data is an array
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

    fetchUsers();
  }, []);

  const API_BASE_URL = "/api/UserAccount";

// Ban tài khoản người dùng
const handleBan = async (id) => {
  console.log("Banning User ID:", id); // Debug

  if (!id) {
    alert("Error: User ID is missing.");
    return;
  }

  if (!window.confirm("Are you sure you want to ban this user?")) return;

  try {
    const response = await axios.put(`/api/UserAccount/ban/${id}`, null, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    console.log("User banned successfully!", response.data);
    alert("User banned successfully!");
    fetchUsers(); // Reload danh sách người dùng
  } catch (error) {
    console.error("Error banning user:", error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.message || "Failed to ban user"}`);
  }
};

const handleDelete = async (id) => {
  console.log("Deleting User ID:", id); // Debug

  if (!id) {
    alert("Error: User ID is missing.");
    return;
  }

  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const response = await axios.delete(`/api/UserAccount/remove/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    console.log("User deleted successfully!", response.data);
    alert("User deleted successfully!");
    fetchUsers(); // Reload danh sách người dùng
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    alert(`Error: ${error.response?.data?.message || "Failed to delete user"}`);
  }
};
  return (
    <div className="user-table-container">
      <h2>Users</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="user-table">
  <thead>
    <tr>
      <th>Full Name</th>
      <th>Email</th>
      <th>Phone Number</th>
      <th>Date of Joining</th>
      <th>Status</th>
      <th>Last Login</th>
    </tr>
  </thead>
  <tbody>
    {users.filter(user => user.role !== 1).map(user => (
      <tr key={user.id}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.phoneNumber}</td>
        <td>{new Date(user.registrationDate).toLocaleDateString("en-GB", { month: "2-digit", year: "numeric" })}</td>
        <td style={{ color: user.status === "Active" ? "green" : "red", fontWeight: "bold" }}>{user.status}</td>
        <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString("en-GB", {
          day: "2-digit", month: "2-digit", year: "numeric",
          hour: "2-digit", minute: "2-digit", hour12: false
        }) : ""}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default UserTable;