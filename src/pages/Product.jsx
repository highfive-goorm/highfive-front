// src/pages/Product.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProductById } from '../api/product';
import { toggleProductLike, toggleBrandLike } from '../api/likes';
import { addCartItem } from '../api/cart';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productLiked, setProductLiked] = useState(false);
  const [productLikeCount, setProductLikeCount] = useState(0);
  const [brandLiked, setBrandLiked] = useState(false);
  const [brandLikeCount, setBrandLikeCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then(prod => {
        setProduct(prod);
        setProductLiked(false);
        setBrandLiked(false);
        setProductLikeCount(prod.product_likes ?? 0);
        setBrandLikeCount(prod.brand_like ?? 0);
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
    brand_id,
  } = product;

  const originalPrice = price.toLocaleString();
  const displayPrice = discounted_price.toLocaleString();
  const discountPct = discount > 0 ? `${discount}%` : '';

  const handleToggleProductLike = async () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    const newState = !productLiked;
    setProductLiked(newState);
    setProductLikeCount(c => c + (newState ? 1 : -1));
    try { await toggleProductLike(id, user.user_id, newState); } catch (err) { console.error('상품 좋아요 처리 실패', err); }
  };

  const handleToggleBrandLike = async () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    const newState = !brandLiked;
    setBrandLiked(newState);
    setBrandLikeCount(c => c + (newState ? 1 : -1));
    try { await toggleBrandLike(brand_id, user.user_id, newState); } catch (err) { console.error('브랜드 좋아요 처리 실패', err); }
  };

  const handleAddToCart = async () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    try {
      await addCartItem(user.user_id, id, quantity);
      if (window.confirm('장바구니에 담겼습니다. 이동할까요?')) navigate('/cart');
    } catch (err) { console.error('장바구니 추가 실패', err); alert('장바구니 추가 실패'); }
  };

  const handleBuyNow = () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    navigate('/checkout', {
      state: { items: [{ product_id: id, name, price, discounted_price, img_url, quantity, discount }], is_from_cart: false }
    });
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2">
        <img src={img_url} alt={name} className="w-full object-cover rounded-lg" />
      </div>
      <div className="w-full md:w-1/2 space-y-6">
        {/* 브랜드 + 좋아요 */}
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">{brand_kor}</h3>
          <button onClick={handleToggleBrandLike} className="flex items-center text-gray-600 hover:text-gray-800">
            {brandLiked ? '❤️' : '🤍'}<span className="ml-1 text-sm">{brandLikeCount.toLocaleString()}</span>
          </button>
        </div>
        {/* 카테고리 */}
        <p className="text-sm text-gray-500">{major_category} &gt; {sub_category}</p>
        {/* 상품명 */}
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
        {/* 상세 통계 */}
        <p className="text-sm text-gray-600">
          성별: {gender} | 조회수: {page_view_total} | 판매 수: {purchase_total}
        </p>
        {/* 가격 정보 */}
        <div className="space-y-1">
          {discountPct && <p className="line-through text-gray-400 text-sm">{originalPrice}원</p>}
          <p className="flex items-baseline space-x-2">
            {discountPct && <span className="text-red-600 font-semibold">{discountPct}</span>}
            <span className="text-xl md:text-2xl font-bold text-black-600">{displayPrice}원</span>
          </p>
        </div>
        {/* 수량 선택 */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">수량</span>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 border rounded disabled:opacity-50" disabled={quantity <= 1}>－</button>
          <span className="px-2">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-2 py-1 border rounded">＋</button>
        </div>
        {/* 액션 영역: 상품 좋아요, 장바구니, 구매하기 */}
        <div className="flex items-center space-x-4 pt-4">
          <button onClick={handleToggleProductLike} className="flex items-center text-gray-600 hover:text-gray-800">
            {productLiked ? '❤️' : '🤍'}<span className="ml-1 text-sm">{productLikeCount.toLocaleString()}</span>
          </button>
          <button onClick={handleAddToCart} className="px-4 py-2 border rounded hover:bg-gray-100">장바구니</button>
          <button onClick={handleBuyNow} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">구매하기</button>
        </div>
      </div>
    </div>
  );
}
