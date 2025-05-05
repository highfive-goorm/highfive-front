import React from 'react';
import { Link } from 'react-router-dom'; // 🔹 React Router의 Link 추가

const Header = (props) => {
  return (
    <header id="headerType" className={`header__wrap ${props.element}`}>
      <div className="header__inner">
        <div className="header__logo">
          <Link to="/">Highfive 🙌🏻</Link>
        </div>
        <nav className="header__menu">
          <ul>
            <li className="menu-item"><Link to="/">마이페이지</Link></li>
            <li className="menu-item"><Link to="/">장바구니</Link></li>
            <li className="menu-item"><Link to="/">공지사항</Link></li>
          </ul>
        </nav>
        <div className="header__member">
          <Link to="/login">로그인</Link>
          <Link to="/signup" style={{ marginLeft: '10px' }}>회원가입</Link> {/* 🔹 추가된 회원가입 */}
        </div>
      </div>
    </header>
  );
};

export default Header;
