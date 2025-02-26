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

  const handleEdit = (userId) => {
    // Handle edit user
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = (userId) => {
    // Handle delete user
    console.log(`Delete user with ID: ${userId}`);
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
            <th>Status</th>
            <th>Date of Joining</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.status}</td>
              <td>{user.registrationDate}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;