import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';
import {
	getDatabase,
	get,
	ref as databaseRef,
	child,
	update,
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

const dbref = databaseRef(db);
const parent = document.querySelector('.main__tiles');

const auth = getAuth(app);

let namesArray = [];
let cardElements = [];
let barElement;
let clickableElement;
let clickableH2;
let cardHolder;
let cardElement;

get(child(dbref, 'Openings/')).then((snapshot) => {
	snapshot.forEach((childSnapshot) => {
		const opening = childSnapshot.val();
		const openingName = opening.Name.replace(/ /g, '_');

		if (!namesArray.includes(openingName)) {
			namesArray.push(openingName);

			barElement = document.createElement('div');
			barElement.classList.add('bar');
			barElement.id = openingName;

			clickableElement = document.createElement('div');
			clickableElement.classList.add('clickable-bar');

			clickableH2 = document.createElement('h2');
			clickableH2.textContent = opening.Name;

			cardHolder = document.createElement('div');
			cardHolder.classList.add('card-holder');
			cardHolder.classList.add('card-hidden');

			clickableElement.appendChild(clickableH2);
			barElement.appendChild(clickableElement);
			barElement.appendChild(cardHolder);
			parent.appendChild(barElement);
			clickableElement.addEventListener(
				'click',
				(function (element) {
					return function () {
						const siblings = Array.from(element.parentElement.children);

						siblings.forEach((sibling) => {
							if (sibling !== element) {
								sibling.classList.toggle('card-hidden');
							}
						});
					};
				})(clickableElement)
			);
		}

		const barElements = Array.from(document.querySelectorAll('.bar'));
		barElements.forEach((bar) => {
			if (bar.id === openingName) {
				cardElement = document.createElement('div');
				cardElement.classList.add('card');
				cardElement.id = 'card';

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

				imageContainer.appendChild(imageElement);
				infoContainer.appendChild(h2Element);
				infoContainer.appendChild(openingTitleElement);
				infoContainer.appendChild(authorElement);

				buttonsElement.appendChild(angleLeft);
				buttonsElement.appendChild(circlePlay);
				buttonsElement.appendChild(angleRight);

				cardElement.appendChild(imageContainer);
				cardElement.appendChild(infoContainer);
				cardElement.appendChild(buttonsElement);

				cardHolder.appendChild(cardElement);

				cardElement.addEventListener('click', () => {
					onYouTubeIframeAPIReady(opening);
					togglePlayerActive();
				});
			}
		});
	});
});

export function clearResults(resultsArea) {
	resultsArea.replaceChildren();
}
let savedData = [];
export function performSearch(searchInput, resultsArea) {
	savedData = [];
	resultsArea.replaceChildren();
	get(child(dbref, 'Openings/'))
		.then((snapshot) => {
			snapshot.forEach((childSnapshot) => {
				const opening = childSnapshot.val();
				const openingName = opening.Name.replace(/ /g, '_');
				const name = opening.Name.toUpperCase();
				const searchValue = searchInput.value.toUpperCase();
				if (!searchValue) {
					resultTile.replaceChildren();
				} else {
					if (!savedData.includes(name)) {
						if (name.includes(searchValue)) {
							const resultTile = document.createElement('a');
							resultTile.setAttribute('data-section', openingName);
							//resultTile.href = '#' + openingName;
							resultTile.classList.add('nav__resultTile');

							const tileName = document.createElement('h2');
							tileName.classList.add('nav__resultTileh2');
							tileName.textContent = name;

							resultsArea.appendChild(resultTile);
							resultTile.appendChild(tileName);

							resultTile.addEventListener('click', () => {
								const parentElement = document.querySelector(`#${openingName}`);

								const children = parentElement.children;
								const lastChild = children[children.length - 1];
								parentElement.scrollIntoView({
									behavior: 'smooth',
								});
								//console.log(children);
								lastChild.classList.toggle('card-hidden');
								children[0].style.animation = 'glowing 5s 1s ease-in-out';
							});
						}
						savedData.push(name);
					}
				}
			});
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
		});
}
//console.log(namesArray);
//listening for auth changes
const loggedInElements = document.querySelectorAll('.logged-in');
const loggedOutElements = document.querySelectorAll('.logged-out');
const avatarImage = document.querySelector('#avatar-image');
const userName = document.querySelectorAll('.user-name');
const userScore = document.querySelectorAll('.user-score');
const userScoreBoard = document.querySelector('.user-score-board');
let userCurrentScore;
let user;
let userRef;
onAuthStateChanged(auth, (userAuth) => {
	if (userAuth) {
		user = userAuth;
		loggedInElements.forEach((element) => element.classList.add('hidden')); //.classList.add('hidden');
		loggedOutElements.forEach((element) => element.classList.remove('hidden')); //.classList.remove('hidden');
		avatarImage.src = user.photoURL;
		if (userScoreBoard) {
			userRef = databaseRef(db, `Users/${userAuth.uid}`);

			onValue(userRef, (snapshot) => {
				const userInfo = snapshot.val();
				userCurrentScore = userInfo.quizPoints;
				// Loop through all elements with the class 'user-name'
				userName.forEach((element) => {
					element.innerHTML = userInfo.displayName;
				});
				// Loop through all elements with the class 'user-score'
				userScore.forEach((element) => {
					element.innerHTML = `Points: ${userCurrentScore}`;
				});
			});
			get(child(dbref, `Users/${userAuth.uid}`)).then((snapshot) => {
				const userInfo = snapshot.val();
				userCurrentScore = userInfo.quizPoints;
				// Loop through all elements with the class 'user-name'
				userName.forEach((element) => {
					element.innerHTML = userInfo.displayName;
				});
				// Loop through all elements with the class 'user-score'
				userScore.forEach((element) => {
					element.innerHTML = `Points: ${userCurrentScore}`;
				});
			});
		}
	} else {
		loggedInElements.forEach((element) => element.classList.remove('hidden')); //.classList.remove('hidden');
		loggedOutElements.forEach((element) => element.classList.add('hidden')); //.classList.add('hidden');
	}
});

export function UpdatePoints() {
	const updateData = {
		displayName: user.displayName,
		email: user.email,
		quizPoints: (userCurrentScore += 3),
	};
	update(databaseRef(db, `/Users/${user.uid}`), updateData);
}
//sign Out

const test = document.querySelectorAll('.logOut');
test.forEach((logOutElement) => {
	logOutElement.addEventListener('click', () => {
		signOut(auth);
	});
});
//show and close menu
const avatar = document.querySelector('#avatar');
const userList = document.querySelector('#user-list');
avatar.addEventListener('click', () => {
	userList.classList.toggle('user-list-vissible');
});
