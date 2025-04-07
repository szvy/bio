document.addEventListener('DOMContentLoaded', async () => {
    const overlay = document.getElementById('overlay');
    const content = document.querySelector('.content');

    const playerContainer = document.getElementById('music-player-container');
    const player = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const songTitle = document.getElementById('song-title');
    const volumeControl = document.getElementById('volume-control');
    const volumeEmoji = document.getElementById('volume-emoji');

    let songs = [];
    let songNames = {};
    let currentSongIndex = 0;

    let currentVolume = volumeControl.value;

    try {
        const songRes = await fetch('/assets/songs.json');
        const data = await songRes.json();
        songs = Object.keys(data);
        songNames = data;
    } catch (e) {
        console.error('Failed to load songs:', e);
    }

    function updateVolumeEmoji(volume) {
        if (volume == 0) {
            volumeEmoji.textContent = '🔇';
        } else if (volume < 0.3) {
            volumeEmoji.textContent = '🔈';
        } else if (volume < 0.7) {
            volumeEmoji.textContent = '🔉';
        } else {
            volumeEmoji.textContent = '🔊';
        }
    }

    function loadSong(index) {
        const song = songs[index];
        player.src = song;
        songTitle.textContent = songNames[song] || song;
        player.volume = currentVolume;
        player.play();
        playPauseBtn.textContent = '⏸️';
    }

    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            content.style.display = 'flex';
            playerContainer.style.display = 'flex';
            loadSong(currentSongIndex);
            updateVolumeEmoji(currentVolume);
        }, 1000);
    });

    volumeControl.addEventListener('input', (e) => {
        currentVolume = e.target.value;
        player.volume = currentVolume;
        updateVolumeEmoji(currentVolume);
    });

    playPauseBtn.addEventListener('click', () => {
        if (player.paused) {
            player.play();
            playPauseBtn.textContent = '⏸️';
        } else {
            player.pause();
            playPauseBtn.textContent = '▶️';
        }
    });

    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    });

    player.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    });

    player.volume = currentVolume;
});