import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // API 호출을 위한 axios 인스턴스

const Slider = (props) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/promotion/active');
                setPromotions(response.data || []);
            } catch (e) {
                setError(e.message || '프로모션을 불러오는데 실패했습니다.');
                console.error("Failed to fetch promotions:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, []);

    if (loading) {
        return (
            <section id="sliderType" className={`slider__wrap ${props.element} py-8 text-center`}>
                <h2 className="text-xl font-semibold">프로모션 정보를 불러오는 중...</h2>
            </section>
        );
    }

    if (error) {
        return (
            <section id="sliderType" className={`slider__wrap ${props.element} py-8 text-center text-red-500`}>
                <h2 className="text-xl font-semibold">오류: {error}</h2>
            </section>
        );
    }

    if (!promotions || promotions.length === 0) {
        return (
            <section id="sliderType" className={`slider__wrap ${props.element} py-8 text-center`}>
                <h2 className="text-xl font-semibold">현재 진행중인 프로모션이 없습니다.</h2>
            </section>
        );
    }

    return (
        <section id="sliderType" className={`slider__wrap ${props.element}`}>
            <h2 className="text-2xl font-bold text-center mb-6">진행중인 프로모션</h2>
            <div className="slider__inner">
                {/* 여러 프로모션을 표시하기 위한 그리드 또는 플렉스 레이아웃 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                    {promotions.map((promo) => (
                        <div key={promo.id} className="slider__item border rounded-lg shadow-lg overflow-hidden">
                            <Link to={promo.destination_url} state={{ promotionTitle: promo.title }}>
                                <img
                                    src={promo.banner_image_url} // 정적 파일 경로 그대로 사용
                                    alt={promo.title}
                                    className="w-full aspect-square object-contain hover:opacity-90 transition-opacity"
                                />
                                <div className="p-4 bg-white">
                                    <h3 className="text-lg font-semibold truncate" title={promo.title}>{promo.title}</h3>
                                    {/* <p className="text-sm text-gray-600 line-clamp-2">{promo.description}</p> */}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {/* 
                  참고: 기존의 slider__arrow, slider__dot 등은 
                  실제 캐러셀 라이브러리(예: react-slick, swiper)를 사용하지 않으면 직접 구현해야 합니다.
                  여기서는 간단히 배너 목록을 표시하는 형태로 변경했습니다.
                  만약 캐러셀 기능이 필요하다면, 해당 라이브러리 연동이 필요합니다.
                */}
            </div>
        </section>
    );
};

export default Slider;