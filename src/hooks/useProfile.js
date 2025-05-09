// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import { useAuth }             from '../context/AuthContext';
import { fetchProfile, updateProfile } from '../api/profile';

const USE_STUB = process.env.REACT_APP_USE_STUB === 'true';

// 스텁 데이터
const PROFILE_STUB = {
  name:    '홍길동',
  age:     30,
  gender:  'M',
  address: '서울특별시 강남구 테헤란로 123',
};
const STORAGE_KEY = 'profile_stub';

export function useProfile() {
  const { user } = useAuth();
  const user_id  = user?.user_id;
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    if (USE_STUB) {
      // stub 모드: 미리 정의된 데이터로 세팅
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile(PROFILE_STUB);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PROFILE_STUB));
      }
    } else {
      // 실제 API 호출
      fetchProfile(user_id)
        .then(setProfile)
        .catch(err => {
          console.error('fetchProfile failed:', err);
        });
    }
  }, [user_id]);

  const save = data => {
    if (USE_STUB) {
      // 스텁 모드: 상태 + localStorage 동시 갱신
      const updated = { ...profile, ...data };
      setProfile(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('[Profile Stub] saved', updated);
      return Promise.resolve(updated);
    }

    // 실제 API 호출
    return updateProfile(user_id, data).then(updated => {
      setProfile(updated);
      return updated;
    });
  };

  return { profile, save };
}
