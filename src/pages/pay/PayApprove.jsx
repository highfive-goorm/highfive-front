import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { approveKakaoPay } from '../../api/kakaopay'; // 경로는 프로젝트에 맞게 수정

function PayApprove() {
  const location = useLocation();
  const navigate = useNavigate();
  const executedRef = useRef(false); // ✅ 실행 여부 추적

  useEffect(() => {
    if (executedRef.current) return; // 이미 실행했으면 skip
    executedRef.current = true;

    const urlParams = new URLSearchParams(location.search);
    const pgToken = urlParams.get('pg_token');
    const tid = sessionStorage.getItem('kakao_tid');
    const user_id = sessionStorage.getItem('kakao_user_id') || 'guest';

    if (!pgToken || !tid) {
      console.error('필수 값 누락 (pg_token 또는 tid)');
      return;
    }

    approveKakaoPay({ tid, pg_token: pgToken, user_id })
      .then((res) => {
        console.log('✅ 결제 승인 성공:', res);
        navigate('/pay/approve');
        alert('결제가 완료되었습니다.'); // ✅ 알림창
        navigate('/mypage/orders'); // ✅ 알림 확인 후 이동
      })
      .catch((err) => {
        console.error('❌ 결제 승인 실패:', err);
        navigate('/pay/fail');
      });
  }, [location, navigate]);

  return null; // ✅ 메시지 안 보이게 처리
}

export default PayApprove;
