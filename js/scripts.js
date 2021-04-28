document.addEventListener('DOMContentLoaded', () => {
    /*-------------- LIBRARY ---------------------------------------*/
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
        if (body.classList.contains('lock')) {
            body.style.marginRight = `${bodyScroll}px`;
        } else {
            body.style.marginRight = `0`;
        }
    }
    /**
     * Класс валидатор формы
     * передается id формы и массив объектов вида
     * {
            selector: 'form3-phone',
            method: 'phone',
            pattern:'//'
   },
     если pattern существует, то будет применен он, если нет, а передано имя метода (e-mail) например,
     то поле будет валидироваться встроенным методом
     */
    class Validator {
        constructor(form, elements = []) {
            this.form = form;
            this.elements = elements;
            this.errors = new Set();
        }

        init() {

            this.elements.forEach((item) => {
                this.checkIt(item);
            });
            if (!this.getErrorsCount()) {
                return false;
            } else {
                this.showErrors();
                return this.getErrors();
            }

        }
        getErrors(){
            return this.errors;
        }
        cleanErrors(){
            this.errors.clear();
        }
        getErrorsCount(){
            return this.errors.size;
        }
        showErrors(){
            this.errors.forEach(item => {
                item.element.style.border = '1px solid red';
                setTimeout(() => {
                    item.element.style.border = '';
                }, 2000);
            });
        }

        checkIt({element, pattern, method, type = 'text'}) {
            if(type === 'text'){
                if(pattern){
                    const value = element.value;
                    if(!pattern.test(value)){
                        this.errors.add({
                            element: element,
                            pattern: pattern,
                            method: method
                        });
                    }
                }else if(method){
                    const value = element.value;
                    if(this.getPattern(method) && !this.getPattern(method).test(value)){
                        this.errors.add({
                            element: element,
                            pattern: pattern,
                            method: method
                        });
                    }
                }
            } else if (type === 'checkbox'){
                if(!element.checked){
                    this.errors.add({
                        element: element,
                    })
                }
            }

        }

        getPattern(pattern) {
            const patterns = {
                email: new RegExp('^([a-z0-9\-_.]{2,30}@[a-z]{2,10}\.[a-z]{2,5})?$','i'),
                phone: new RegExp('^[\+]?[0-9)(]{7,11}$', 'i'),
                name: new RegExp('^[а-яё]{2,20}$', 'i'),
                message: new RegExp('[а-яё0-9.,:!?; \-]', 'ig'),
            };
            return patterns[pattern];
        }
    }
    class MaskPhone {
        constructor(element, country = 'rus') {
            try {
                this.element = element;
                this.country = country;
                this.masks = this.getMasks();
                if (!this.element) {
                    throw new Error('Masked element is underfined');
                }
            } catch (error) {
                console.error(error);
            }
            this.init();

        }
        countryMasks = {
            'rus': [
                '+7(___)___-__-__',
                '8(___)___-__-__'
            ],
            'bel': [
                '+375(__)___-__-__',
                '8(___)___-__-__'
            ],
        };

        getMasks() {
            if (this.country && this.countryMasks[this.country]) {
                return this.countryMasks[this.country];
            }
            return this.countryMasks['rus'];
        }

        selectMask(event) {
            const target = event.target;
            if(target.value.length === 1){
                const currentMask = this.masks.find(item => item[0] === target.value);
                if (currentMask){
                    this.maskPhone(this.element, currentMask);
                    let event = new Event("focus");
                    this.element.dispatchEvent(event);
                } else {
                    target.value = '';
                }
            }
        }
        init() {
            this.element.addEventListener('input', this.selectMask.bind(this));
        }
        maskPhone(element, masked = '+7 (___) ___-__-__') {
            function mask(event) {
                const keyCode = event.keyCode;
                const template = masked,
                    def = template.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, "");
                let i = 0,
                    newValue = template.replace(/[_\d]/g, function (a) {
                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                    });
                i = newValue.indexOf("_");
                if (i != -1) {
                    newValue = newValue.slice(0, i);
                }
                let reg = template.substr(0, this.value.length).replace(/_+/g,
                    function (a) {
                        return "\\d{1," + a.length + "}";
                    }).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                    this.value = newValue;
                }
                if (event.type == "blur" && this.value.length < 5) {
                    this.value = "";
                }

            }
            element.addEventListener("input", mask);
            element.addEventListener("focus", mask);
            element.addEventListener("blur", mask);

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

    const openModal = (modal) => {
        modal.classList.remove('unblock');
        toggleLockBody();
    };
    const closeModal = (modal) => {
        modal.classList.add('unblock');
        setTimeout(toggleLockBody, 200);
    };
    /*-------------- LIBRARY END---------------------------------------*/
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



    const bindModalForm = () => {
        // forms
        const orderForms = document.querySelectorAll('.order-form');
        /**
         * send data from modal and validate forms after submit
         * @param targetForm - form for binding(element)
         * @param validObject - object of Validator
         */
        const formSender = (targetForm, validObject) => {
            /**
             * send POST-data by PHPMailer
             * @param body
             * @returns {Promise<Response>}
             */
            const formMessage = targetForm.querySelector('.form__message');
            const postData = (body) => {
                return fetch('send.php', {
                    body: body,
                    method: 'POST',
                });
            };
            targetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!validObject.init()){
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
                        if (!modal.classList.contains('unblock')) {
                            closeModal(modal);
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
                } else {
                    validObject.showErrors();
                    formMessage.classList.add('show');
                    setTimeout(() => {
                        formMessage.classList.remove('show');
                    }, 2000);
                    validObject.cleanErrors();
                }


            });
        };
        /**
         * Привязываем формы
         */
        orderForms.forEach(item => {
            const phoneField = item.querySelector('.user-phone');
            const emailField = item.querySelector('.user-email');
            const message = item.querySelector('.user-message');
            formSender(item, new Validator(item, [
                {
                    element: phoneField,
                    pattern: new RegExp('[0-9()+ \-]', 'ig'),
                },
                {
                    element: emailField,
                    method: 'email'
                },
                {
                    element: message,
                    pattern: new RegExp('^[а-яёa-z., ]*$', 'i')
                }
            ]) );
        });
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
            if (!isModal) {
                closeModal(modal);
            }
        })
    };
    bindModal();

    const maskInputs = () => {
        const phoneInputs = document.querySelectorAll('.user-phone');
        const emailInputs = document.querySelectorAll('.user-email');
        const messageInputs = document.querySelectorAll('.user-message');

        phoneInputs.forEach(item => new MaskPhone(item, 'bel'));
        emailInputs.forEach(item => {
            item.addEventListener('input', (e) => {
                let val = e.target.value;
                val = val.replace(/[^a-z@\-._]/ig, '');
                e.target.value = val;
            });
        });
        messageInputs.forEach(item => {
            item.addEventListener('input', (e) => {
                let val = e.target.value;
                val = val.replace(/[^a-zа-я.,\- 0-9]/ig, '');
                e.target.value = val;
            });
        });
    };
    maskInputs();

});