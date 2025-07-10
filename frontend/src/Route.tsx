import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthenticationContext } from './context/AuthenticationContext';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  roles?: string[];
}

export function PrivateRoute({ component: Component, roles }: PrivateRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authenticatedUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
}

interface AuthRouteProps {
  component: React.ComponentType<any>;
}

export function AuthRoute({ component: Component }: AuthRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  if (authenticatedUser) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
}
