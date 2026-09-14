import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser, logoutUser } from '../../redux/slices/authSlice';

/**
 * AuthInitializer component
 * Validates active JWT session on application mount via fetchCurrentUser async thunk
 * and listens for token expiry events
 */
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('atelier_token');

    if (token) {
      dispatch(fetchCurrentUser());
    }

    const handleUnauthorized = () => {
      dispatch(logoutUser());
    };

    window.addEventListener('atelier:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('atelier:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
