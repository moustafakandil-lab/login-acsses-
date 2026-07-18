// src/pages/AdminDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/dashboard.css';

export default function AdminDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => signOut(auth)}>Log out</button>
      </header>
      <p>Logged in as <strong>{currentUser?.email}</strong> — role: admin</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">Manage learners</div>
        <div className="dashboard-card">Course content</div>
        <div className="dashboard-card">Email log</div>
      </div>
    </div>
  );
}
