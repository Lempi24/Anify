import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getDatabase,
	get,
	update,
	ref,
	child,
	onValue,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js';
const firebaseConfig = {
	apiKey: 'AIzaSyDENO0IP6mXoH-R9N7xDUexVrDyqbQc0nA',
	authDomain: 'anify-107a5.firebaseapp.com',
	databaseURL: 'https://anify-107a5-default-rtdb.firebaseio.com',
	projectId: 'anify-107a5',
	storageBucket: 'anify-107a5.appspot.com',
	messagingSenderId: '494208062786',
	appId: '1:494208062786:web:04e804d7716d22325124db',
	measurementId: 'G-6KZ2XCZ0QB',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

const dbref = ref(db);
const parent = document.querySelector('.main__tiles');

get(child(dbref, 'Openings/'))
	.then((snapshot) => {
		snapshot.forEach((childSnapshot) => {
			const opening = childSnapshot.val();

			const cardElement = document.createElement('div');
			cardElement.classList.add('card');

			const imageContainer = document.createElement('div');
			imageContainer.classList.add('image-container');

			const imageElement = document.createElement('img');
			imageElement.src = opening.Image;

			const infoContainer = document.createElement('div');
			infoContainer.classList.add('info');

			const h2Element = document.createElement('h2');
			h2Element.classList.add('anime-title');
			h2Element.textContent = opening.Name;

			const openingTitleElement = document.createElement('p');
			openingTitleElement.classList.add('opening-title');
			openingTitleElement.textContent = opening.Title;

			const authorElement = document.createElement('p');
			authorElement.classList.add('author');
			authorElement.textContent = opening.Author;

			const buttonsElement = document.createElement('div');
			buttonsElement.classList.add('buttons');

			const angleLeft = document.createElement('i');
			angleLeft.classList.add('fa-solid');
			angleLeft.classList.add('fa-angle-left');
			const circlePlay = document.createElement('i');
			circlePlay.classList.add('fa-regular');
			circlePlay.classList.add('fa-circle-play');
			const angleRight = document.createElement('i');
			angleRight.classList.add('fa-solid');
			angleRight.classList.add('fa-angle-right');

			buttonsElement.appendChild(angleLeft);
			buttonsElement.appendChild(circlePlay);
			buttonsElement.appendChild(angleRight);

			infoContainer.appendChild(h2Element);
			infoContainer.appendChild(openingTitleElement);
			infoContainer.appendChild(authorElement);

			imageContainer.appendChild(imageElement);

			cardElement.appendChild(imageContainer);
			cardElement.appendChild(infoContainer);
			cardElement.appendChild(buttonsElement);

			parent.appendChild(cardElement);

			cardElement.addEventListener('click', () => {
				onYouTubeIframeAPIReady(opening);
				togglePlayerActive();
			});
		});
	})
	.catch((error) => {
		alert(error);
	});

export function clearResults(resultsArea) {
	resultsArea.replaceChildren();
}
let savedData = new Set();
export function performSearch(searchInput, resultsArea) {
	savedData.clear();
	resultsArea.replaceChildren();
	get(child(dbref, 'Openings/'))
		.then((snapshot) => {
			snapshot.forEach((childSnapshot) => {
				const opening = childSnapshot.val();
				const name = opening.Name.toUpperCase();
				const searchValue = searchInput.value.toUpperCase();
				if (!searchValue) {
					resultTile.replaceChildren();
				} else {
					if (!savedData.has(name)) {
						if (name.includes(searchValue)) {
							const resultTile = document.createElement('div');
							resultTile.classList.add('nav__resultTile');

							const tileName = document.createElement('h2');
							tileName.classList.add('nav__resultTileh2');
							tileName.textContent = name;

							const imgElement = document.createElement('img');
							imgElement.src = opening.Image;

							resultsArea.appendChild(resultTile);
							resultTile.appendChild(imgElement);
							resultTile.appendChild(tileName);

							resultTile.addEventListener('click', () => {
								onYouTubeIframeAPIReady(opening);
								togglePlayerActive();
							});
						}
						savedData.add(name);
					}
				}
			});
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}
