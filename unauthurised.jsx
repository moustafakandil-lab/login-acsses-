// src/pages/Unauthorized.jsx
import { Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Unauthorized() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Access denied</h1>
        <p>You don't have permission to view this page.</p>
        <Link to="/">Go back home</Link>
      </div>
    </div>
  );
}
