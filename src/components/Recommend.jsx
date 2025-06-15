// src/components/Recommend.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchRecommendedProducts } from '../api/recommend';

const Recommend = ({ element, title }) => {
  const [products, setProducts] = useState([]);
  const [account, setAccount] = useState(null);
  const { user } = useAuth();
  const user_id = user?.user_id;

  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const { user_account, recommends } = await fetchRecommendedProducts(user_id);
        setAccount(user_account);
        setProducts(recommends);
      } catch (err) {
        console.error('추천 상품 로딩 실패:', err);
      }
    };

    loadRecommended();
  }, [user_id]);

  return (
    <section id="cardType" className={`card__wrap ${element}`}>
      <h2>{title}</h2>
      <p className="card__sub__title">
        ☁️ {account ?? '비회원'} 님을 위한 추천 상품입니다.
      </p>
      <div className="card__inner container">
        {products.map(product => (
          <article className="card" key={product.id}>
            <figure className="card__header">
              <Link to={`/product/${product.id}?from=recommend`}>
                <img src={product.img_url} alt={product.name} />
              </Link>
            </figure>
            <div className="card__body">
              <h3 className="tit">{product.brand_kor ?? '브랜드 미지정'}</h3>
              <p className="desc">{product.name}</p>
              {product.discount > 0 && (
                <p className="card__discount">{product.discount}% 할인</p>
              )}
              <p className="card__price">
                {product.price.toLocaleString()}원
              </p>
              <a className="btn" href={`/product/${product.id}`}>
                <span aria-hidden="true">
                  <svg
                    width="52"
                    height="8"
                    viewBox="0 0 52 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M51.3536 4.35355C51.5488 4.15829 51.5488 3.84171 51.3536 3.64645L48.1716 0.464466C47.9763 0.269204 47.6597 0.269204 47.4645 0.464466C47.2692 0.659728 47.2692 0.976311 47.4645 1.17157L50.2929 4L47.4645 6.82843C47.2692 7.02369 47.2692 7.34027 47.4645 7.53553C47.6597 7.7308 47.9763 7.7308 48.1716 7.53553L51.3536 4.35355ZM0 4.5H51V3.5H0V4.5Z"
                      fill="#5B5B5B"
                    />
                  </svg>
                </span>
                더 자세히 보기
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Recommend;
