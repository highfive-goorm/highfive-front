// src/pages/Product.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import products from '../api/products.json';
import brands from '../api/brands.json';

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const product = products.find((p) => p.id.toString() === id) || {};
  const brand = brands.find((b) => b.id === product.brand_id) || {};

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(product.like_count ?? 0);
  const [brandLiked, setBrandLiked] = useState(false);
  const [brandLikeCount, setBrandLikeCount] = useState(brand.like_count ?? 0);

  if (!product.id) return <p>상품을 찾을 수 없습니다.</p>;

  const price = product.price ?? 0;
  const discountedPrice = product.discounted_price ?? price;
  const discount = product.discount ?? 0;
  const displayDiscountedPrice = discountedPrice.toLocaleString();
  const originalPrice = price.toLocaleString();
  const discountPercent = discount > 0 ? `${discount}%` : '';

  const toggleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const newState = !liked;
    setLiked(newState);
    setLikeCount((prev) => prev + (newState ? 1 : -1));

    try {
      await axios.post(`/api/product/${product.id}/like`, {
        user_id: user.user_id,
        product_id: product.id,
        liked: newState,
      });
    } catch (err) {
      console.error('상품 좋아요 실패', err);
    }
  };

  const toggleBrandLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const newState = !brandLiked;
    setBrandLiked(newState);
    setBrandLikeCount((prev) => prev + (newState ? 1 : -1));

    try {
      await axios.post(`/api/brand-like`, {
        user_id: user.user_id,
        brand_id: brand.id,
        liked: newState,
      });
    } catch (err) {
      console.error('브랜드 좋아요 실패', err);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('https://68144d36225ff1af162871b7.mockapi.io/cart', {
        user_id: user.user_id,
        product_id: product.id,
        quantity,
      });

      const confirmed = window.confirm('장바구니 담기 완료.\n장바구니로 이동하시겠습니까?');
      if (confirmed) {
        navigate('/cart');
      }
    } catch (err) {
      alert('장바구니 추가 실패');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    navigate('/checkout', {
      state: {
        items: [
          {
            product_id: product.id,
            name: product.name,
            price: discountedPrice,
            ori_price: price,
            img_url: product.img_url,
            quantity,
          }
        ]
      }
    });
  };

  return (
    <div style={{ display: 'flex', padding: '2rem' }}>
      {/* 좌측 이미지 */}
      <div style={{ flex: 1 }}>
        <img src={product.img_url} alt={product.name} width="100%" />
      </div>

      {/* 우측 상세 */}
      <div style={{ flex: 1, marginLeft: '3rem' }}>
        <div>
          <h3 style={{ display: 'inline-block', marginRight: '0.5rem' }}>
            {brand.brand_kor || product.brand}
          </h3>
          <button
            onClick={toggleBrandLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: 'gray'
            }}
          >
            {brandLiked ? '❤️' : '🤍'} {brandLikeCount.toLocaleString()}
          </button>
        </div>

        <p style={{ color: 'gray' }}>{product.major_category} &gt; {product.sub_category}</p>
        <h2>{product.name}</h2>

        <p>성별: {product.gender}</p>
        <p>조회수: {product.view_count} | 판매 수: {product.purchase_count}</p>

        <div>
          {discount > 0 && (
            <p style={{ textDecoration: 'line-through', color: 'gray' }}>{originalPrice}원</p>
          )}
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#ff003e' }}>
            {discountPercent} {displayDiscountedPrice}원
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
          <span style={{ marginRight: '1rem' }}>수량</span>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span style={{ margin: '0 1rem' }}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
          <button onClick={toggleLike}>
            {liked ? '❤️' : '🤍'} {likeCount.toLocaleString()}
          </button>

          <button
            onClick={handleAddToCart}
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            장바구니
          </button>

          <button
            onClick={handleBuyNow}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
