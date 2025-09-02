import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Users.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loggedInUserRole, setLoggedInUserRole] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchLoggedInUserRole();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      const params = { page };
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get('/user', { params });
      setUsers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('No users found or an error occurred.');
      setUsers([]); // Clear users on error
    }
  };

  const fetchLoggedInUserRole = async () => {
    try {
      const response = await api.get('/user/me');
      setLoggedInUserRole(response?.data?.result?.role);
    } catch (error) {
      console.error('Error fetching logged-in user role:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put('/user/role', { userId, role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  return (
    <div className="users-container">
      <h2>Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={handleSearchChange}
      />
      {error && <div className="error-message">{error}</div>}
      {users.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {loggedInUserRole === 'manager' || loggedInUserRole === 'hr' ? <th>Change Role</th> : null}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{capitalizeFirstLetter(user.role)}</td>
                  {loggedInUserRole === 'manager' || loggedInUserRole === 'hr' ? (
                    <td>
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="manager">Manager</option>
                        <option value="hr">HR</option>
                        <option value="employee">Employee</option>
                      </select>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <span key={index}>
                <button
                  onClick={() => handlePageChange(index + 1)}
                  disabled={page === index + 1}
                >
                  {index + 1}
                </button>
              </span>
            ))}
          </div>
        </>
      ) : (
        !error && <div className="no-users">No users found.</div>
      )}
    </div>
  );
}

export default Users;