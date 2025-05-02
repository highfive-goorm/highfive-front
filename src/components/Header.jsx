import React from 'react';
import { Link } from 'react-router-dom'; // 🔹 React Router의 Link 추가

const Header = (props) => {
  return (
    <header id="headerType" className={`header__wrap ${props.element}`}>
      <div className="header__inner">
        <div className="header__logo">
          <Link to="/">web <em>site</em></Link>
        </div>
        <nav className="header__menu">
          <ul>
            <li><Link to="/">헤더 영역</Link></li>
            <li><Link to="/">슬라이드 영역</Link></li>
            <li><Link to="/">배너 영역</Link></li>
            <li><Link to="/">컨텐츠 영역</Link></li>
            <li><Link to="/">푸터 영역</Link></li>
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
