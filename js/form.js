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

const form = document.querySelector('#form');

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

form.addEventListener('submit', (e) => {
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
	location.reload();
});
