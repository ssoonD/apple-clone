/*즉시 호출 함수 => 함수가 자동으로 호출
사용 이유 : 전역 변수 사용을 피하기 위해서*/
(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)

    const sceneInfo = [{
            // 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0')
            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for (let i = 0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
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
    }

    function scrollLoop() {
        prevScrollHeight = 0;
        // 현재 눈앞에 몇 번째 스크롤 섹션이 스크롤 중인지를 판별 
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if (yOffset < prevScrollHeight) {
            if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
    }


    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    /* 두 개의 차이
    DOMContentLoaded : html 객체들 DOM 구조만 로딩이 끝나면 바로 실행(이미지 같은 것은 로드가 안 되더라도) -> 그래서 더 빠름
    load : 웹 페이지에 있는 이미지 같은 리소스들까지 싹 다 로딩이 되고 나서 실행 */
    // window.addEventListener('DOMContentLoaded', setLayout);
    window.addEventListener('load', setLayout);
    // 윈도우 창의 사이즈가 변할 때 같이 반응하도록 
    window.addEventListener('resize', setLayout);

})();