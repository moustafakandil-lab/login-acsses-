// src/pages/LearnerDashboard.jsx
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/dashboard.css';

export default function LearnerDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Learner Dashboard</h1>
        <button onClick={() => signOut(auth)}>Log out</button>
      </header>
      <p>Logged in as <strong>{currentUser?.email}</strong> — role: learner</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">My courses</div>
        <div className="dashboard-card">My progress</div>
        <div className="dashboard-card">Messages</div>
      </div>
    </div>
  );
}
