import footerTemplate from '../template/footer.hbs';
import headerTemplate from '../template/header.hbs';
import refs from './refs';
import 'material-design-icons/iconfont/material-icons.css';
import { showDetails } from './filmDetailsPage';
import { drawQueueFilmList } from './libraryPage';
import { baseUrl, apiKey } from './initialHomePage';
import { controlGlobalPage, homePagePagination } from './searchAndPaginationHomePage';
import { logOut, userAuth } from './authorizationAndMoviesDatabase'
import { formRegModalPlugin } from '../index.js'

// navigation__link--active
const activeHomePage = () => {
  refs.linkHome.classList.add('isActivLinkNavigation');
  refs.homePage.classList.remove('notActivePage');
  refs.myFilmLibraryPage.classList.add('notActivePage');
  refs.detailsPage.classList.add('notActivePage');
  refs.linkHome.classList.add('navigation__link--active');
  refs.linkMyLibrary.classList.remove('navigation__link--active');
};

const activeLibraryPage = () => {
  refs.myFilmLibraryPage.classList.remove('notActivePage');
  refs.detailsPage.classList.add('notActivePage');
  refs.homePage.classList.add('notActivePage');
  refs.linkMyLibrary.classList.add('navigation__link--active');
  refs.linkHome.classList.remove('navigation__link--active');
};

const activeDetailsPage = (movied) => {
  refs.homePage.classList.add('notActivePage');
  refs.myFilmLibraryPage.classList.add('notActivePage');
  refs.detailsPage.classList.remove('notActivePage');
  showDetails(movied);
  if (movied.original_title) {
    const brUrl = movied.original_title.toLowerCase().split(" ").join('-')
  }
};

function renderHeader() {
  refs.header.insertAdjacentHTML('afterbegin', headerTemplate());
}

function renderFooter() {
  refs.footer.insertAdjacentHTML('afterbegin', footerTemplate());
}

function addHeaderListener() {
  refs.linkLogo = refs.header.querySelector('.js-logo');
  refs.linkHome = refs.header.querySelector('.js-home');
  refs.linkMyLibrary = refs.header.querySelector('.js-myLibrary');
  refs.linkLogin = refs.header.querySelector('.item-js-user_link');

  refs.linkLogo.addEventListener('click', linkLogoHandler);
  refs.linkHome.addEventListener('click', linkHomeHandler);
  refs.linkMyLibrary.addEventListener('click', linkMyLibraryHandler);
  refs.homeList.addEventListener('click', homeListHandler);
  refs.linkLogin.addEventListener('click', linkLoginHandler);
}

function homeListHandler(event) {
  const { target, currentTarget } = event;

  if (target.nodeName !== 'LI') {
    return;
  }

  const movieId = target.dataset.itemid;

  fetch(`${baseUrl}/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    .then(res => res.json())
    .then(data => {
      activeDetailsPage(data);
    });
}

function linkMyLibraryHandler() {
  activeLibraryPage();
  drawQueueFilmList();
}

function linkHomeHandler() {
  activeHomePage();
}

function linkLogoHandler() {
  homePagePagination();
  controlGlobalPage.setStartPage();
  activeHomePage();
}

function linkLoginHandler() {
  if (userAuth) {
    logOut(changeLoginBtnStatus)
  }
  
}

function changeLoginBtnStatus(isLogged) {
  const textRef = refs.linkLogin.querySelector('span');
  const imgRef = refs.linkLogin.querySelector('img');
  if (isLogged) {
    formRegModalPlugin.chendgeStatLogin();
    textRef.textContent = 'Exit';
    imgRef.src = './images/user_form/exit.png';
    imgRef.alt = 'exit icon';
    refs.linkMyLibrary.classList.remove('visually-hidden');
  } else {
    formRegModalPlugin.chendgeStatUnlogin();
    textRef.textContent = 'Login';
    imgRef.src = './images/user_form/enter.png';
    imgRef.alt = 'login icon';
    refs.linkMyLibrary.classList.add('visually-hidden');
    linkLogoHandler();
  }

}


export { activeHomePage, activeDetailsPage, renderHeader, renderFooter, addHeaderListener, changeLoginBtnStatus };
