// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useAuth }             from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../api/profile';

export function useProfile() {
  const { user } = useAuth();
  const user_id  = user?.user_id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user_id) return;
    setLoading(true);
    fetchProfile(user_id)
      .then(data => setProfile(data))
      .catch(err => console.error('fetchProfile failed:', err))
      .finally(() => setLoading(false));
  }, [user_id]);

  const save = (data) => {
    setLoading(true);
    return updateProfile(user_id, data)
      .then(updated => {
        setProfile(updated);
        return updated;
      })
      .finally(() => setLoading(false));
  };

  return { profile, loading, save };
}
