import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getStorage,
	uploadBytes,
	ref,
	getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js';
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js';
import { UpdatePoints } from './firebase.js';
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
const db = getFirestore();
const querySnapshot = await getDocs(collection(db, 'Openings'));
let keys = {};
querySnapshot.forEach((doc) => {
	for (const key in doc.data()) {
		keys[key] = doc.data()[key];
	}
});
const quizBtn = document.querySelector('#quiz-btn');
const quizAnswers = document.querySelectorAll('.quiz-answer');
const audio = document.querySelector('#audio');
const timerElement = document.querySelector('#quiz-timer-time');
quizBtn.addEventListener('click', () => {
	let countdown = 10;
	let countdownInterval;
	let answerChosen = false;
	function updateTimer() {
		timerElement.textContent = countdown;
		countdown--;
		if (countdown < 0) {
			clearInterval(countdownInterval);
			timerElement.style.animation = 'none';
		}
	}
	countdownInterval = setInterval(() => {
		if (!answerChosen) {
			updateTimer();
		}
	}, 1000);
	quizBtn.style.pointerEvents = 'none';
	let choosenKeys = {};
	let correctAnswerIndex = -1;
	const allKeys = Object.keys(keys);
	let timeout;
	while (Object.keys(choosenKeys).length < 4) {
		let randomNumber = Math.floor(Math.random() * allKeys.length);
		const randomKey = allKeys[randomNumber];
		if (!choosenKeys[randomKey]) {
			const randomValue = keys[randomKey];
			choosenKeys[randomKey] = randomValue;
		}
	}

	correctAnswerIndex = Math.floor(
		Math.random() * Object.keys(choosenKeys).length
	);
	//console.log(correctAnswerIndex);
	//console.log(choosenKeys);
	audio.src = choosenKeys[Object.keys(choosenKeys)[correctAnswerIndex]];
	audio.volume = 0.1;
	audio.play();
	quizAnswers.forEach((answer, i) => {
		answer.querySelector('h2').textContent = Object.keys(choosenKeys)[i];
		answer.dataset.index = i;
		answer.classList.remove('correct', 'wrong');
		answer.addEventListener('click', clickHandler);
	});
	timeout = setTimeout(() => {
		audio.src = '';
		alert('Koniec czasu!');
		clearTimeout(timeout);
	}, 11000);
	function clickHandler(event) {
		answerChosen = true;
		clearInterval(countdownInterval);
		clearTimeout(timeout);
		quizBtn.style.pointerEvents = 'auto';
		audio.src = '';
		const index = event.currentTarget.dataset.index;
		if (index == correctAnswerIndex) {
			UpdatePoints();
			quizAnswers[correctAnswerIndex].classList.add('correct');
		} else {
			quizAnswers[index].classList.add('wrong');
			quizAnswers[correctAnswerIndex].classList.add('correct');
		}
		quizAnswers.forEach((answer) => {
			answer.removeEventListener('click', clickHandler);
		});
	}
	//console.log(choosenKeys[Object.keys(choosenKeys)[correctAnswerIndex]]);
});
