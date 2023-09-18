let player;
let player2;
let playersArray = [];
let intervalId;
const playerElement = document.querySelector('#player-background');
const iconBtn = document.querySelector('#icon-btn');
const stateBtn = document.querySelector('#player-btn');
const playerControlls = document.querySelector('#player-controlls');
const closeBtn = document.querySelector('#close-btn');
const playerBgcContainerElement = document.querySelector(
	'#player-bcg-container'
);
let slider = document.querySelector('#slider');
let volume = 50;
let prevVolume = 50;
const volumeBtn = document.querySelector('#volume-btn');
const volumeIcon = document.querySelector('#volume-icon');
const timeStampSlider = document.querySelector('#timeSlider');
const main = document.querySelector('#main');
const fullTimeH3 = document.querySelector('#fullTimeH3');
const currentTimeElement = document.querySelector('#currentTime');
const body = document.querySelector('#body');
const searchClickElement = document.querySelector('.nav__searchResult');
const playerToShow = document.querySelector('.player');
const burgerMenu = document.querySelector('#burger-menu');
const mobileNav = document.querySelector('#mobile-nav');
const h1 = document.querySelector('#h1');
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
burgerMenu.addEventListener('click', () => {
	if (burgerMenu.classList.contains('change')) {
		burgerMenu.classList.remove('change');
		mobileNav.classList.remove('mobile-nav-change');
		h1.classList.remove('h1-disable');
	} else {
		burgerMenu.classList.add('change');
		mobileNav.classList.add('mobile-nav-change');
		h1.classList.add('h1-disable');
	}
});

function onYouTubeIframeAPIReady(opening) {
	player = new YT.Player('player', {
		height: '360',
		width: '640',
		videoId: `${opening.Video}`,
		events: {
			onReady: onPlayerReady,
		},
		playerVars: {
			controls: '0',
			iv_load_policy: '3',
		},
	});
	playersArray.push(player);
	player2 = new YT.Player('player-background', {
		height: '360',
		width: '640',
		videoId: `${opening.Video}`,
		events: {
			onReady: mute,
		},
		playerVars: {
			controls: '0',
			iv_load_policy: '3',
		},
	});
	playersArray.push(player2);
}
function mute() {
	player2.setVolume(0);
}
function showAnimeName(opening) {
	const tileId = document.getElementById(`${opening.Id}`);
	tileId.classList.toggle('test');
}
function hideAnimeName(opening) {
	const tileId = document.getElementById(`${opening.Id}`);
	tileId.classList.toggle('test');
}
function togglePlayerActive() {
	playerControlls.classList.toggle('player__notactive');
	main.style.display = 'none';
	body.style.overflow = 'hidden';
	searchClickElement.style.pointerEvents = 'none';
	playerBgcContainerElement.classList.toggle('center');
	playerToShow.classList.toggle('player-show');
}
function createTimeStamp() {
	//slider
	timeStampSlider.max = `${player.getDuration()}`;
	currentTimeElement.textContent = '00:00';
	currentTime = '00:00';
	//full time
	const minutes = Math.floor(player.getDuration() / 60);
	const seconds = player.getDuration() - minutes * 60;
	fullTimeH3.textContent = `${String(minutes).padStart(2, '0')}:${String(
		seconds
	).padStart(2, '0')}`;
}
function onPlayerReady(event) {
	player.setVolume(volume);
	createTimeStamp();
	startShowingCurrentTime();
}
function showCurrentTime() {
	currentTime = Math.round(player.getCurrentTime());
	const minutes = Math.floor(currentTime / 60);
	const seconds = currentTime % 60;
	const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
		seconds
	).padStart(2, '0')}`;
	currentTimeElement.textContent = formattedTime;
}
function startShowingCurrentTime() {
	setInterval(showCurrentTime, 1000);
	setInterval(changeTimeStampValue, 1000);
}
tag.onload = onYouTubeIframeAPIReady;
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

stateBtn.addEventListener('click', () => {
	const playerState = player.getPlayerState();
	if (!intervalId) {
		intervalId = setInterval(synchronizeBackgroundVideo, 1000);
	}
	if (playerState == YT.PlayerState.CUED) {
		for (let i = 0; i < playersArray.length; i++) {
			playersArray[i].playVideo();
		}
		iconBtn.className = 'fa-solid fa-pause';
	} else if (playerState == YT.PlayerState.PLAYING) {
		for (let i = 0; i < playersArray.length; i++) {
			playersArray[i].pauseVideo();
		}
		iconBtn.className = 'fa-solid fa-play';
	} else if (playerState == YT.PlayerState.PAUSED) {
		for (let i = 0; i < playersArray.length; i++) {
			playersArray[i].playVideo();
		}
		iconBtn.className = 'fa-solid fa-pause';
	}
});

closeBtn.addEventListener('click', () => {
	if (player && typeof player.destroy === 'function') {
		const resetSlider = '<div id="time-slider"></div>';
		timeStampSlider.innerHTML = resetSlider;
		main.style.display = 'flex';
		for (let i = 0; i < playersArray.length; i++) {
			playersArray[i].destroy();
		}
	}
	iconBtn.className = 'fa-solid fa-play';
	playerControlls.classList.toggle('player__notactive');
	playerBgcContainerElement.classList.toggle('center');
	playerToShow.classList.toggle('player-show');
	body.style.overflowY = 'scroll';
	searchClickElement.style.pointerEvents = 'auto';
	const resetBackground =
		"<div class='player-background main__active' id='player-background'></div><div class='player'id='player'></div>";
	playerBgcContainerElement.innerHTML = resetBackground;
	playersArray = [];
	clearInterval(intervalId);
});
function changeIcon(volume) {
	if (volume >= 50) {
		volumeIcon.className = 'fa-solid fa-volume-high';
	} else if (volume < 50 && volume > 1) {
		volumeIcon.className = 'fa-solid fa-volume-low';
	} else {
		volumeIcon.className = 'fa-solid fa-volume-xmark';
	}
}
function adjustVolume() {
	volume = slider.value;
	prevVolume = volume;
	player.setVolume(volume);
	changeIcon(volume);
}
slider.oninput = adjustVolume;
volumeBtn.addEventListener('click', () => {
	if (volume > 0) {
		changeIcon(0);
		volume = 0;
		slider.value = volume;
		player.setVolume(volume);
	} else {
		changeIcon(prevVolume);
		volume = prevVolume;
		slider.value = prevVolume;
		player.setVolume(prevVolume);
	}
});
function changeTimeStampValue() {
	timeStampSlider.value = currentTime;
}
function skipTime() {
	iconBtn.className = 'fa-solid fa-pause';
	currentTime = timeStampSlider.value;
	for (let i = 0; i < playersArray.length; i++) {
		playersArray[i].seekTo(currentTime);
	}
}
timeStampSlider.oninput = skipTime;
playerBgcContainerElement.addEventListener('click', () => {});
function synchronizeBackgroundVideo() {
	const mainPlayerTime = player.getCurrentTime();
	const backgroundPlayerTime = player2.getCurrentTime();
	const mainPlayerTimeRounded = Math.round(mainPlayerTime * 1000) / 1000;
	const backgroundPlayerTimeRounded =
		Math.round(backgroundPlayerTime * 1000) / 1000;
	if (mainPlayerTimeRounded !== backgroundPlayerTimeRounded - 0.001) {
		player2.seekTo(mainPlayerTimeRounded);
	}
}
