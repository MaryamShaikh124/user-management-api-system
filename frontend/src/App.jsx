
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/users";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <div className="card-top">
        <div className="avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <span className="user-id">
          ID #{user.id}
        </span>
      </div>

      <h3>{user.name}</h3>
      <p className="user-role">{user.role}</p>

      <div className="user-details">
        <p>
          <span>Email</span>
          <strong>{user.email}</strong>
        </p>
      </div>

      <div className="card-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(user.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function fetchUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError(
        "Could not connect to the server. Please start the backend and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function resetForm() {
    setName("");
    setEmail("");
    setRole("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!name.trim() || !email.trim() || !role.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const userData = {
      name: name.trim(),
      email: email.trim(),
      role: role.trim()
    };

    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, userData);
        setNotice("User updated successfully.");
      } else {
        await axios.post(API_URL, userData);
        setNotice("User added successfully.");
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save user. Please try again."
      );
    }
  }

  function handleEdit(user) {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditingId(user.id);
    setError("");
    setNotice("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await axios.delete(`${API_URL}/${id}`);

      if (editingId === id) {
        resetForm();
      }

      setNotice("User deleted successfully.");
      await fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete user. Please try again."
      );
    }
  }

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.role.toLowerCase().includes(text)
    );
  });

  return (
    <div className="app">
      <header className="hero">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-icon">U</span>
            <span>UserSpace</span>
          </div>

          <span className="nav-label">ADMIN PANEL</span>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">ASSIGNMENT 08 / BACKEND DEVELOPMENT</p>
          <h1>User Management</h1>
          <p className="hero-description">
            A simple place to manage user records, all in one view.
          </p>

          <div className="api-status">
            <span className="status-dot"></span>
            REST API CONNECTED
          </div>
        </div>
      </header>

      <main className="container">
        <section className="summary-grid">
          <div className="summary-card">
            <span className="summary-icon">01</span>
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </div>

          <div className="summary-card">
            <span className="summary-icon">02</span>
            <p>Filtered Results</p>
            <h2>{filteredUsers.length}</h2>
          </div>

          <div className="summary-card">
            <span className="summary-icon">03</span>
            <p>API Status</p>
            <h2 className="online-text">
              {loading ? "Loading" : error ? "Check API" : "Online"}
            </h2>
          </div>
        </section>

        <section className="content-grid">
          <div className="form-panel">
            <div className="section-heading">
              <p className="section-label">
                {editingId !== null ? "EDIT RECORD" : "NEW RECORD"}
              </p>

              <h2>
                {editingId !== null ? "Update User" : "Add a User"}
              </h2>

              <p>
                Enter the details below to manage a user record.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Ayesha Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="e.g. ayesha@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select a role</option>
                <option value="Student">Student</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="Other">Other</option>
              </select>

              <button className="primary-button" type="submit">
                {editingId !== null ? "Save Changes" : "Add User"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel Editing
                </button>
              )}
            </form>
          </div>

          <div className="directory-panel">
            <div className="directory-heading">
              <div>
                <p className="section-label">USER DIRECTORY</p>
                <h2>All Users</h2>
              </div>

              <button
                className="refresh-button"
                onClick={fetchUsers}
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <input
              className="search-input"
              type="search"
              placeholder="Search by name, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {notice && (
              <div className="success-message">{notice}</div>
            )}

            {error && (
              <div className="error-message">
                {error}
                <button onClick={fetchUsers}>Try Again</button>
              </div>
            )}

            {loading ? (
              <div className="empty-state">
                <div className="loader"></div>
                <p>Loading user records...</p>
              </div>
            ) : !error && filteredUsers.length === 0 ? (
              <div className="empty-state">
                <h3>No users found</h3>
                <p>Try another search or add a new user.</p>
              </div>
            ) : !error ? (
              <div className="users-grid">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>UserSpace · Assignment 8</p>
        <p>Built with React, Node.js and Express.js</p>
      </footer>
    </div>
  );
}

export default App;
