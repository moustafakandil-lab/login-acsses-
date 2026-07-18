// src/components/ProtectedRoute.jsx
// Wrap any page that should only be visible to a specific role.
// This is the FRONTEND layer of protection (UX only — it stops a
// learner from seeing an admin page rendered). The REAL security
// layer is the Firestore security rules (see firestore.rules),
// which stop a learner from reading admin data even if they
// bypass this component entirely.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
