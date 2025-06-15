import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // API 호출을 위한 axios 인스턴스
import { useTracking } from '../hooks/useTracking';

const Slider = (props) => {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sectionId, setSectionId] = useState(null); // 프로모션 그룹 ID
    const { trackEvent } = useTracking();

    const promotionLocation = "home_main_carousel"; // 배너 위치 고정값

    useEffect(() => {
        const fetchPromotions = async () => {
            setLoading(true);
            setError(null);
            setSectionId(null); // 데이터 로드 전 sectionId 초기화
            try {
                const response = await api.get('/promotion/active');
                const fetchedPromotions = response.data || [];
                setPromotions(fetchedPromotions);

                if (fetchedPromotions.length > 0) {
                    // brand_id를 API에서 받은 순서대로 조합 -> section_id 생성
                    const brandIds = fetchedPromotions.map(promo => promo.brand_id);
                    const currentSectionId = brandIds.join('_');
                    setSectionId(currentSectionId);

                    // promotion_view 이벤트 로깅
                    fetchedPromotions.forEach((promo, index) => {
                        trackEvent('promotion_view', {
                            promotion_id: promo._id,
                            // API 응답에 promotion_id가 있다면 promo.promotion_id 사용, 없다면 promo._id 사용
                            // 현재 스키마에서는 promotion_id를 사용하므로, 백엔드 응답에 해당 필드가 있는지 확인 필요.
                            // 만약 백엔드 응답의 고유 ID가 _id라면, 로그 스키마의 promotion_id 대신 _id를 사용하거나,
                            // 프론트에서 _id를 promotion_id로 매핑하여 전송해야 합니다.
                            // 여기서는 백엔드 응답의 _id를 promotion_id로 사용한다고 가정합니다.
                            location: promotionLocation, 
                            section_id: currentSectionId,
                            position: index,
                        });
                    });
                }
            } catch (e) {
                setError(e.message || '프로모션을 불러오는데 실패했습니다.');
                console.error("Failed to fetch promotions:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPromotions();
    }, [trackEvent]); // trackEvent를 의존성 배열에 추가

    const handlePromotionClick = (promo, index) => {
        if (!sectionId) return; // sectionId가 아직 설정되지 않았으면 클릭 이벤트 로깅하지 않음

        trackEvent('promotion_click', {
            promotion_id: promo._id,
            location: promotionLocation,
            section_id: sectionId,
            position: index,
            destination_url: promo.destination_url,
        });
    };

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
                    {promotions.map((promo, index) => (
                        <div key={promo._id} className="slider__item border rounded-lg shadow-lg overflow-hidden">
                            <Link 
                                to={promo.destination_url} 
                                state={{ promotionTitle: promo.title }}
                                onClick={() => handlePromotionClick(promo, index)}
                            >
                                <img
                                    src={promo.banner_image_url} // 정적 파일 경로 그대로 사용
                                    alt={promo.title}
                                    className="w-full aspect-video object-cover hover:opacity-90 transition-opacity"
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