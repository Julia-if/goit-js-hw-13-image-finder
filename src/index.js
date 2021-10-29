import './sass/main.scss';

import debounce from "lodash.debounce";
import * as basicLightbox from 'basiclightbox';

import { error } from '@pnotify/core';
import { defaults } from '@pnotify/core';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import galleryTpl from './templates/gallery-tpl.hbs';
import photoCardTpl from './templates/photo-card-tpl.hbs';
import searchFormTpl from './templates/search-form-tpl.hbs';
import PicturesApiService from './js/pictures-service';

const body = document.querySelector('body');

body.insertAdjacentHTML('afterbegin', galleryTpl());
body.insertAdjacentHTML('afterbegin', searchFormTpl());

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.js-load-more-btn')
}

const picturesApiService = new PicturesApiService;

const intersationObserverOptions = {
    rootMargin: '0px', 
    threshold: 0,
}

const observer = new IntersectionObserver(intersationObserverCallback, intersationObserverOptions)

refs.searchForm.addEventListener('input', debounce(onFormInputChange, 500));
refs.gallery.addEventListener('click', onPicturesClick)


function onFormInputChange(e) {
    picturesApiService.query = e.target.value;

    if (picturesApiService.query === '') {
        clearGallery()
        return
    }

    picturesApiService.resetPage();
    clearGallery();
    fetchPicures();
}

async function fetchPicures() {

    const promise = picturesApiService.fetchPictures();

    await promise.then(pictures => {
// console.log(pictures)
        if (pictures.total === 0) {
            onError()
            return
        }
        appendCardsMarkup(pictures.hits)
    });
}

function clearGallery() {
    refs.gallery.innerHTML = "";
}

function appendCardsMarkup(pictures) {
    refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(pictures));
    // refs.gallery.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'end',
    // });

    addIntersectionObserver(refs.gallery.lastElementChild);
}

function onIntersection() {
    fetchPicures();
}

function onPicturesClick(e) {
    const url = e.target.dataset.large;
    basicLightbox.create(`
		<img width="1400" height="900" src=${url}>
	`).show()

}


function intersationObserverCallback(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(onIntersection(), 1000);
        }
    }
    )
}

function addIntersectionObserver(elem) {
    observer.observe(elem)
}

function showNotification(message) {
    error({
        text: `${message}`,
    });
};

function onError() {
    const message = 'Enter a different query!';
            showNotification(message);
}








