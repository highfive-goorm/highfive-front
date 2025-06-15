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
import { useTracking } from '../hooks/useTracking';

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

  const { trackEvent } = useTracking();

  // 상품 정보 및 사용자 좋아요 상태 초기화
  useEffect(() => {
    if (isNaN(productId)) {
      console.error("Invalid product ID");
      setIsLoadingProduct(false);
      setProduct(null);
      return;
    }

    setIsLoadingProduct(true);
    let isMounted = true; // 컴포넌트 언마운트 시 비동기 작업 중단 플래그

    fetchProductById(productId)
      .then(productData => {
        if (!isMounted) return; // 언마운트되었으면 상태 업데이트 방지

        if (productData) {
          setProduct(productData);
          document.title = `${productData.name} | 하이파이브`; // 페이지 제목 설정
          // 좋아요/브랜드 좋아요 카운트는 productData에서 직접 가져옴
          setProductLikeCount(productData.like_count ?? 0);
          setBrandLikeCount(productData.brand_like_count ?? 0);

          // ***** product_view 이벤트 로깅 *****
          trackEvent(
            "product_view",
            { // event_properties
              product_id: String(productData.id), // 상품 ID
              product_name: productData.name || null, // 상품명
              brand_id: productData.brand_id ? String(productData.brand_id) : null, // 브랜드 ID
              brand_name: productData.brand_kor || null, // 브랜드명 (brand_kor 필드 사용 가정)
              category_code: productData.category_code || null,
              price: productData.price || 0,
              discount: typeof productData.discount === 'number' ? productData.discount : 0,
              discounted_price: typeof productData.discounted_price === 'number' ? productData.discounted_price : (productData.price || 0),
              gender: productData.gender || null,
            }
          );

          // 사용자 로그인 상태에 따른 좋아요 정보 초기화
          if (user && user.user_id) {
            // 상품 좋아요 상태 확인
            getUserLikedProducts(user.user_id)
              .then(likedData => {
                if (!isMounted) return;
                const isProdLiked = likedData.like_products.some(p => p.id === productId);
                setProductLiked(isProdLiked);
              })
              .catch(err => {
                if (isMounted) console.error('사용자 좋아요 상품 목록 조회 실패(초기화):', err);
              });

            // 브랜드 좋아요 상태 확인
            if (productData.brand_id) {
              getUserLikedBrands(user.user_id)
                .then(likedBrandData => {
                  if (!isMounted) return;
                  const isBrLiked = likedBrandData.like_brands.some(b => b.id === productData.brand_id);
                  setBrandLiked(isBrLiked);
                })
                .catch(err => {
                  if (isMounted) console.error('사용자 좋아요 브랜드 목록 조회 실패(초기화):', err);
                });
            }
          } else {
            if (isMounted) {
              setProductLiked(false);
              setBrandLiked(false);
            }
          }
        } else {
          if (isMounted) setProduct(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(`상품 ID(${productId}) 불러오기 실패:`, err);
          setProduct(null);
          document.title = '하이파이브'; // 에러 시 기본 제목
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingProduct(false);
      });

      return () => {
        isMounted = false; // 컴포넌트 언마운트 시 플래그 설정
        document.title = '하이파이브'; // 기본 제목으로 복원
      };

      

  }, [productId, user, trackEvent]);

  // productId가 없을 경우 (잘못된 접근 등)
  useEffect(() => {
    if (isNaN(productId)) document.title = '하이파이브';
    // 이 useEffect는 productId가 변경될 때만 실행되므로,
    // 일반적인 페이지 이동 시의 제목 복원은 위의 useEffect 클린업에서 처리됩니다.
    // 만약 이 컴포넌트가 productId 없이 렌더링되었다가 다른 페이지로 이동하는 경우를 대비한다면
    // 여기에도 클린업 함수를 추가할 수 있습니다.
  }, [productId]);

  // --- 좋아요/브랜드 좋아요 토글 핸들러 (useCallback 유지) ---
  const handleToggleProductLike = useCallback(async () => {
    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    if (isLikeActionLoading || !product) return;

    setIsLikeActionLoading(true);
    const originalIsLiked = productLiked;
    const newIsLiked = !originalIsLiked;

    setProductLiked(newIsLiked);
    setProductLikeCount(prev => prev + (newIsLiked ? 1 : -1));

    try {
      if (newIsLiked) {
        await likeProduct(productId, user.user_id);
      } else {
        await unlikeProduct(productId, user.user_id);
      }
      // 상품 좋아요/취소 성공 시 로그
      trackEvent("product_like", { // event_type을 "product_like"로 변경
          product_id: String(productId),
          is_liked: newIsLiked, // 스키마에 따라 'is_liked' 사용, 값은 boolean
      });
    } catch (err) {
      console.error('상품 좋아요 처리 실패:', err.response?.data || err.message);
      alert(`상품 좋아요 처리에 실패했습니다.`);
      setProductLiked(originalIsLiked); // 롤백
      setProductLikeCount(prev => prev + (originalIsLiked ? 1 : -1)); // 롤백
    } finally {
      setIsLikeActionLoading(false);
    }
  }, [user, productId, product, productLiked, isLikeActionLoading, navigate, trackEvent]);

  const handleToggleBrandLike = useCallback(async () => {
    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    if (!product?.brand_id || isLikeActionLoading) return;

    setIsLikeActionLoading(true);
    const originalIsBrandLiked = brandLiked;
    const newIsBrandLiked = !originalIsBrandLiked;

    setBrandLiked(newIsBrandLiked);
    setBrandLikeCount(prev => prev + (newIsBrandLiked ? 1 : -1));

    try {
      if (newIsBrandLiked) {
        await likeBrand(product.brand_id, user.user_id);
      } else {
        await unlikeBrand(product.brand_id, user.user_id);
      }
      // 브랜드 좋아요/취소 성공 시 로그
      trackEvent("brand_like", { // event_type을 "brand_like"로 변경
          brand_id: product.brand_id ? String(product.brand_id) : null,
          is_liked: newIsBrandLiked, // 스키마에 따라 'is_liked' 사용, 값은 boolean
      });
    } catch (err) {
      console.error('브랜드 좋아요 처리 실패:', err.response?.data || err.message);
      alert(`브랜드 좋아요 처리에 실패했습니다.`);
      setBrandLiked(originalIsBrandLiked); // 롤백
      setBrandLikeCount(prev => prev + (originalIsBrandLiked ? 1 : -1)); // 롤백
    } finally {
      setIsLikeActionLoading(false);
    }
  }, [user, product, brandLiked, isLikeActionLoading, navigate, trackEvent]);

  // --- 기존 핸들러들 (수정 없음 또는 최소 수정) ---
  const handleAddToCart = async () => {
    if (!user || !user.user_id) {
      alert('로그인이 필요합니다.');
      return navigate('/login');
    }
    if (!product) return;
    try {
      await addCartItem(user.user_id, productId, quantity);
      // 장바구니 담기 성공 시 로그
      trackEvent("add_to_cart", {
          product_id: String(productId),
          product_name: product.name || null,
          quantity: quantity,
          discounted_price: product.discounted_price || product.price,
      });
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
        <p className="text-sm text-gray-500">{major_category} &gt; {sub_category}</p>
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