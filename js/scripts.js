document.addEventListener('DOMContentLoaded', () => {
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
            if(target){
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

    const bindModalForm = () => {
        // forms
        const orderForms = document.querySelectorAll('.order-form');

        /**
         * send data from modal forms after submit
         * @param targetForm - modal for binding(element)
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
                    console.log(response);
                    targetForm.reset();
                }).catch((error) => {
                    console.error(error);
                });
            });

        };
        orderForms.forEach((item) => formSender(item));
    };
    bindModalForm();

});