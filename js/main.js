var mySwiperPortfolio = new Swiper('.portfolio__slider', {
	navigation: {
		nextEl: '.swiper-button-prev',
		prevEl: '.swiper-button-next',
	},
	slidesPerView: 1,
	speed: 400,
	loop: true,
	zoom: true,
	toggle: true,
	breakpoints: {
		320: {
			slidesPerView: 1
		},
		375: {
			slidesPerView: 1
		},
		700: {
			slidesPerView: 1
		},
		1100: {
			slidesPerView: 1
		}
	},
});
// mySwiperPortfolio.lazy.load();