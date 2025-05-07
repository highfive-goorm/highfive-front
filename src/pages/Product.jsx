import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Product() {
  const { id } = useParams(); // URL에서 상품 ID 추출
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인 상태 확인

  const [product, setProduct] = useState(null); // 상품 정보
  const [quantity, setQuantity] = useState(1); // 수량
  const [showAlert, setShowAlert] = useState(false); // 장바구니 alert

  // 더미 상품 데이터 가져오기 (API 대체용)
  useEffect(() => {
    const fetchData = async () => {
      const dummyProduct = {
        id,
        gender: '남성',
        page_view_total: 1200,
        purchase_total: 300,
        brand: '트릴리온',
        brand_likes: 210000,
        major_category: '상의',
        sub_category: '긴소매 티셔츠',
        name: '얇플 링 스냅 헨리넥 롱 슬리브 [블랙]',
        price: 38000,
        discount: 0.22,
        likes: 8100,
        img_url: 'https://image.msscdn.net/thumbnails/images/goods_img/20220210/2353071/2353071_2_big.jpg?w=1200',
      };
      setProduct(dummyProduct);
    };

    fetchData();
  }, [id]);

  if (!product) return <p>로딩 중...</p>;

  // 안전한 값 처리
  const price = product.price ?? 0;
  const discount = product.discount ?? 0;
  const brandLikes = product.brand_likes ?? 0;
  const likes = product.likes ?? 0;

  const discountedPrice = (price * (1 - discount)).toLocaleString();
  const originalPrice = price.toLocaleString();
  const discountPercent = `${Math.round(discount * 100)}%`;

  // 장바구니 클릭 시
  const handleAddToCart = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/cart', {
        user_id: user.account,
        product_id: product.id,
        quantity,
      });
      console.log(user.account, product.id, quantity);
      setShowAlert(true);
    } catch (error) {
      alert('장바구니 담기에 실패했습니다.');
    }
  };

  return (
    <div className="product-detail-page" style={{ display: 'flex', padding: '2rem' }}>
      {/* 좌측: 이미지 및 간단 정보 */}
      <div style={{ flex: 1 }}>
        <img src={product.img_url} alt={product.name} width="100%" />
        <p>성별: {product.gender}</p>
        <p>조회수: {product.page_view_total}</p>
        <p>누적 판매 수: {product.purchase_total}</p>
      </div>

      {/* 우측: 상세 정보 */}
      <div style={{ flex: 1, marginLeft: '3rem' }}>
        {/* 브랜드명 + 좋아요 */}
        <div style={{ marginBottom: '0.5rem' }}>
          <h3 style={{ display: 'inline-block', marginRight: '0.5rem' }}>{product.brand}</h3>
          <span style={{ fontSize: '1rem', color: 'gray' }}>
            ❤️ {brandLikes.toLocaleString()}
          </span>
        </div>

        {/* 카테고리 & 상품명 */}
        <p style={{ color: 'gray', margin: '0.5rem 0' }}>
          {product.major_category} &gt; {product.sub_category}
        </p>
        <h2 style={{ fontWeight: 'bold' }}>{product.name}</h2>

        {/* 가격 정보 */}
        <div style={{ marginTop: '1rem' }}>
          <p style={{ textDecoration: 'line-through', color: 'gray' }}>{originalPrice}원</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#ff003e' }}>
            {discountPercent} {discountedPrice}원
          </p>
        </div>

        {/* 수량 선택 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
          <span style={{ marginRight: '1rem' }}>수량</span>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span style={{ margin: '0 1rem' }}>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* 좋아요 + 장바구니 + 구매 */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', gap: '1rem' }}>
          <div>❤️ {likes.toLocaleString()}</div>
          <button onClick={handleAddToCart} style={{ padding: '0.5rem 1rem' }}>장바구니</button>
          <button onClick={() => navigate('/checkout')} style={{ padding: '0.5rem 1rem', backgroundColor: 'black', color: 'white' }}>구매하기</button>
        </div>

        {/* 장바구니 alert */}
        {showAlert && (
          <div className="custom-alert" style={{ marginTop: '1rem' }}>
            <p>장바구니에 담았습니다.</p>
            <button onClick={() => navigate('/cart')}>장바구니 이동</button>
            <button onClick={() => setShowAlert(false)}>계속 쇼핑</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
