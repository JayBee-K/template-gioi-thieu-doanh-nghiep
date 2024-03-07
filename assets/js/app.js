var windowWidth = document.documentElement.clientWidth;
window.addEventListener("resize", () => {
	windowWidth = document.documentElement.clientWidth;
});

let handleApplyCollapse = function ($parent, $firstItem = false, $callFunction = false) {
	let $childUl = $parent.find('> li > ul');
	if ($childUl.length === 0) {
		return;
	}

	if ($callFunction) {
		$parent.find('> li a').each(function () {
			$(this).attr('data-href', $(this).attr('href'))
		});
	}

	if (windowWidth <= 991) {

		let $objParentAttr = {};
		let $objChildrenAttr = {
			'data-bs-parent': '#' + $parent.attr('id')
		}

		if ($firstItem) {
			let $parentID = 'menu-' + Math.random().toString(36).substring(7);
			$parent.attr('id', $parentID);
			$objParentAttr = {
				'data-bs-parent': '#' + $parentID
			}

			$objChildrenAttr = {};
		}

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');
			let $parentListItemAnchor = $parentListItem.children('a');

			let $parentUlID = 'menu-' + Math.random().toString(36).substring(7);

			$parentUl.addClass('collapse').attr({
				'id': 'collapse-' + $parentUlID, ...$objParentAttr, ...$objChildrenAttr
			});

			$parentListItemAnchor.replaceWith(function () {
				return `<button aria-label="${$parentListItemAnchor.attr('aria-label')}" data-href="${$parentListItemAnchor.attr('data-href')}" data-bs-toggle="collapse" data-bs-target="#${$parentUl.attr('id')}">${$parentListItemAnchor.html()}</button>`
			})

			handleApplyCollapse($parentUl, false);

			$parentUl.on('show.bs.collapse', function () {
				$parent.find('.collapse.show').not($parentUl).collapse('hide');
			});
		});
	} else {
		$parent.removeAttr('id');

		$childUl.each(function () {
			let $parentUl = $(this).closest('ul');
			let $parentListItem = $(this).closest('li');

			$parentUl.removeClass('collapse').removeAttr('data-bs-parent id');
			$parentListItem.children('a').attr('href', $parentListItem.children('a').attr('data-href'));

			$parentListItem.children('button').replaceWith(function () {
				return `<a aria-label="${$(this).attr('aria-label')}" href="${$(this).attr('data-href')}" data-href="${$(this).attr('data-href')}">${$(this).html()}</a>`
			})

			handleApplyCollapse($parentUl);
		});
	}
}

let handleCallMenu = function () {
	const $body = $('body');
	const handleBody = function ($toggle = false) {
		if ($body.hasClass('is-navigation')) {
			$body.removeClass('is-navigation');
			if ($body.hasClass('is-overflow')) {
				$body.removeClass('is-overflow');
			}

			$('#header-navigation ul').collapse('hide');
		} else {
			if ($toggle) {
				$body.addClass('is-navigation is-overflow')
			}
		}
	}

	if (windowWidth <= 991) {
		const $hamburger = $('#hamburger-button');
		if ($hamburger.length) {
			$hamburger.click(function () {
				handleBody(true)
			});
		}

		const $overlay = $('#header-overlay');
		if ($overlay.length) {
			$overlay.click(function () {
				handleBody();
			});
		}
	} else {
		handleBody();
	}
}

const handleStickHeader = function () {
	$(window).scroll(function (e) {
		if ($(document).scrollTop() > $('#header').innerHeight()) {
			$('#header').addClass('is-scroll');
		} else {
			$('#header').removeClass('is-scroll');
		}
	});
}


const handleCopyValue = function () {
	const copyButtons = document.querySelectorAll('.button-copy');
	if (copyButtons) {
		copyButtons.forEach(function (copyButton) {
			copyButton.addEventListener('click', function () {
				const valueToCopy = copyButton.getAttribute('data-value');

				const tempTextArea = document.createElement('textarea');
				tempTextArea.style.cssText = 'position: absolute; left: -99999px';
				tempTextArea.setAttribute("id", "textareaCopy");
				document.body.appendChild(tempTextArea);

				let textareaElm = document.getElementById('textareaCopy');
				textareaElm.value = valueToCopy;
				textareaElm.select();
				textareaElm.setSelectionRange(0, 99999);
				document.execCommand('copy');

				document.body.removeChild(textareaElm);

				if (copyButton.getAttribute('data-bs-toggle') === 'tooltip') {
					copyButton.setAttribute('title', 'Đã sao chéo');

					const tooltip = bootstrap.Tooltip.getInstance(copyButton);
					tooltip.setContent({'.tooltip-inner': 'Đã sao chéo'})
				}
			});
		})
	}
}

const handleInitFancybox = function () {
	if (windowWidth <= 991 && $('.initFancybox').length) {
		$('.initFancybox').each(function () {
			let elm = $(this);
			Fancybox.bind(`[data-fancybox=${elm.attr('data-fancybox')}]`, {
				thumbs: {
					autoStart: true,
				},
			});
		});
	}
}

const handleTranslateService = function () {
	if ($('#handleTranslateService').length && $('#handleTranslateService .handleTranslateServiceItem').length) {
		$('#handleTranslateService .handleTranslateServiceItem').each(function () {
			let innerHeightText = $(this).find('.handleTranslateServiceItemText').innerHeight();
			$(this).css('--translate', innerHeightText + 'px');
		});
	}
}

const handleCounter = function () {
	if ($('#handleCounter').length && $('#handleCounter .handleCounterItem').length) {
		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('#handleCounter').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('#handleCounter .handleCounterItem').each(function () {
					let counterItem = $(this),
						counterItemValue = counterItem.attr('data-value');
					$({countNum: counterItem.text()}).animate(
						{countNum: counterItemValue},
						{
							duration: 2000,
							easing: 'swing',
							step: function () {
								counterItem.text(Math.floor(this.countNum));
							},
							complete: function () {
								counterItem.html(this.countNum.toString());
							}
						});
				});
				i = 1;
			}
		});
	}
}
const handleProgress = function () {
	if ($('#handleProgress').length && $('#handleProgress .handleProgressItem').length) {
		let i = 0;
		$(window).scroll(function () {
			let counterOffsetTop = $('#handleProgress').offset().top - window.innerHeight;
			if (i === 0 && $(window).scrollTop() > counterOffsetTop) {
				$('#handleProgress .handleProgressItem').each(function () {
					$(this).css("width", function () {
						return $(this).attr("data-value") + "%";
					})
				});
				i = 1;
			}
		});
	}
}

const handleMagicServiceCategory = function () {
	const handleMagicService = $('#handleMagicService');
	const magicServiceFilter = $('.magicServiceFilter');

	if (handleMagicService.length && magicServiceFilter.length) {
		const fixHeightIsotopeItem = (handleMagicService) => {
			let setHeight = 0;
			handleMagicService.find('.magicServiceItem').each((_, element) => {
				const target = $(element);
				setHeight = Math.max(setHeight, target.innerHeight());
			});


			handleMagicService.find('.magicServiceItem').each((_, element) => {
				const target = $(element);
				target.innerHeight(setHeight);
			});
		}
		const magicCategory = () => {
			fixHeightIsotopeItem(handleMagicService);

			handleMagicService.isotope({
				itemSelector: '.magicServiceItem',
				filter: '*',
				layoutMode: 'fitRows',
				percentPosition: true,
				resize: true,
				masonry: {
					columnWidth: '.magicServiceItem'
				},
			});

			magicServiceFilter.click(function () {
				$(this).siblings().removeClass('active');
				$(this).addClass('active');
				handleMagicService.isotope({filter: $(this).attr('data-filter')});
			});
		}
		magicCategory();
	}
}

$(function () {
	handleApplyCollapse($('#header-navigation > ul'), true, true);
	handleCallMenu();
	$(window).resize(function () {
		handleApplyCollapse($('#header-navigation > ul'));
		handleCallMenu();
	})
	handleStickHeader();
	handleCopyValue();
	handleInitFancybox();

	if ($('#slider-hero').length) {
		new Swiper('#slider-hero .swiper', {
			speed: 1000,
			autoplay: {
				delay: 8000,
				disableOnInteraction: true,
			},
			loop: true,
			slidesPerView: 1,
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			pagination: {
				el: '#slider-hero .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			}
		});
	}

	if ($('#slider-logos').length) {
		new Swiper('#slider-logos .swiper', {
			speed: 1000,
			spaceBetween: 15,
			autoplay: {
				delay: 6000,
				disableOnInteraction: true,
			},
			breakpoints: {
				1359: {
					slidesPerView: 6.5,
				},
				991: {
					slidesPerView: 4.5,
				},
				768: {
					slidesPerView: 3.5,
				},
				375: {
					slidesPerView: 2.5,
				},
				320: {
					slidesPerView: 1,
				}
			},
		});
	}

	if ($('#slider-testimonials').length) {
		new Swiper('#slider-testimonials .swiper', {
			speed: 1000,
			spaceBetween: 15,
			autoplay: {
				delay: 6000,
				disableOnInteraction: true,
			},
			breakpoints: {
				1359: {
					slidesPerView: 3,
				},
				768: {
					slidesPerView: 2,
				},
				375: {
					slidesPerView: 1,
				},
				320: {
					slidesPerView: 1,
				}
			},
			pagination: {
				el: '#slider-testimonials .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			}
		});
	}

	if ($('#slider-relatedService').length) {
		new Swiper('#slider-relatedService .swiper', {
			speed: 1000,
			spaceBetween: 15,
			autoplay: {
				delay: 6000,
				disableOnInteraction: true,
			},
			breakpoints: {
				1359: {
					slidesPerView: 4,
				},
				768: {
					slidesPerView: 2,
				},
				375: {
					slidesPerView: 1,
				},
				320: {
					slidesPerView: 1,
				}
			},
			pagination: {
				el: '#slider-relatedService .slider-pagination',
				type: 'bullets',
				bulletClass: 'slider-pagination_item',
				clickable: true,
			}
		});
	}

	handleTranslateService()
	handleCounter();
	handleProgress();
	handleMagicServiceCategory();
});