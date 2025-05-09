import React from 'react';
import { Link } from 'react-router-dom'; // 🔹 React Router의 Link 추가
import { useAuth } from "../context/AuthContext"; // useAuth 추가


const Header = (props) => {
  const { user, logout } = useAuth(); // 로그인 상태 + 로그아웃 함수

  return (
    <header id="headerType" className={`header__wrap ${props.element}`}>
      <div className="header__inner">
        <div className="header__logo">
          <Link to="/">Highfive 🙌🏻</Link>
        </div>
        <nav className="header__menu">
          <ul>
            <li className="menu-item"><Link to="/mypage">마이페이지</Link></li>
            <li className="menu-item"><Link to="/cart">장바구니</Link></li>
            <li className="menu-item"><Link to="/">공지사항</Link></li>
          </ul>
        </nav>
        <div className="header__member">
          {user ? (
            // 로그인 상태면 로그아웃 버튼만
            <Link>
              <button onClick={logout}>로그아웃</button>
            </Link>
          ) : (
            // 비로그인 상태면 로그인 / 회원가입 링크
            <>
              <Link to="/login">로그인</Link>
              <Link to="/signup" style={{ marginLeft: "10px" }}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
