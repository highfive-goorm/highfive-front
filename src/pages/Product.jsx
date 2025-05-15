// src/pages/Product.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProductById } from '../api/product';
import { toggleProductLike } from '../api/likes';
import { addCartItem } from '../api/cart';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct]     = useState(null);
  const [quantity, setQuantity]   = useState(1);
  const [liked, setLiked]         = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 단일 상품 조회
  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then(prod => {
        setProduct(prod);
        setLiked(false); // 초기 liked 상태는 서버 응답이 없으므로 false
        setLikeCount(prod.product_like ?? 0);
      })
      .catch(err => console.error('상품 불러오기 실패', err));
  }, [id]);

  if (!product) return <p>상품을 불러오는 중…</p>;
  if (!product.id) return <p>상품을 찾을 수 없습니다.</p>;

  const {
    name,
    img_url,
    price = 0,
    discounted_price = price,
    discount = 0,
    major_category,
    sub_category,
    gender,
    page_view_total,
    purchase_total,
    brand_kor,
    product_like,
  } = product;

  const originalPrice = price.toLocaleString();
  const displayPrice  = discounted_price.toLocaleString();
  const discountPct   = discount > 0 ? `${discount}%` : '';

  // 좋아요 토글
  const handleToggleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    const newState = !liked;
    setLiked(newState);
    setLikeCount(c => c + (newState ? 1 : -1));
    try {
      await toggleProductLike(id, user.user_id, newState);
    } catch (err) {
      console.error('좋아요 처리 실패', err);
    }
  };

  // 장바구니 담기
  const handleAddToCart = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    try {
      await addCartItem(user.user_id, id, quantity);
      if (window.confirm('장바구니에 담겼습니다. 이동할까요?')) {
        navigate('/cart');
      }
    } catch (err) {
      console.error('장바구니 추가 실패', err);
      alert('장바구니 추가 실패');
    }
  };

  // 바로 구매하기
  const handleBuyNow = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    navigate('/checkout', {
      state: {
        items: [{ product_id: id, name, price, discounted_price, img_url, quantity, discount }],
        is_from_cart: false,
      },
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2">
        <img src={img_url} alt={name} className="w-full object-cover rounded" />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{brand_kor}</h3>
          <button onClick={handleToggleLike} className="text-base">
            {liked ? '❤️' : '🤍'} {likeCount.toLocaleString()}
          </button>
        </div>

        <p className="text-sm text-gray-500">{major_category} &gt; {sub_category}</p>
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-sm text-gray-600">
          성별: {gender} | 조회수: {page_view_total} | 판매수: {purchase_total}
        </p>

        <div className="space-y-1">
          {discount > 0 && <p className="line-through text-gray-400 text-sm">{originalPrice}원</p>}
          <p className="text-red-600 text-xl font-bold">
            {discountPct} {displayPrice}원
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <span className="text-sm font-medium">수량</span>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>－</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>＋</button>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button onClick={handleAddToCart} className="px-4 py-2 border rounded">장바구니</button>
          <button onClick={handleBuyNow} className="px-4 py-2 bg-black text-white rounded">구매하기</button>
        </div>
      </div>
    </div>
  );
}
