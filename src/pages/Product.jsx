// src/pages/Product.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchProductById } from '../api/product';
import { // 수정된 API 함수 임포트
  likeProduct,
  unlikeProduct,
  getUserLikedProducts,
  likeBrand,
  unlikeBrand,
  getUserLikedBrands
} from '../api/likes';
import { addCartItem } from '../api/cart';

export default function Product() {
  const { id: productIdString } = useParams(); // URL 파라미터는 문자열
  const productId = parseInt(productIdString); // API 호출 시 숫자로 변환
  const navigate = useNavigate();
  const { user } = useAuth(); // user 객체에 user_id가 있다고 가정

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 좋아요 관련 상태
  const [productLiked, setProductLiked] = useState(false);
  const [productLikeCount, setProductLikeCount] = useState(0);
  const [brandLiked, setBrandLiked] = useState(false);
  const [brandLikeCount, setBrandLikeCount] = useState(0);

  // 로딩 상태
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isLikeActionLoading, setIsLikeActionLoading] = useState(false); // 좋아요/취소 액션 로딩

  // 상품 정보 및 사용자 좋아요 상태 초기화
  useEffect(() => {
    if (isNaN(productId)) {
      console.error("Invalid product ID");
      setIsLoadingProduct(false);
      setProduct(null);
      return;
    }

    setIsLoadingProduct(true);
    fetchProductById(productId)
      .then(prodData => {
        setProduct(prodData);
        setProductLikeCount(prodData.like_count ?? 0);
        setBrandLikeCount(prodData.brand_like_count ?? 0); // 백엔드 CombinedProduct 스키마에 따름

        if (user && user.user_id) {
          // 상품 좋아요 상태 확인
          getUserLikedProducts(user.user_id)
            .then(likedData => {
              const isProdLiked = likedData.like_products.some(p => p.id === productId);
              setProductLiked(isProdLiked);
            })
            .catch(err => console.error('사용자 좋아요 상품 목록 조회 실패(초기화):', err));

          // 브랜드 좋아요 상태 확인 (상품에 brand_id가 있을 경우)
          if (prodData.brand_id) {
            getUserLikedBrands(user.user_id)
              .then(likedBrandData => {
                const isBrLiked = likedBrandData.like_brands.some(b => b.id === prodData.brand_id);
                setBrandLiked(isBrLiked);
              })
              .catch(err => console.error('사용자 좋아요 브랜드 목록 조회 실패(초기화):', err));
          }
        } else {
          setProductLiked(false);
          setBrandLiked(false);
        }
      })
      .catch(err => {
        console.error('상품 불러오기 실패:', err);
        setProduct(null);
      })
      .finally(() => {
        setIsLoadingProduct(false);
      });
  }, [productId, user]); // user가 변경 (로그인/아웃)되면 좋아요 상태 다시 확인

  const handleToggleProductLike = useCallback(async () => {
    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    if (isLikeActionLoading) return;

    setIsLikeActionLoading(true);
    const originalProductLiked = productLiked;
    const originalProductLikeCount = productLikeCount;

    // Optimistic update
    setProductLiked(!originalProductLiked);
    setProductLikeCount(prev => prev + (!originalProductLiked ? 1 : -1));

    try {
      if (!originalProductLiked) { // 현재 좋아요 X -> 좋아요 실행
        await likeProduct(productId, user.user_id);
      } else { // 현재 좋아요 O -> 좋아요 취소 실행
        await unlikeProduct(productId, user.user_id);
      }
    } catch (err) {
      console.error('상품 좋아요 처리 실패:', err.response?.data || err.message);
      alert(`상품 좋아요 처리에 실패했습니다: ${err.response?.data?.detail || '다시 시도해주세요.'}`);
      // Rollback on error
      setProductLiked(originalProductLiked);
      setProductLikeCount(originalProductLikeCount);
    } finally {
      setIsLikeActionLoading(false);
    }
  }, [user, productId, productLiked, productLikeCount, isLikeActionLoading, navigate]);

  const handleToggleBrandLike = useCallback(async () => {
    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    if (!product?.brand_id) {
        console.warn('브랜드 ID가 없어 브랜드 좋아요를 처리할 수 없습니다.');
        return;
    }
    if (isLikeActionLoading) return;

    setIsLikeActionLoading(true);
    const originalBrandLiked = brandLiked;
    const originalBrandLikeCount = brandLikeCount;

    // Optimistic update
    setBrandLiked(!originalBrandLiked);
    setBrandLikeCount(prev => prev + (!originalBrandLiked ? 1 : -1));

    try {
      if (!originalBrandLiked) {
        await likeBrand(product.brand_id, user.user_id);
      } else {
        await unlikeBrand(product.brand_id, user.user_id);
      }
    } catch (err) {
      console.error('브랜드 좋아요 처리 실패:', err.response?.data || err.message);
      alert(`브랜드 좋아요 처리에 실패했습니다: ${err.response?.data?.detail || '다시 시도해주세요.'}`);
      // Rollback on error
      setBrandLiked(originalBrandLiked);
      setBrandLikeCount(originalBrandLikeCount);
    } finally {
      setIsLikeActionLoading(false);
    }
  }, [user, product?.brand_id, brandLiked, brandLikeCount, isLikeActionLoading, navigate]);


  // --- 기존 핸들러들 (수정 없음 또는 최소 수정) ---
  const handleAddToCart = async () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    try {
      await addCartItem(user.user_id, productId, quantity); // productId 사용
      if (window.confirm('장바구니에 담겼습니다. 이동할까요?')) navigate('/cart');
    } catch (err) {
      console.error('장바구니 추가 실패', err);
      alert('장바구니 추가 실패');
    }
  };

  const handleBuyNow = () => {
    if (!user) { alert('로그인이 필요합니다.'); return navigate('/login'); }
    // productId, name 등 product에서 가져오도록 수정
    if (!product) return;
    navigate('/checkout', {
      state: { items: [{ product_id: productId, name: product.name, price: product.price, discounted_price: product.discounted_price, img_url: product.img_url, quantity, discount: product.discount }], is_from_cart: false }
    });
  };

  // --- 렌더링 로직 ---
  if (isLoadingProduct) return <p className="text-center py-10">상품을 불러오는 중…</p>;
  if (!product) return <p className="text-center py-10 text-red-500">상품을 찾을 수 없습니다.</p>;

  const {
    name, img_url, price = 0, discounted_price = price, discount = 0,
    major_category, sub_category, gender,
    view_count = 0, purchase_count = 0, // 기본값 설정
    brand_kor, brand_id, // brand_id는 product.brand_id로 사용
  } = product;

  const originalPrice = price.toLocaleString();
  const displayPrice = discounted_price.toLocaleString();
  const discountPct = discount > 0 ? `${discount}%` : '';

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      <div className="w-full md:w-1/2">
        <img src={img_url || 'https://via.placeholder.com/400'} alt={name} className="w-full object-cover rounded-lg shadow-lg" />
      </div>
      <div className="w-full md:w-1/2 space-y-6">
        {/* 브랜드 + 좋아요 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold cursor-pointer hover:underline" onClick={() => brand_id && navigate(`/brand/${brand_id}`)}>{brand_kor || '브랜드 정보 없음'}</h3>
          {brand_id && ( // 브랜드 ID가 있을 때만 브랜드 좋아요 버튼 표시
            <button
              onClick={handleToggleBrandLike}
              disabled={isLikeActionLoading || !user}
              className="flex items-center text-gray-600 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {brandLiked ? <span role="img" aria-label="Liked" className="text-pink-500 text-xl">❤️</span> : <span role="img" aria-label="Not Liked" className="text-xl">🤍</span>}
              <span className="ml-1 text-sm">{brandLikeCount.toLocaleString()}</span>
            </button>
          )}
        </div>
        {/* 카테고리 */}
        <p className="text-sm text-gray-500">{major_category} > {sub_category}</p>
        {/* 상품명 */}
        <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
        {/* 상세 통계 */}
        <p className="text-sm text-gray-600">
          성별: {gender} | 조회수: {view_count.toLocaleString()} | 판매 수: {purchase_count.toLocaleString()}
        </p>
        {/* 가격 정보 */}
        <div className="space-y-1">
          {discountPct && <p className="line-through text-gray-400 text-sm">{originalPrice}원</p>}
          <p className="flex items-baseline space-x-2">
            {discountPct && <span className="text-red-600 font-semibold">{discountPct}</span>}
            <span className="text-xl md:text-2xl font-bold text-gray-800">{displayPrice}원</span>
          </p>
        </div>
        {/* 수량 선택 */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">수량</span>
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:opacity-50" disabled={quantity <= 1}>－</button>
          <span className="px-3 py-1 border rounded-md w-12 text-center">{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border rounded-md hover:bg-gray-100">＋</button>
        </div>
        {/* 액션 영역: 상품 좋아요, 장바구니, 구매하기 */}
        <div className="flex items-center space-x-2 sm:space-x-4 pt-4 border-t mt-6">
          <button
            onClick={handleToggleProductLike}
            disabled={isLikeActionLoading || !user}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center p-3 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {productLiked ? <span role="img" aria-label="Liked" className="text-pink-500 text-xl">❤️</span> : <span role="img" aria-label="Not Liked" className="text-xl">🤍</span>}
            <span className="ml-2 text-sm">{productLikeCount.toLocaleString()}</span>
          </button>
          <button onClick={handleAddToCart} className="flex-grow px-4 py-3 border rounded-md hover:bg-gray-100 transition-colors">장바구니</button>
          <button onClick={handleBuyNow} className="flex-grow px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">구매하기</button>
        </div>
      </div>
    </div>
  );
}