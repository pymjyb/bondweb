import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { requireAdminSession } from '../utils/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const session = await requireAdminSession();
        if (!isMounted) return;
        setStatus(session ? 'authorized' : 'unauthorized');
      } catch (err) {
        console.error('Failed to verify session:', err);
        if (!isMounted) return;
        setStatus('unauthorized');
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Verifying access…</div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
