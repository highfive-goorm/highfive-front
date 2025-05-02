const BASE_URL = 'http://localhost:8000';

/**
 * 로그인 요청
 * POST /login
 */
export async function loginRequest(account, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account, password }),
  });
  if (!res.ok) {
    throw new Error('로그인 실패');
  }
  const data = await res.json(); // { token, user }
  // 토큰·account 저장
  localStorage.setItem('token', data.token);
  localStorage.setItem('account', account);
  return data;
}

/**
 * 사용자 정보 조회
 * GET /user/{account}
 */
export async function getUserInfo(account) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/user/${account}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('유저 정보 조회 실패');
  }
  return await res.json();
}
