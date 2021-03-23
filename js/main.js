const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});


// card 

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', event => {
	let target = event.target;

	if(target.classList.contains('modal-close') || target.classList.contains('overlay')) {
		closeModal();
	}
});

// smooth scroll

const scrollLinks = document.querySelectorAll('a.scroll-link');

scrollLinks.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();
		const id = item.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
	});
});