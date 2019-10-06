'use strict';

function init() {
  //console.log('TCL: init -> screenWidth', screenWidth);

  let targets = document.getElementsByClassName('target');
  bindListeners();
  //console.dir(targets);
  for (let i = 0; i < targets.length; i++) {
    //console.log('removing href from target');
    targets[i].removeAttribute('href');
  }
}

function bindListeners() {
  burgerEventListener();
  closeNavEventListener();
  contactEventListener();
  closeContactEventListener();
  projectInfoEventListener();
  closeProjectInfoEventListener();
}

function burgerEventListener() {
  let burger = document.querySelector('.burger');
  let closeNav = document.querySelector('.closeBurger');
  burger.style.zIndex = '6';
  burger.onclick = () => {
    toggleNav(burger, closeNav);
  };
  burger.addEventListener('keyup', e => {
    if (e.keyCode === 13) toggleNav(burger, closeNav);
  });
}

function closeNavEventListener() {
  let burger = document.querySelector('.burger');
  let closeNav = document.querySelector('.closeBurger');
  closeNav.onclick = () => {
    toggleNav(burger, closeNav);
  };
  closeNav.addEventListener('keyup', e => {
    if (e.keyCode === 13) toggleNav(burger, closeNav);
  });
}

function contactEventListener() {
  let screenWidth = window.innerWidth;
  let contact = document.getElementById('contact');
  contact.onclick = () => {
    showContact(screenWidth);
  };
  contact.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) showContact(screenWidth);
  });
}

function closeContactEventListener() {
  let screenWidth = window.innerWidth;
  let close = document.querySelector('.close');
  close.onclick = () => {
    closeContact(screenWidth);
  };
  close.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) closeContact(screenWidth);
  });
}

function projectInfoEventListener() {
  let infoButton = document.querySelector('.infoButton');
  infoButton.onclick = () => {
    toggleInfo();
  };
  infoButton.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) toggleInfo();
  });
}

function closeProjectInfoEventListener() {
  let closeInfoButton = document.querySelector('.closeInfoButton');
  closeInfoButton.onclick = () => {
    console.log('closeInfoButton was clicked');
    toggleInfo();
  };
  closeInfoButton.addEventListener('keyup', function(e) {
    if (e.keyCode === 13) toggleInfo();
  });
}

function toggleInfo() {
  //console.log('info button was clicked');
  let projectContainerOverlay = document.querySelector('.projectContainerOverlay');
  projectContainerOverlay.classList.toggle('toggleInfo');
}

function showContact(width) {
  let buttons = document.querySelector('.contactButtons');
  let contact = document.querySelector('.contactInfo');
  //contact.style.display = 'inline';
  document.querySelector('.close').tabIndex = 0;
  if (width <= 1024) {
    buttons.classList.toggle('fade');
    setTimeout(() => {
      contact.classList.toggle('show');
    }, 500);
  } else contact.classList.toggle('show');
}

function closeContact(width) {
  let buttons = document.querySelector('.contactButtons');
  let contact = document.querySelector('.contactInfo');
  document.querySelector('.close').tabIndex = -1;
  if (width <= 1024) {
    setTimeout(() => {
      buttons.classList.toggle('fade');
      //contact.style.display = 'none';
    }, 800);
  }
  contact.classList.toggle('show');
}

function toggleNav(burger, close) {
  //console.log('in toggleNav');
  let nav = document.querySelector('.nav');
  let navList = document.querySelector('.navList');
  //console.dir(window.getComputedStyle(nav));
  let zIndex = window.getComputedStyle(burger).getPropertyValue('z-index');
  setTimeout(() => {
    nav.classList.toggle('toggleNav');
  }, 100);

  if (zIndex === '6') {
    //navList.style.display = 'flex';
    burger.classList.toggle('hide');
    burger.tabIndex = -1;
    burger.style.zIndex = '1';
    close.style.zIndex = '6';
    close.tabIndex = 1;
    setTimeout(() => {
      close.classList.toggle('showClose');
    }, 200);
  } else {
    close.classList.toggle('showClose');
    setTimeout(() => {
      //navList.style.display = 'none';
      burger.classList.toggle('hide');
    }, 400);
    close.style.zIndex = '1';
    close.tabIndex = 0;
    burger.style.zIndex = '6';
    burger.tabIndex = 1;
  }
}

window.onload = init();
