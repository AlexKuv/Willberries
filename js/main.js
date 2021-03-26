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
const buttonViewAllAccessories = document.querySelector('.card-1>button');
const buttonViewAllClothing = document.querySelector('.card-2>button');
const scrollLinks = document.querySelectorAll('a.scroll-link');
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const modalHeader = document.querySelector('.modal-header');


// добавление кнопки очистки корзины
const clearCardButton = () => {
	const clearButton = document.createElement('button');
		clearButton.textContent = 'Clear card';
		clearButton.className = 'clear-card';
		clearButton.style.cssText = `
		padding: 4px 10px;
				height: fit-content;
				margin-top: auto;
				margin-bottom: 7px;
				margin-right: 6px;
				border: 0.2px solid black;
				border-radius: 5px;
				background-color: red;
				color: #fff;
		`;
		modalHeader.append(clearButton);
};
clearCardButton();


const getGoods = async function () {
	const result = await fetch('db/db.json');
	if(!result.ok) {
		throw 'Ошибка:' + result.status;
	}
	return result.json();
};

const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
					<td>${name}</td>
					<td>${price}$</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price * count}$</td>
					<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);

		cartTableTotal.textContent = totalPrice + '$';
		const totalItems = this.cartGoods.reduce( (sum,item) => sum + item.count,0);
		cartCount.textContent = totalItems;
		if (totalItems === 0) {
			cartCount.textContent = '';
		}
		
	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods) {
			if(item.id === id) {
				if(item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for(const item of this.cartGoods) {
			if(item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
			.then(data => data.find(item => item.id ===id))
			.then(({id, name, price}) => {
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1,
				});
				this.renderCart();
			});
		}
	},
	clearCard() {
		this.cartGoods = [];
		this.renderCart();

	}
};

// получение созданной кнопки
const clearButton = document.querySelector('.clear-card');

clearButton.addEventListener('click', () => {
		cart.clearCard();
});


document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');

	if(addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}

});


cartTableGoods.addEventListener('click', event => {
	const target = event.target;
	if (target.classList.contains('cart-btn-delete')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.deleteGood(id);
	};
	if (target.classList.contains('cart-btn-minus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.minusGood(id);
	};
	if (target.classList.contains('cart-btn-plus')) {
		const id = target.closest('.cart-item').dataset.id;
		cart.plusGood(id);
	}
});

const openModal = () => {
	cart.renderCart();
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

const createCard = objCard => {
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

const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	longGoodsList.append(...cards);

	document.body.classList.add('show-goods');
};

more.addEventListener('click', event => {
	event.preventDefault();
	getGoods().then(renderCards);
	document.querySelector('header').scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		})
});

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
	getGoods()
	.then(data => data.filter( good => good[field] === value))
	.then(renderCards);
}

navigationLink.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault;
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);

		if (link.textContent === 'All') {
			getGoods().then(renderCards);
		}
		
	})
});

// form

const modalForm = document.querySelector('.modal-form');
const modal = document.querySelector('.modal');
const inputName = modalForm.querySelector('[placeholder="Имя"]');
const inputPhone = modalForm.querySelector('[placeholder="Телефон"]');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

inputPhone.addEventListener('input',() => {
	inputPhone.value = inputPhone.value.replace(/[^0-9]/,  '')
});

modalCart.addEventListener('submit', event => {
	event.preventDefault();
	
		if (inputName.value.trim() === '' || inputPhone.value === '') {
			alert('Пожалуйста заполните форму');
		} else if (cart.cartGoods.length === 0) {
			alert('Корзина пустая!');
		} else {
			const formData = new FormData(modalForm);
			formData.append('cart', JSON.stringify(cart.cartGoods));

			postData(formData)
			.then(response => {
				if(!response.ok) {
					throw new Error(response.status);
				}
				alert('Спасибо мы скоро с Вами свяжемся!');
			})
			.catch(error => {
				console.error(error);
				alert('Ошибка, повторите попытку позже!');
			})
			.finally(() => {
					closeModal();
					modalForm.reset();
					cart.cartGoods.length = 0;
					cartCount.textContent = '';
			});
		}
		

	
});
