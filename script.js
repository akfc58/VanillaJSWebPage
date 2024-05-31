'use strict';

// global
const nav = document.querySelector('.nav');

// Modal window
const modalWindowFunction = function () {
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

  const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  btnsOpenModal.forEach(button => {
    button.addEventListener('click', openModal);
  });
  // for (let i = 0; i < btnsOpenModal.length; i++)
  //   btnsOpenModal[i].addEventListener('click', openModal);

  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
};
modalWindowFunction();

const scrollButtonFunction = function () {
  const btnScrollTo = document.querySelector('.btn--scroll-to');
  const section1 = document.querySelector('#section--1');

  btnScrollTo.addEventListener('click', function (e) {
    // console.log(e.target.getBoundingClientRect());
    // const s1coords = section1.getBoundingClientRect();
    // console.log(s1coords);
    // window.scrollTo({
    //   left: s1coords.left + window.scrollX,
    //   top: s1coords.top + window.scrollY,
    //   behavior: 'smooth',
    // });
    // modern way
    section1.scrollIntoView({ behavior: 'smooth' });
  });
};
scrollButtonFunction();

// Page Nav
const pageNavFunction = function () {
  const navLinks = document.querySelector('.nav__links');
  navLinks.addEventListener('click', function (e) {
    e.preventDefault();
    // console.log(this);
    // console.log(e.target);
    if (e.target === this || e.target.classList.contains('btn--show-modal')) {
      return;
    }
    const desID = e.target.getAttribute('href'); //id of des
    console.log(desID);
    document.querySelector(desID).scrollIntoView({ behavior: 'smooth' });
  });

  //Tabbed component
  const tabs = document.querySelectorAll('.operations__tab');
  const tabsContainer = document.querySelector('.operations__tab-container');
  const tabsContent = document.querySelectorAll('.operations__content');

  tabsContainer.addEventListener('click', function (e) {
    // click on tab or inner element.
    const clicked = e.target.closest('.operations__tab');
    // console.log(clicked);
    if (!clicked) return; // exclude clicked on container.

    //remove active for all elements.
    tabs.forEach(function (el) {
      el.classList.remove('operations__tab--active');
    });
    tabsContent.forEach(function (el) {
      // console.log(el);
      el.classList.remove('operations__content--active');
    });
    // add active for clicked tab element.
    clicked.classList.add('operations__tab--active');
    // console.log(tabsContent);
    // add active for related content.
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
};
pageNavFunction();

// menu fade animation
const menuFadeFunction = function () {
  function changeOpacity(opacity, e) {
    if (e.target.classList.contains('nav__link')) {
      // console.log(e.target);
      const clicked = e.target;
      const siblings = clicked.closest('.nav').querySelectorAll('.nav__link'); // no problem to choose a higher parent.
      const logo = clicked.closest('.nav').querySelector('img');
      siblings.forEach(el => {
        if (el !== clicked) {
          el.style.opacity = opacity;
        }
      });
      logo.style.opacity = opacity;
    }
  }
  // mouseover bubbles up.
  nav.addEventListener('mouseover', changeOpacity.bind(null, 0.5));
  nav.addEventListener('mouseout', changeOpacity.bind(null, 1));
};
menuFadeFunction();

//sticky nav-bar using intersect observe API.
const stickyNavFunction = function () {
  const obsCallbackForNav = function (entries) {
    entries.forEach(entry => {
      // console.log(entry);
      if (entry.isIntersecting) {
        document.querySelector('.nav').classList.remove('sticky');
      } else {
        document.querySelector('.nav').classList.add('sticky');
      }
    });
  };
  const navHeight = nav.getBoundingClientRect().height;
  const observerForNav = new IntersectionObserver(obsCallbackForNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });
  const header = document.querySelector('.header');
  // console.log(header);
  observerForNav.observe(header);
};
stickyNavFunction();

// nice revealling animation effect for every section.
const niceRevealling = function () {
  const allSections = document.querySelectorAll('.section');
  // console.log(allSections);
  const obsCallbackForSection = function (entries, observer) {
    // console.log(entries);
    const [entry] = entries; // only 1 entry(0.2);
    // console.log(entry);
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };
  const observerForSections = new IntersectionObserver(obsCallbackForSection, {
    root: null,
    threshold: 0.2,
    // rootMargin: `200px`,
  });
  allSections.forEach(section => {
    observerForSections.observe(section); // add the same observer for each section
    // section.classList.add('section--hidden');
  });
  observerForSections.observe(nav);
};
niceRevealling();

//lazy loading
const lazyLoading = function () {
  const allLazyImages = document.querySelectorAll('.lazy-img');

  const obsCallbackForLazyImage = function (entries, observer) {
    // console.log(entries);
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function (e) {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  };
  const observerForLazyImages = new IntersectionObserver(
    obsCallbackForLazyImage,
    {
      root: null,
      threshold: 0.2,
    }
  );

  allLazyImages.forEach(img => {
    observerForLazyImages.observe(img);
  });
};
lazyLoading();

// slider section.
const sliderSection = function () {
  // const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const buttonLeft = document.querySelector('.slider__btn--left');
  const buttonRight = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');
  let currSlide = 0;
  const maxSlide = slides.length;
  const activateDot = function (i) {
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${i}"]`)
      .classList.add('dots__dot--active');
  };
  const updateSlidePos = function (currSlide) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (-currSlide + index)}%)`; // set at 0%..100%..
    });
  };
  const nextSlide = function () {
    currSlide++;
    if (currSlide > maxSlide - 1) currSlide = 0;
    updateSlidePos(currSlide);
    activateDot(currSlide);
  };
  const prevSlide = function () {
    currSlide--;
    if (currSlide < 0) currSlide = maxSlide - 1;
    updateSlidePos(currSlide);
    activateDot(currSlide);
  };
  const handleKeyDown = function (e) {
    // console.log(e);
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  const createDots = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const initSlider = function () {
    // run once to pre-layout slides.
    updateSlidePos(0);
    createDots(); // goes before activate dots.
    activateDot(0);
    buttonRight.addEventListener('click', nextSlide);
    buttonLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', handleKeyDown);
  };
  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const curr = e.target.dataset.slide;
      // console.log(curr);
      updateSlidePos(curr);
      activateDot(curr);
      currSlide = curr;
    }
  });
  initSlider();
};
sliderSection();
