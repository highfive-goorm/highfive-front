import React, { useEffect, useState } from 'react';
import productsData from '../api/products.json';
import { useAuth } from "../context/AuthContext"; // user_id 
import { Link } from 'react-router-dom';
import { fetchProducts, fetchBrands } from '../api/product'; // Mock api 

const Recommend = ({ element, title }) => {
    const [products, setProducts] = useState([]);
    const { user } = useAuth(); // useAuth로부터 user 객체 가져오기
    const user_id = user?.account;
    const [brands, setBrands] = useState({}); 

    /*
        // 초기 (local)
    useEffect(() => {
        // 추천 기준에 따라 필터링 또는 정렬
        const recommended = productsData
            .sort((a, b) => b.like_count - a.like_count) // 좋아요순 정렬
            .slice(0, 6); // 상위 6개만 표시

        setProducts(recommended);
    }, []);
    */  

    /*
        // 1차 가공 (fetchProducts - Mock api)
        useEffect(() => {
        const loadRecommended = async () => {
            try {
                const allProducts = await fetchProducts();
                const recommended = allProducts
                    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0)) // 좋아요 수 기준 정렬
                    .slice(0, 6); // 상위 6개만 표시
                setProducts(recommended);
            } catch (err) {
                console.error("추천 상품 로딩 실패:", err);
            }
        };

        loadRecommended();
    }, []);
    */ 

    // 2차 가공 (fetchBrands 추가 - Mock api)
        useEffect(() => {
        const loadRecommended = async () => {
            try {
                const [productData, brandData] = await Promise.all([
                    fetchProducts(),
                    fetchBrands()
                ]);


                // 브랜드 정보를 객체 형태로 가공: { brand_id(string): brand_kor }
                const brandMap = {};
                brandData.forEach(brand => {
                    brandMap[String(brand.id)] = brand.brand_kor;
                });
                setBrands(brandMap);

                // 추천 상품 정렬
                const recommended = productData
                    .sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
                    .slice(0, 6);

                setProducts(recommended);
            } catch (err) {
                console.error("데이터를 불러오는 중 오류 발생:", err);
            }
        };

        loadRecommended();
    }, []);


    // {user?.user_id ?? '고객'} 예외 처리 
    // null 또는 undefined 인 경우, '비회원'으로 대체
    return (
        <section id="cardType" className={`card__wrap ${element}`}>
            <h2>{title}</h2>
            <p className="card__sub__title">☁️ {user_id ?? '비회원'} 님을 위한 추천 상품입니다.</p>
            <div className="card__inner container">
                {products.map((product) => (
                    <article className="card" key={product.id}>
                        <figure className="card__header">
                            <Link to={`/product/${product.id}`}>
                            <img src={product.img_url} alt={product.name} />
                            </Link>
                        </figure>
                        <div className="card__body">
                            <h3 className="tit">{brands[String(product.brand_id)] ?? '브랜드 미지정'}</h3>
                            <p className="desc">{product.name}</p>
                            {product.discount > 0 && (
                                <p className="card__discount">{product.discount}% 할인</p>
                            )}
                            <p className="card__price">{product.price.toLocaleString()}원</p>

                            <a className="btn" href={`/product/${product.id}`}>
                                <span aria-hidden="true">
                                    <svg width="52" height="8" viewBox="0 0 52 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M51.3536 4.35355C51.5488 4.15829 51.5488 3.84171 51.3536 3.64645L48.1716 0.464466C47.9763 0.269204 47.6597 0.269204 47.4645 0.464466C47.2692 0.659728 47.2692 0.976311 47.4645 1.17157L50.2929 4L47.4645 6.82843C47.2692 7.02369 47.2692 7.34027 47.4645 7.53553C47.6597 7.7308 47.9763 7.7308 48.1716 7.53553L51.3536 4.35355ZM0 4.5H51V3.5H0V4.5Z" fill="#5B5B5B"/>
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