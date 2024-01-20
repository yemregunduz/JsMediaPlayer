document.addEventListener("DOMContentLoaded", function () {
  (function () {
    let musicPlayer = document.getElementById("music-player"),
      bgArtwork = document.getElementById("bg-artwork"),
      artistName = document.getElementById("artist-name"),
      songName = document.getElementById("song-name"),
      artistImage = document.getElementById("artist-image"),
      seekContainer = document.getElementById("seek-container"),
      seekBar = document.getElementById("seek-bar"),
      songTime = document.getElementById("song-time"),
      targetTime = document.getElementById("target-time"),
      sHover = document.getElementById("tooltip"),
      playPauseButton = document.getElementById("play-pause-button"),
      i = playPauseButton.querySelector("i"),
      tProgress = document.getElementById("current-time"),
      songLength = document.getElementById("song-length"),
      seekLength,
      seekLocation,
      seekBarPosition,
      cM,
      ctMinutes,
      ctSeconds,
      currentMinutes,
      currentSeconds,
      durationMinutes,
      durationSeconds,
      playProgress,
      bTime,
      nTime = 0,
      loadingInterval = null,
      timeFlag = false,
      playPreviousTrackButton = document.getElementById("play-previous"),
      playNextTrackButton = document.getElementById("play-next"),
      currentIndex = -1,
      musics = [
        {
          artwork: "1",
          name: "Küskünüm",
          artist: "Müslüm Gürses",
          url: "./assets/musics/kuskunum.mp3",
        },
        {
          artwork: "2",
          name: "Çiçekler Açsın",
          artist: "Ferdi Tayfur",
          url: "./assets/musics/cicekler-acsin.mp3",
        },
        {
          artwork: "3",
          name: "Mevsim Bahar Olunca",
          artist: "Orhan Gencabay",
          url: "./assets/musics/mevsim-bahar-olunca.mp3",
        },
        {
          artwork: "4",
          name: "Fatmam",
          artist: "Tolga Çandar",
          url: "./assets/musics/fatmam.mp3",
        },
        {
          artwork: "5",
          name: "Dünya",
          artist: "KUAN",
          url: "./assets/musics/dunya.mp3",
        },
        {
          artwork: "6",
          name: "Altaylardan Tunaya",
          artist: "Ali Aksoy",
          url: "./assets/musics/altaylardan-tunaya.mp3",
        },
      ];

    function playOrPause() {
      setTimeout(function () {
        if (audio.paused) play();
        else pause();
      }, 100);
    }

    function play() {
      musicPlayer.classList.add("active");
      artistImage.classList.add("active");
      checkIfIsLoading();
      i.className = "fa fa-pause";
      audio.play();
    }

    function pause() {
      musicPlayer.classList.remove("active");
      artistImage.classList.remove("active");
      clearInterval(loadingInterval);
      artistImage.classList.remove("buffering");
      i.className = "fa fa-play";
      audio.pause();
    }

    function showHover(event) {
      seekBarPosition = seekContainer.getBoundingClientRect();
      seekLength = event.clientX - seekBarPosition.left;
      seekLocation = audio.duration * (seekLength / seekContainer.offsetWidth);

      sHover.style.width = seekLength + "px";

      cM = seekLocation / 60;

      ctMinutes = Math.floor(cM);
      ctSeconds = Math.floor(seekLocation - ctMinutes * 60);

      if (
        ctMinutes < 0 ||
        ctSeconds < 0 ||
        isNaN(ctMinutes) ||
        isNaN(ctSeconds)
      ) {
        targetTime.innerText = "--:--";
      } else {
        ctMinutes = ctMinutes < 10 ? "0" + ctMinutes : ctMinutes;
        ctSeconds = ctSeconds < 10 ? "0" + ctSeconds : ctSeconds;
        targetTime.innerText = ctMinutes + ":" + ctSeconds;
      }

      targetTime.style.left = seekLength + "px";
      targetTime.style.marginLeft = "-21px";
      targetTime.style.display = "block";
    }

    function hideHover() {
      sHover.style.width = "0";
      targetTime.style.display = "none";
    }

    function changeCurrentSongTime() {
      audio.currentTime = seekLocation;
      seekBar.style.width = seekLength + "px";
    }

    function updateCurrentTime() {
      nTime = new Date();
      nTime = nTime.getTime();

      if (!timeFlag) {
        timeFlag = true;
        songTime.classList.add("active");
      }

      currentMinutes = Math.floor(audio.currentTime / 60);
      currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);

      durationMinutes = Math.floor(audio.duration / 60);
      durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

      playProgress = (audio.currentTime / audio.duration) * 100;

      currentMinutes = formatTime(currentMinutes);
      currentSeconds = formatTime(currentSeconds);
      durationMinutes = formatTime(durationMinutes);
      durationSeconds = formatTime(durationSeconds);

      if (isNaN(currentMinutes) || isNaN(currentSeconds))
        tProgress.innerText = "00:00";
      else tProgress.innerText = currentMinutes + ":" + currentSeconds;

      if (isNaN(durationMinutes) || isNaN(durationSeconds))
        songLength.innerText = "00:00";
      else songLength.innerText = durationMinutes + ":" + durationSeconds;

      if (
        isNaN(currentMinutes) ||
        isNaN(currentSeconds) ||
        isNaN(durationMinutes) ||
        isNaN(durationSeconds)
      )
        songTime.classList.remove("active");
      else songTime.classList.add("active");

      seekBar.style.width = playProgress + "%";

      if (playProgress == 100) {
        nextSong();
      }
    }

    function formatTime(time) {
      return time < 10 ? "0" + time : time;
    }

    function nextSong() {
      seekBar.style.width = "0";
      tProgress.innerText = "00:00";
      artistImage.classList.remove("buffering");
      selectSong(1);
      clearInterval(loadingInterval);
    }

    resetSongTime = () => {
      seekBar.style.width = "0";
      songTime.classList.remove("active");
      tProgress.innerText = "00:00";
      songLength.innerText = "00:00";
    };

    function checkIfIsLoading() {
      clearInterval(loadingInterval);
      loadingInterval = setInterval(function () {
        if (nTime == 0 || bTime - nTime > 1000)
          artistImage.classList.add("buffering");
        else artistImage.classList.remove("buffering");

        bTime = new Date();
        bTime = bTime.getTime();
      }, 100);
    }

    function resetSongTime() {
      seekBar.style.width = "0";
      songTime.classList.remove("active");
      tProgress.innerText = "00:00";
      songLength.innerText = "00:00";
    }

    function selectSong(flag) {
      flag == 0 || flag == 1 ? ++currentIndex : --currentIndex;

      currentIndex = currentIndex < 0 ? musics.length - 1 : currentIndex;
      currentIndex = currentIndex > musics.length - 1 ? 0 : currentIndex;

      if (currentIndex > -1 && currentIndex < musics.length) {
        if (flag == 0) i.className = "fa fa-play";
        else {
          artistImage.classList.remove("buffering");
          i.className = "fa fa-pause";
        }

        resetSongTime();
        setCurrentSong(flag);

        nTime = 0;
        bTime = new Date().getTime();
      } else {
        if (flag == 0 || flag == 1) --currentIndex;
        else ++currentIndex;
      }
    }

    function setCurrentSong(flag) {
      localStorage.setItem(
        "currentMusic",
        JSON.stringify(musics[currentIndex])
      );

      const { name, artist, artwork, url } = musics[currentIndex];
      audio.src = url;

      if (flag != 0) {
        audio.play();
        musicPlayer.classList.add("active");
        artistImage.classList.add("active");

        clearInterval(loadingInterval);
        checkIfIsLoading();
      }

      artistName.innerText = artist;
      songName.innerText = name;
      document.querySelector("img.active").classList.remove("active");
      document.getElementById(artwork).classList.add("active");

      const artworkBgUrl = document.getElementById(artwork).getAttribute("src");

      bgArtwork.style.backgroundImage = "url(" + artworkBgUrl + ")";
    }

    function initPlayer() {
      audio = new Audio();
      selectSong(0);
      audio.loop = false;
      playPauseButton.addEventListener("click", playOrPause);

      seekContainer.addEventListener("mousemove", function (event) {
        showHover(event);
      });

      seekContainer.addEventListener("mouseout", hideHover);

      seekContainer.addEventListener("click", changeCurrentSongTime);

      audio.addEventListener("timeupdate", updateCurrentTime);

      playPreviousTrackButton.addEventListener("click", function () {
        selectSong(-1);
      });
      playNextTrackButton.addEventListener("click", function () {
        selectSong(1);
      });
    }

    initPlayer();
  })();
});
