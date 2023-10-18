import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js';
import {
	getAuth,
	onAuthStateChanged,
	updateProfile,
	updateEmail,
	sendEmailVerification,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';
import {
	getStorage,
	ref,
	uploadBytes,
	getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js';
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
const storage = getStorage(app);

const avatarInput = document.querySelector('#avatar-input');
const avatarImage = document.querySelector('#avatar-image');
const currentEmail = document.querySelector('#current-email');
const editCurrentP = document.querySelector('#edit-current-p');
const changeEmailForm = document.querySelector('#change-email-form');
const changeDataBtn = document.querySelector('#change-data-submit');
editCurrentP.addEventListener('click', () => {
	changeEmailForm.classList.toggle('change-dissabled');
});
changeDataBtn.addEventListener('click', (e) => {
	e.preventDefault();
	const changedEmail = document.querySelector('#user-changed-email').value;
	console.log(changedEmail);
	onAuthStateChanged(auth, (user) => {
		if (user) {
			updateEmail(user, changedEmail)
				.then(() => {
					sendEmailVerification(user).then(() => {
						console.log('Wiadomość e-mail weryfikacyjna wysłana pomyślnie.');
					});
				})
				.catch((error) => {
					console.log(error.message);
				});
		} else {
		}
	});
});
avatarInput.addEventListener('change', () => {
	const file = avatarInput.files[0];
	const user = auth.currentUser;
	if (user) {
		const userEmail = user.email;
		uploadBytes(ref(storage, 'Avatars/' + userEmail), file).then((snapshot) => {
			console.log(ref(storage));
			console.log('Uploaded a blob for file!');
			getDownloadURL(ref(storage, 'Avatars/' + userEmail)).then((url) => {
				updateProfile(user, {
					photoURL: url,
				})
					.then(() => {
						console.log('Profil zaaktualizowany');
						window.location.reload();
					})
					.catch((error) => {
						console.log(error);
					});
			});
		});
	} else {
		console.log('Użytkownik nie jest zalogowany.');
	}
});

onAuthStateChanged(auth, (user) => {
	if (user) {
		currentEmail.innerHTML = user.email;
		avatarImage.src = user.photoURL;
		console.log(user);
	} else {
	}
});
