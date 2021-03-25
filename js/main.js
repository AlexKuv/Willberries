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

// goods

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const gerGoods = async function () {
	const result = await fetch('db/db.json');
	if(!result.ok) {
		throw 'Ошибка:' + result.status;
	}
	return result.json();
};

const createCard = function (objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	<div class="goods-card">
						${objCard.label ? `<span class="label">${objCard.label}</span>` : ''}
						<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
						<h3 class="goods-title">${objCard.name}</h3>
						<p class="goods-description">${objCard.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id=${objCard.id}>
							<span class="button-price">$${objCard.price}</span>
						</button>
					</div>
	`;
	return card;
};

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);

	document.body.classList.add('show-goods');
};

more.addEventListener('click', event => {
	event.preventDefault();
	gerGoods().then(renderCards);
	document.querySelector('header').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
});

const buttonViewAllAccessories = document.querySelector('.card-1>button');
const buttonViewAllClothing = document.querySelector('.card-2>button');

buttonViewAllAccessories.addEventListener('click', event => {
	event.preventDefault();
	filterCards('category', 'Accessories');
	document.querySelector('header').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
});
buttonViewAllClothing.addEventListener('click', event => {
	event.preventDefault();
	filterCards('category', 'Clothing');
	document.querySelector('header').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
});



const filterCards = function (field, value) {
	gerGoods()
	.then(function(data) {
		const filteredGoods = data.filter(function (good) {
			return good[field] === value;
		});
		return filteredGoods;
	})
	.then(renderCards);
}

navigationLink.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault;
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);

		if (link.textContent === 'All') {
			gerGoods().then(renderCards);
		}
		
	})
});
