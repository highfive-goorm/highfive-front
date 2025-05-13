import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { fetchProducts, fetchBrands } from '../api/product'; // 변경된 부분

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState({});
  const [brand, setBrand] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [brandLiked, setBrandLiked] = useState(false);
  const [brandLikeCount, setBrandLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, brands] = await Promise.all([
          fetchProducts(),
          fetchBrands(),
        ]);

        const prod = products.find(p => String(p.id) === id);
        if (!prod) return;

        setProduct(prod);
        setLikeCount(prod.like_count ?? 0);

        const brandInfo = brands.find(b => String(b.id) === String(prod.brand_id));
        if (brandInfo) {
          setBrand(brandInfo);
          setBrandLikeCount(brandInfo.like_count ?? 0);
        }
      } catch (err) {
        console.error("상품 정보 불러오기 실패", err);
      }
    };

    fetchData();
  }, [id]);

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
            discounted_price: discountedPrice,
            price: price,
            img_url: product.img_url,
            quantity,
            discount: discount,
          },
        ],
        is_from_cart: false,
      }
    });
  };

  return (
  <div className="max-w-screen-lg mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
    {/* 좌측: 상품 이미지 */}
    <div className="w-full md:w-1/2">
      <img
        src={product.img_url}
        alt={product.name}
        className="w-full h-auto max-h-[600px] object-cover rounded"
      />
    </div>

    {/* 우측: 상품 상세 */}
    <div className="w-full md:w-1/2 space-y-4">
      {/* 브랜드 + 좋아요 */}
      <div className="flex items-center">
        <h3 className="text-lg font-semibold mr-2">{brand.brand_kor || product.brand}</h3>
        <button
          onClick={toggleBrandLike}
          className="text-gray-500 text-base"
        >
    {brandLiked ? '❤️' : '🤍'} {brandLikeCount.toLocaleString()}
  </button>
</div>

      {/* 카테고리 */}
      <p className="text-sm text-gray-500">{product.major_category} &gt; {product.sub_category}</p>

      {/* 상품명 */}
      <h2 className="text-2xl font-bold leading-snug">{product.name}</h2>

      {/* 성별 / 조회수 / 판매수 */}
      <p className="text-sm text-gray-600">
        성별: {product.gender} | 조회수: {product.view_count} | 판매 수: {product.purchase_count}
      </p>

      {/* 가격 */}
      <div className="space-y-1">
        {discount > 0 && (
          <p className="line-through text-gray-400 text-sm">{originalPrice}원</p>
        )}
        <p className="text-red-600 text-xl font-bold">
          {discountPercent} {displayDiscountedPrice}원
        </p>
      </div>

      {/* 수량 선택 */}
      <div className="flex items-center gap-3 pt-2">
        <span className="text-sm font-medium">수량</span>
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      {/* 좋아요 + 장바구니 + 구매 버튼 */}
      <div className="flex items-center gap-4 pt-4">
        <button onClick={toggleLike}>
          {liked ? '❤️' : '🤍'} {likeCount.toLocaleString()}
        </button>

        <button
          onClick={handleAddToCart}
          style={{
              padding: '0.5rem 1.0rem',
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
              padding: '0.5rem 1.0rem',
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