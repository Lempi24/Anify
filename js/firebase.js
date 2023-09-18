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

			const tileElement = document.createElement('div');
			tileElement.classList.add('main__tile');

			const nameElement = document.createElement('div');
			nameElement.classList.add('main__nameDiv');
			nameElement.id = opening.Id;

			const imgElement = document.createElement('img');
			imgElement.src = opening.Image;

			const aElement = document.createElement('a');
			aElement.href = '#main';

			const tileInfoElement = document.createElement('div');
			tileInfoElement.classList.add('main__tile-info');

			const titleElement = document.createElement('h2');
			titleElement.textContent = opening.Title;

			const authorElement = document.createElement('h3');
			authorElement.textContent = opening.Author;

			const nameH2 = document.createElement('h2');
			nameH2.classList.add('h3center');
			nameH2.textContent = opening.Name;

			tileInfoElement.appendChild(titleElement);
			tileInfoElement.appendChild(authorElement);
			nameElement.appendChild(nameH2);

			aElement.appendChild(imgElement);
			tileElement.appendChild(nameElement);
			tileElement.appendChild(aElement);
			tileElement.appendChild(tileInfoElement);

			imgElement.addEventListener('click', () => {
				onYouTubeIframeAPIReady(opening);
				togglePlayerActive();
			});
			imgElement.addEventListener('mouseenter', () => {
				showAnimeName(opening);
			});
			imgElement.addEventListener('mouseout', () => {
				hideAnimeName(opening);
			});
			parent.appendChild(tileElement);
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
								onYouTubeIframeAPIReady(opening, 'player-background');
								onYouTubeIframeAPIReady(opening, 'player');
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
