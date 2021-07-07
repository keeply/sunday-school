"use strict"

// обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function () {

	const form = document.getElementById('form');
	// при отправке формы - функция formSend
	form.addEventListener('submit', formSend);


	async function formSend(e) {
		// запрещается стандартная отправка формы при нажатии на кнопку
		e.preventDefault();
      // валидация формы
		let error = formValidate(form);

		// все данные полей формы	
		let formData = new FormData(form);
	
		if (error === 0) {
		   //form.classList.add('_sending');
			let response = await fetch('sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				// результат в формате json
				let result = await response.json();
				alert(result.message);
				// после отправки - форму очистить
				form.reset();
				//form.classList.remove('_sending');
			} else {
				alert("Ошибка");
				//form.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля');
		}

	}

   // функция проверки формы
	function formValidate(form) {
		let error = 0;
		// formReq - обязательные для заполнения поля
		let formReq = document.querySelectorAll('._req'); 

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			// перед проверкой объекта удаляю из него класс _error 
			formRemoveError(input);
			// проверка почты
			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			}else if (input.value === '') {
					formAddError(input);
					error++;
				}
		}
		return error;
	}

	// функция добавляет объекту и его родителю класс _error
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}
	// функция удаляет из объекта  и его родителю класс _error
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}
	// Функция проверки email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});
"use strict"

window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;


// проверка на каком устройстве открыта страница 
const isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	}
};

// если страница открыта на тачскрине добавляется класс _touch, на десктопе _pc
if (isMobile.any() ) {
   document.body.classList.add('_touch');
   // переменная для всех стрелок на странице 
   let menuArrows = document.querySelectorAll('.menu__arrow');
   if (menuArrows.length > 0) {
		//на каждую стрелку в массиве всех стрелок навесить событие click,
		//а родителю добавить класс _active
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			menuArrow.addEventListener("click", function(){
            menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

} else {
   document.body.classList.add('_pc');
}

//Меню-бургер
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');
if (iconMenu) {
		iconMenu.addEventListener("click", function(e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle("_active");
		menuBody.classList.toggle("_active");
	});

}


const popupLinks = document.querySelectorAll('.popup-link');
// переменная для активного попапа - который уже открыт
const popupActive = document.querySelector('.popup.open');

// проверка есть ли такие ссылки - все объекты с классом popup-link
if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			// убираю # из значения href
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const currentPopup = document.getElementById(popupName);
			// полученный объект отправляю в функцию popupOpen
			popupOpen(currentPopup);
			// запрещаю ссылке перезагружать страницу
			e.preventDefault();
		});
	}
}

// переменная для всех объектов с классом close-popup (будут закрывать попап при клике)
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			// отправляю объект, который является ближайшим родителем ссылки, в функцию popupClose 
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

// функция открытия попапа
function popupOpen(currentPopup) {
	
	// проверка наличия попапа и открыт ли он
	if (currentPopup) {
		// к текущему попапу добавляю класс open и он открывается
		currentPopup.classList.add('open');
		////////////// закрытие попапа при клике на темную область //////////////////
		currentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}

// функция закрытия текущего попапа 
function popupClose(popupActive) {

	popupActive.classList.remove('open');
}

// закрытие попапа при нажатии esc
document.addEventListener('keydown', function (e) {
	if (e.code == 'Escape' ) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

// полифиллы для поддержки в старых браузерах closest, matches
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();

// Добавление Яндекс карты

	ymaps.ready(init);
	function init() {
			var myMap = new ymaps.Map("map", {
			// Координаты центра карты.
			controls: [],
			center: [55.7041336, 37.5127628],
			zoom: 13
		});
		var myPlacemark = new ymaps.Placemark([55.7041336, 37.5127628],{
			balloonContentHeader: 'Sunday School',
			balloonContentBody: 'Ломоносовский проспект, 29к1',
			balloonContentFooter: '+ 7 (495) 645-27-40',
			hasBalloon: true});
		
		myMap.geoObjects.add(myPlacemark);
	}


// Initialize and add the Google map
// function initMap() {
//   // The location of Uluru
//   const uluru = { lat: 55.7041336, lng: 37.5127628 };
//   // The map, centered at Uluru
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 10,
//     center: uluru,
//   });
//   // The marker, positioned at Uluru
//   const marker = new google.maps.Marker({
//     position: uluru,
//     map: map,
//   });
// }




let count = 0;
let width;
const container = document.querySelector('.gallery__container');
const track = document.querySelector('.slider-track');
const items = document.querySelectorAll('.slider-track img');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

function calcWidth() {
    width = container.offsetWidth;
    track.style.width = width * items.length + 'px';
    items.forEach(item => {
        item.style.width = width + 'px';
        item.style.height = 'auto';
    });
    rollSlider();
}

calcWidth();

//при изменении размера представления документа/окна - вызвать calcWidth
window.addEventListener('resize', calcWidth);

document.querySelector('.btn-next').addEventListener('click', function () {
    count++;
    if (count >= items.length) {
        count = 0;
    }
    rollSlider(); // при изменении размеров экрана пересчитывает смещение и ширину
});

document.querySelector('.btn-prev').addEventListener('click', function () {
    count--;
    if (count < 0) {
        count = items.length - 1;
    }
    rollSlider();
});

function rollSlider() {
	// перемещает на ширину одного слайда
	track.style.transform = 'translate(-' + count * width + 'px)';

}

