import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginRequest } from '../lib/api';
import styles from '../assets/css/Login.module.css';

export default function LoginPage() {
  const navigate = useNavigate();

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await loginRequest(account, password);
      navigate('/');
    } catch {
      setErrorMsg('계정 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="account" className={styles.label}>ID</label>
            <input
              id="account"
              type="text"
              placeholder="아이디"
              value={account}
              onChange={e => setAccount(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          {errorMsg && <p role="alert" className={styles.error}>{errorMsg}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${isLoading ? styles.disabled : ''}`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <div className={styles.signup}>
            아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
