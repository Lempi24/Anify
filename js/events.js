let player;
let player2;
let playersArray = [];
let intervalId = null;
const playerElement = document.querySelector('#player-background');
const iconBtn = document.querySelector('#icon-btn');
const stateBtn = document.querySelector('#player-btn');
const playerControlls = document.querySelector('#player-controlls');
const closeBtn = document.querySelector('#close-btn');
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
const header = document.querySelector('.header__hero-text');
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
burgerMenu.addEventListener('click', () => {
	if (burgerMenu.classList.contains('change')) {
		burgerMenu.classList.remove('change');
		mobileNav.classList.remove('mobile-nav-change');
		header.classList.remove('h1-disable');
	} else {
		burgerMenu.classList.add('change');
		mobileNav.classList.add('mobile-nav-change');
		header.classList.add('h1-disable');
	}
});

function onYouTubeIframeAPIReady(opening) {
	player = new YT.Player('player', {
		height: '1080',
		width: '1920',
		videoId: `${opening.Video}`,
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
		playerVars: {
			controls: '0',
			iv_load_policy: '3',
			suggestedQuality: 'highres',
		},
	});
	playersArray.push(player);
	player2 = new YT.Player('player-background', {
		height: '144',
		width: '192',
		videoId: `${opening.Video}`,
		events: {
			onReady: mute,
			onStateChange: onPlayerStateChange,
		},
		playerVars: {
			controls: '0',
			iv_load_policy: '3',
			suggestedQuality: 'small',
		},
	});
	playersArray.push(player2);
}
function mute() {
	player2.setVolume(0);
}

function hideAnimeName(opening) {
	const tileId = document.getElementById(`${opening.Id}`);
	tileId.classList.toggle('test');
}
function togglePlayerActive() {
	playerControlls.classList.toggle('player__notactive');
	main.style.pointerEvents = 'none';
	body.style.overflow = 'hidden';
	searchClickElement.style.pointerEvents = 'none';
}
function createTimeStamp() {
	//slider
	timeStampSlider.max = `${player.getDuration() - 1}`;
	currentTimeElement.textContent = '00:00';
	currentTime = '00:00';
	//full time
	const minutes = Math.floor(player.getDuration() / 60);
	const seconds = player.getDuration() - 1 - minutes * 60;
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
	const playerBackgroundState = player2.getPlayerState();
	const playVideos = () => {
		playersArray.forEach((player) => {
			player.playVideo();
		});
	};

	const pauseVideos = () => {
		playersArray.forEach((player) => {
			player.pauseVideo();
		});
	};

	if (
		(playerState === YT.PlayerState.CUED &&
			playerBackgroundState === YT.PlayerState.CUED) ||
		playerState === YT.PlayerState.PAUSED
	) {
		playVideos();
	} else if (playerState === YT.PlayerState.PLAYING) {
		pauseVideos();
	}
});

closeBtn.addEventListener('click', () => {
	if (player && typeof player.destroy === 'function') {
		const resetSlider = '<div id="time-slider"></div>';
		timeStampSlider.innerHTML = resetSlider;
		main.style.pointerEvents = 'auto';
		for (let i = 0; i < playersArray.length; i++) {
			playersArray[i].destroy();
		}
	}
	iconBtn.className = 'fa-solid fa-play';
	playerControlls.classList.toggle('player__notactive');
	playerToShow.classList.toggle('player-show');
	body.style.overflowY = 'scroll';
	searchClickElement.style.pointerEvents = 'auto';
	playersArray = [];
	clearInterval(intervalId);
	intervalId = null;
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
	//iconBtn.className = 'fa-solid fa-pause';
	currentTime = timeStampSlider.value;
	for (let i = 0; i < playersArray.length; i++) {
		playersArray[i].seekTo(currentTime);
	}
}
timeStampSlider.oninput = skipTime;
function changeStateIcon() {
	const playerState = player.getPlayerState();
	if (playerState === YT.PlayerState.PLAYING) {
		iconBtn.className = 'fa-solid fa-pause';
	} else {
		iconBtn.className = 'fa-solid fa-play';
	}
}
function onPlayerStateChange(event) {
	changeStateIcon();
	const mainPlayer = player;
	const backgroundPlayer = player2;
	//console.log('zmiana stanu');
	const mainPlayerTime = mainPlayer.getCurrentTime();
	const backgroundPlayerTime = backgroundPlayer.getCurrentTime();
	const errorMargin = 0.1;

	if (Math.abs(mainPlayerTime - backgroundPlayerTime) > errorMargin) {
		//console.log(Math.abs(mainPlayerTime - backgroundPlayerTime));
		backgroundPlayer.seekTo(mainPlayerTime);
	}

	/*if (player2.getPlayerState() === 3) {
		player.pauseVideo();
	} else if (player2.getPlayerState() === 1) {
		player.playVideo();
	}
	*/
}
