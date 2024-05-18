import { useEffect, useState } from 'react';

function useAuth() {
  const [authenticated, setAuthenticated] = useState(
    !!sessionStorage.getItem('jwt')
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthenticated(!!sessionStorage.getItem('jwt'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return authenticated;
}

export default useAuth;
