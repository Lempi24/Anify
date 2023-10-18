import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';
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
const auth = getAuth(app);
//form change
const formChangeBtnLogin = document.getElementById('form-change-btn-login');
const formChangeBtnRegister = document.getElementById(
	'form-change-btn-register'
);

formChangeBtnLogin.addEventListener('click', () => {
	document.getElementById('login').classList.add('hidden');
	document.getElementById('register').classList.remove('hidden');
});

formChangeBtnRegister.addEventListener('click', () => {
	document.getElementById('register').classList.add('hidden');
	document.getElementById('login').classList.remove('hidden');
});

//user register
const registerBtn = document.querySelector('#registerBtn');
const registerForm = document.querySelector('#register');
registerBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const email = document.querySelector('#user-email-register').value;
	const password = document.querySelector('#user-password-register').value;
	const registerSuccess = document.querySelector('#register-success');
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			//const user = userCredential.user;
			registerSuccess.classList.add('vissible');
			registerForm.reset();
			setTimeout(() => {
				registerSuccess.classList.remove('vissible');
			}, 3000);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`kod błędu: ${errorCode} \n błąd: ${errorMessage}`);
		});
});

//user log in
const loginForm = document.querySelector('#login');
loginForm.addEventListener('click', (e) => {
	e.preventDefault();
	const email = document.querySelector('#user-email-login').value;
	const password = document.querySelector('#user-password-login').value;
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = auth.currentUser;
			if (!user.photoURL) {
				updateProfile(user, {
					photoURL:
						'https://firebasestorage.googleapis.com/v0/b/anify-107a5.appspot.com/o/Avatars%2FNo%20avatar.jpg?alt=media&token=b1658590-936d-42ea-91b3-b8588de1eea0',
				})
					.then(() => {
						console.log('Profil zaaktualizowany');
					})
					.catch((error) => {
						console.log(error);
					});
			}
			window.location.replace('index.html');
			console.log('User loged in');
			console.log(userCredential.user);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`kod błędu: ${errorCode} \n błąd: ${errorMessage}`);
		});
});
