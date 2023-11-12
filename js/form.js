import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getDatabase,
	set,
	get,
	update,
	ref,
	child,
	onValue,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';

const submitBtn = document.querySelector('#submitBtn');

const firebaseConfig = {
	apiKey: 'AIzaSyD4i0M2KJQn0JBgsFRq15ylydE8jGhDBOY',
	authDomain: 'anifyapprove.firebaseapp.com',
	projectId: 'anifyapprove',
	storageBucket: 'anifyapprove.appspot.com',
	messagingSenderId: '680062667101',
	appId: '1:680062667101:web:9758be0825fab1b50c40b4',
	measurementId: 'G-Q783MBGRGJ',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

const dbref = ref(db);
const failBox = document.querySelector('#register-fail');
const successBox = document.querySelector('#register-success');
const formInput = document.querySelectorAll('.form__input');
const form = document.querySelector('#form');
const logo = document.querySelector('.nav__logo');
const menu = document.querySelectorAll('.menu');
submitBtn.addEventListener('click', (e) => {
	let isFormValid = true;

	formInput.forEach((element) => {
		if (element.value === '') {
			isFormValid = false;
			//console.log('Nie ma wszystkich danych');
		}
	});
	if (!isFormValid) {
		e.preventDefault();
		failBox.classList.add('vissible');
		logo.classList.add('opacity0');
		menu.forEach((menuElement) => {
			//console.log(menuElement);
			menuElement.classList.add('opacity0');
		});
		setTimeout(() => {
			failBox.classList.remove('vissible');
			logo.classList.remove('opacity0');
			menu.forEach((menuElement) => {
				menuElement.classList.remove('opacity0');
			});
		}, 3000);
	} else {
		e.preventDefault();
		const author = document.getElementById('Author').value;
		const image = '';
		const name = document.getElementById('Name').value;
		const title = document.getElementById('Title').value;
		const video = '';
		const newForm = child(dbref, `Openings/${name}`);

		set(newForm, {
			Author: author,
			Image: image,
			Name: name,
			Title: title,
			Video: video,
		});
		successBox.classList.add('vissible');
		logo.classList.add('opacity0');
		menu.forEach((menuElement) => {
			//console.log(menuElement);
			menuElement.classList.add('opacity0');
		});
		form.reset();
		setTimeout(() => {
			successBox.classList.remove('vissible');
			logo.classList.remove('opacity0');
			menu.forEach((menuElement) => {
				menuElement.classList.remove('opacity0');
			});
		}, 3000);
	}
});
