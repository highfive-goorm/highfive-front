import React from 'react'

const Image = ( props ) => {

    return (
        <section id="imageType" className={`imageType__wrap ${props.element}`}>
            <h2>{props.title}</h2>
            <p>상품 리스트 유형입니다. 상품이 리스트로 진열되는 구조입니다.</p>

            <div className="image__inner container">
                <article className="image img1">
                    <h3 className="image__title">A 티셔츠</h3>
                    <p className="image__desc">최근 연예인들 사이에서 유명해진 의류 브랜드</p>
                    <a className="image__btn" href="/">자세히 보기</a>
                </article>
                <article className="image img2">
                    <h3 className="image__title">B 니트</h3>
                    <p className="image__desc">최근 연예인들 사이에서 유명해진 의류 브랜드</p>
                    <a className="image__btn yellow" href="/">자세히 보기</a>
                </article>
                <article className="image img3">
                    <h3 className="image__title">C 후드</h3>
                    <p className="image__desc">최근 연예인들 사이에서 유명해진 의류 브랜드</p>
                    <a className="image__btn black" href="/">자세히 보기</a>
                </article>
            </div>

        </section>
    )
}

export default Image