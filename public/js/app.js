window.addEventListener('load', async e => {
	
	if ('serviceWorker' in navigator) {
		try {
			console.log('can register service worker but I\'wont B)');
			// await navigator.serviceWorker.register('sw.js');
		} catch (error) {
			console.log('SW reg failed.');
		}
	}
	
});

var food = {};
var cart = {};

window.fn = {};
		
window.fn.open = function() {
	var menu = document.getElementById('menu');
	menu.open();
};

window.fn.load = function(page) {
	var menu = document.getElementById('menu');
	var mainNavigator = document.getElementById('mainNavigator');

	menu.close();
	mainNavigator.resetToPage(page, {animation: 'Fade'});
};

document.addEventListener('init', async ev => {
	var page = ev.target;

	if (page.id === 'main-menu') {
		await getMainMenu();
		loadMainMenu();
	}
	
	else if (page.id === 'sub-menu') {
		let menuSection = (page.data && page.data.cardTitle) ? page.data.cardTitle : 'Sub Menu';
		page.querySelector('ons-toolbar div.center').textContent = menuSection;
		
		loadSubMenu(page.data.cardTitle.trim());
	}

	else if (page.id === 'description') {
		loadDescription(page.data.id);
		
		// food carousel
		page.querySelector('#carousel').addEventListener('postchange', function() {
			page.querySelector('#dot0').classList.remove('circle_current');
			page.querySelector('#dot1').classList.remove('circle_current');
			page.querySelector('#dot2').classList.remove('circle_current');

			page.querySelector('#dot' + page.querySelector('#carousel').getActiveIndex()).classList.add("circle_current");
		});
	}

	else if (page.id === 'cart') {
		console.log(cart);
		loadCart();
	}

	else if (page.id === 'track') {

	}

	else if (page.id === 'prevorder') {

	}

	else if (page.id === 'about') {

	}

	else if (page.id === 'faq') {

	}

	else if (page.id === 'logout') {

	}

	else if (page.id === 'login') {
		console.log('login page loaded');
		document.getElementById("login-form").addEventListener('submit', function (ev) {
			ev.preventDefault();
			console.log(this);
			
			let ajaxRequest = new XMLHttpRequest();
			ajaxRequest.open("POST", "/users/login");
			let formData = {
				username: this["username"].value,
				password: this["password"].value
			};
			ajaxRequest.send(formData);

			ajaxRequest.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				  cFunction(this);
				}
			};
			ajaxRequest.onload = function (ev) {
				console.log("resposne: " + ajaxRequest.response);
			}
		});
	}

});

var customPush = function (event) {
	loadPage(event, 'sub-menu.html', {cardTitle: event.target.textContent});
};

var loadPage = function (event, page, data) {
	mainNavigator.pushPage(page, {data: data});
};

async function getMainMenu() {
	const res = await fetch(`https://my-json-server.typicode.com/GOPINATHREDDY/tastebuds-data/blob/master/food`);
	const json = await res.json();
	
	let tfood = {};
	for (i = 0; i < json.length; i++) {
		let item = json[i];
		try {
			tfood[item.food_type].push(item);
		} catch (error) {
			tfood[item.food_type] = [item];
		}
	}
	food = tfood;
}

function loadMainMenu() {
	let menu = document.getElementById('menu-items');
	menu.innerHTML = (Object.keys(food)).map(createMenuEntry).join('\n');
}

function loadSubMenu(subMenuId) {
	let subMenu = document.getElementById('sub-menu-items');
	subMenu.innerHTML = (food[subMenuId]).map(createSubMenuEntry).join('\n');
}

async function loadDescription(itemId) {
	const res = await fetch(`https://my-json-server.typicode.com/GOPINATHREDDY/tastebuds-data/blob/master/food?id=${itemId}`);
	const Json = await res.json();

	json = Json[0];
	let itemIntro = document.getElementById('item-intro');
	let itemDesc = document.getElementById('item-description');
	let addtoCart = document.getElementById('add-to-cart');
	let checkOut = document.getElementById('check-out');

	itemIntro.innerHTML = `${json.foodname} <span style="float: right;"> &#8377; ${json.price} </span> <br> ${json.rating} &#9733;`;
	itemDesc.innerHTML = json.description;
	addtoCart.addEventListener('click', ev => {
		console.log(`${json.foodname}`);
		addToCart(json.foodname);
	});
	checkOut.addEventListener('click', ev => {
		loadPage(ev, 'cart.html', {});
	})
}

function loadCart() {
	let cartHolder = document.getElementById('cart-holder');
	cartHolder.innerHTML = Object.keys(cart).map(createCartEntry).join('\n');
}

function createMenuEntry(item) {
	return `<ons-list-item class='main-menu-entry' onclick="loadPage(event, 'sub-menu.html', {cardTitle: '${item}'})" tappable> 
			${item} 
		</ons-list-item>`;
}

function createSubMenuEntry(item) {
	return `<ons-list-item class='sub-menu-entry' onclick="loadPage(event, 'description.html', {id: ${item.id}})" tappable>
			${item.foodname}
		</ons-list-item>`;
}

function updateCounter(idx) {
	let counter_id = 'cart_counter_' + idx;
	let elem = document.getElementById(counter_id);
	elem.innerHTML = cart[idx];
}

function increment(idx) {
	let limit = function (x) {
		return (x<11 && x) || 10;
	};
	cart[idx] = limit(cart[idx] + 1);
	updateCounter(idx);
}

function decrement(idx) {
	let limit = function (x) {
		return (x>0 && x) || 1;
	};
	cart[idx] = limit(cart[idx] - 1);
	updateCounter(idx);
}

function createCartEntry(item) {
	let counter_id = 'cart_counter_' + item;
	let increment_button = `<ons-button onclick="increment('${item}');">+</ons-button>`;
	let decrement_button = `<ons-button onclick="decrement('${item}');">-</ons-button>`;
	let counter = `<div id='${counter_id}'>${cart[item]}</div>`;
	return `<ons-list-item> ${item} => ${counter} ${increment_button} ${decrement_button} </ons-list-item>`;
}

function addToCart(item) {
	cart[item] = cart[item] || 1;
	console.log(`${item} added to cart`);
}

function removeFromCart(item) {
	delete cart[item];	
}

function PlaceOrder() {
	var order = {
		cart: cart,
		user: "sunny"
	};
	console.log(order);
	$.post("orders", order, function (data, status) {
		console.log(data);
		console.log(status);
	});
}