import { performSearch, clearResults } from './firebase.js';
const icon = document.querySelector('.nav__icon');
const search = document.querySelector('.nav__search');
const searchInput = document.querySelector('#mysearch');
const mobileSearchInput = document.querySelector('#mysearch2');
const clear = document.querySelector('#nav__clear');
const resultsArea = document.querySelector('#nav__searchResult');
const mobileResultsArea = document.querySelector('#nav__searchResult2');
searchInput.addEventListener('input', () => {
	performSearch(searchInput, resultsArea);
});
mobileSearchInput.addEventListener('input', () => {
	performSearch(mobileSearchInput, mobileResultsArea);
});
clear.addEventListener('click', () => {
	clearResults(resultsArea);
});
