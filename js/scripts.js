document.addEventListener('DOMContentLoaded', () => {
    /**
     * Вычисляет величину скролла на странице
     * @returns {number}
     */
    const calcScroll = () => {
        let div = document.createElement('div');
        div.style.width = '500px';
        div.style.height = '500px';
        div.style.overflowY = 'scroll';
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }
    const toggleLockBody = () => {
        const body = document.body;
        body.classList.toggle('lock');
        const bodyScroll = calcScroll();
        if(body.classList.contains('lock')){
            body.style.marginRight = `${bodyScroll}px`;
        } else {
            body.style.marginRight = `0`;
        }
    }
    /**
     * Функция плавного скролла до элемента, чистая, работает как вверх, так и вниз (писал сам)))
     * @param element - ссылка на элемент
     * @param duration - продолжительность скролла в мс
     */
    const scrollToElement = (element, duration) => {
        let Id; //id анимации
        let start = performance.now();  //время старта
        let topPosition = element.getBoundingClientRect().top; //текущая позиция элемента
        let currentDocumentPosition = document.documentElement.scrollTop;//текущая прокрутка документа
        let progress = 0;           //прогресс анимации
        let animateScroll = () => {
            let now = performance.now();    //текущее время
            progress = (now - start) / duration;  //вычисляем прогресс
            if (progress <= 1) {
                document.documentElement.scrollTop = currentDocumentPosition + topPosition * progress;
                Id = requestAnimationFrame(animateScroll);
            } else {
                document.documentElement.scrollTop = currentDocumentPosition + topPosition;
                cancelAnimationFrame(Id);
            }
        };
        animateScroll();
    };

    const menuScroll = () => {
        const menu = document.querySelector('.menu');

        menu.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.closest('.menu-item');
            if (target) {
                const targetBlockId = target.querySelector('a').getAttribute('href').slice(1);
                const targetBlock = document.getElementById(targetBlockId);
                scrollToElement(targetBlock, 300);
            }
        });
    };
    menuScroll();

    /**
     * send POST-data by PHPMailer
     * @param body
     * @returns {Promise<Response>}
     */
    const postData = (body) => {
        return fetch('send.php', {
            body: body,
            method: 'POST',
        });
    };

    const openModal = (modal) => {
      modal.classList.remove('unblock');
      toggleLockBody();
        // document.body.style.overflow = 'hidden';
    };
    const closeModal = (modal) => {
        modal.classList.add('unblock');
        toggleLockBody();
        // document.body.style.overflow = 'auto';
    };

    const bindModalForm = () => {
        // forms
        const orderForms = document.querySelectorAll('.order-form');
        /**
         * send data from modal forms after submit
         * @param targetForm - form for binding(element)
         */
        const formSender = (targetForm) => {
            targetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(targetForm);
                const body = {};
                formData.forEach((item, index) => body[index] = item);
                // send data
                postData(JSON.stringify(body))
                    .then((response) => {
                        if (response.status !== 200) {
                            throw new Error('status not 200');
                        }
                        return response.text()
                    }).then((response) => {
                        targetForm.reset();
                        const modal = document.querySelector('.modal');
                        if(!modal.classList.contains('unblock')){
                            closeModal(modal);
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
            });
        };
        orderForms.forEach((item) => formSender(item));
    };
    bindModalForm();

    const bindModal = () => {
        const button = document.querySelector('.main-display__button');
        const modal = document.querySelector('.modal__overlay');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
        modal.addEventListener('click', (e) => {
            let target = e.target;
            const isModal = target.closest('.modal-content');
            if(!isModal){
                closeModal(modal);
            }
        })
    };
    bindModal();
});