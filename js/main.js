/*즉시 호출 함수 => 함수가 자동으로 호출
사용 이유 : 전역 변수 사용을 피하기 위해서*/
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 scene이 시작된 순간 true

    const sceneInfo = [{
        // 0
        type: 'sticky',
        heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
        scrollHeight: 0, // 씬의 전체 범위
        objs: {
            container: document.querySelector('#scroll-section-0'),
            messageA: document.querySelector('#scroll-section-0 .main-message.a'),
            messageB: document.querySelector('#scroll-section-0 .main-message.b'),
            messageC: document.querySelector('#scroll-section-0 .main-message.c'),
            messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            canvas: document.querySelector('#video-canvas-0'),
            context: document.querySelector('#video-canvas-0').getContext('2d'),
            videoImages: []
        },
        values: {
            videoImageCount: 300,
            imageSequence: [0, 299],
            // 다음 section으로 넘어갈 때 처리
            canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
            // 각 object마다 어떤 CSS 값을 어떤 값으로 넣을 건지 정의 (애니메이션 정보)
            messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
            messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
            messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
            messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
            messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
            messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
            messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
            messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
            messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
            messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
            messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
            messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
            messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
            messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
            messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }]
        }
    },
    {
        // 1
        type: 'normal',
        // heightNum: 5, // type normal에서는 필요 없음
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-section-1')
        }
    },
    {
        // 2
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-section-2'),
            messageA: document.querySelector('#scroll-section-2 .a'),
            messageB: document.querySelector('#scroll-section-2 .b'),
            messageC: document.querySelector('#scroll-section-2 .c'),
            pinB: document.querySelector('#scroll-section-2 .b .pin'),
            pinC: document.querySelector('#scroll-section-2 .c .pin'),
            canvas: document.querySelector('#video-canvas-1'),
            context: document.querySelector('#video-canvas-1').getContext('2d'),
            videoImages: []
        },
        values: {
            videoImageCount: 960,
            imageSequence: [0, 959],
            // 다음 section으로 넘어갈 때 처리
            canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
            canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
            messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
            messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
            messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
            messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
            messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
            messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
            messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
            messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
            messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
            messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
            pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
            pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }]
        }
    },
    {
        // 3
        type: 'sticky',
        heightNum: 5,
        scrollHeight: 0,
        objs: {
            container: document.querySelector('#scroll-section-3'),
            canvasCaption: document.querySelector('.canvas-caption'),
            canvas: document.querySelector('.image-blend-canvas'),
            context: document.querySelector('.image-blend-canvas').getContext('2d'),
            imagePath: [
                'images/blend-image-1.jpg',
                'images/blend-image-2.jpg'
            ],
            images: []
        },
        values: {
            /* 화면 크기를 예측할 수 없기 때문에 미리 값을 정할 수 가 없다. 
            -> 스크롤할 때 그 떄 바로 판단해서 계산 */
            rect1X: [0, 0, { start: 0, end: 0 }],
            rect2X: [0, 0, { start: 0, end: 0 }],
            rectStartY: 0
        }
    }
    ];

    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image();
            imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
            sceneInfo[0].objs.videoImages.push(imgElem);
        }

        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        }

        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.imagePath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagePath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    }
    setCanvasImages();

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // currentScene 자동 세팅(첫 화면과 새로 고침 할 때를 위해)
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        /*
        canvas의 크기를 조정하는 방법
        1. canvas의 width, height 자체를 script로 조절 -> canvas가 가진 픽셀수 자체를 바꾸는 것
        -> 게임처럼 모든 화면 자체가 전부다 보이는게 좋은 경우에 사용 
        2. css transform scale 조절 ✔
        -> 성능상 더 유리, 계산할 것이 적어짐
        */
        const heightRatio = window.innerHeight / 1080;
        // translate에서의 %는, 내 자신의 크기가 기준 
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        // currentYOffset : 현재 씬에서 얼마나 스크롤 됐는지
        let rv;
        // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        if (values.length === 3) {
            // start ~ end 사이의 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (partScrollStart <= currentYOffset && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            // 현재 씬의 전체 범위에서 애니메이션 실행
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log('0 play');
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                break;

            case 2:
                // console.log('2 play');
                let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                // section 이동할 때 부드러운 처리
                if (scrollRatio <= 0.5) {
                    // in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }

                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }

                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }

                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                break;

            case 3:
                // console.log('3 play');
                // 가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                // 비율에 따라서 canvas를 얼마나 크기 조절을 할지 다르게 결정
                if (widthRatio <= heightRatio) {
                    // 캔버스보다 브라우저 창이 홀쭉한 경우 
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.drawImage(objs.images[0], 0, 0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                /* window.innerWidth : 스크롤바까지 포함한 크기 (오차 발생)
                document.body.offsetWidth : 스크롤바를 제외한 크기 (오차 극뽁) */
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                // getBoundingClientRect() : 화면상에 있는 object에 크기와 위치를 가져올 수 있는 메소드
                if (!values.rectStartY) {
                    values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 좌우 흰색 박스 그리기 (x, y, width, height)
                // 정적 
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), recalculatedInnerWidth);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), recalculatedInnerWidth);
                // 동적 (animation)
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
                break;
        }
    }

    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
        // 현재 눈앞에 몇 번째 스크롤 섹션이 스크롤 중인지를 판별 
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            enterNewScene = true;
            if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (enterNewScene) return; // scene이 바뀌는 순간에 음수가 나오는 것을 방지 -> 찰나의 순간 방지 
        playAnimation();
    }


    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    /* 두 개의 차이
    DOMContentLoaded : html 객체들 DOM 구조만 로딩이 끝나면 바로 실행(이미지 같은 것은 로드가 안 되더라도) -> 그래서 더 빠름
    load : 웹 페이지에 있는 이미지 같은 리소스들까지 싹 다 로딩이 되고 나서 실행 */
    // window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        // 처음 문서를 load했을 때 보여주기 위함
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    });
    // 윈도우 창의 사이즈가 변할 때 같이 반응하도록 
    window.addEventListener('resize', setLayout);

    /* transition이 발생했을 때 제거
    화살표 함수를 사용했기 때문에 this를 사용할 수 없다.
    화살표 함수 안에서의 this는 전역객체를 가리킨다. */
    document.querySelector('.loading').addEventListener('transitionend', (e) => {
        document.body.removeChild(e.currentTarget); // currentTargt = loading
    });
})();