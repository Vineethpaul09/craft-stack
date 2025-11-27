import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'admin' | 'recruiter' | 'candidate';
}

export const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireRole 
}: ProtectedRouteProps) => {
  const { user, loading, profile, isAdmin, isRecruiter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/auth');
      } else if (requireRole) {
        if (requireRole === 'admin' && !isAdmin) {
          navigate('/');
        } else if (requireRole === 'recruiter' && !isRecruiter) {
          navigate('/');
        }
      }
    }
  }, [user, loading, requireAuth, requireRole, navigate, isAdmin, isRecruiter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireRole && profile) {
    if (requireRole === 'admin' && !isAdmin) return null;
    if (requireRole === 'recruiter' && !isRecruiter) return null;
  }

  return <>{children}</>;
};
