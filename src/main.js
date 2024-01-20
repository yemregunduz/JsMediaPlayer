document.addEventListener("DOMContentLoaded", function () {
  (function () {
    let playerTrack = document.getElementById("player-track"),
      bgArtwork = document.getElementById("bg-artwork"),
      bgArtworkUrl,
      albumName = document.getElementById("album-name"),
      trackName = document.getElementById("track-name"),
      albumArt = document.getElementById("album-art"),
      sArea = document.getElementById("s-area"),
      seekBar = document.getElementById("seek-bar"),
      trackTime = document.getElementById("track-time"),
      insTime = document.getElementById("ins-time"),
      sHover = document.getElementById("s-hover"),
      playPauseButton = document.getElementById("play-pause-button"),
      i = playPauseButton.querySelector("i"),
      tProgress = document.getElementById("current-time"),
      tTime = document.getElementById("track-length"),
      seekT,
      seekLoc,
      seekBarPos,
      cM,
      ctMinutes,
      ctSeconds,
      curMinutes,
      curSeconds,
      durMinutes,
      durSeconds,
      playProgress,
      bTime,
      nTime = 0,
      buffInterval = null,
      tFlag = false,
      albums = ["Küskünüm", "Çiçekler Açsın", "Dünya", "Altaylardan Tunaya"],
      trackNames = ["Müslüm Gürses", "Ferdi Tayfur", "KUAN", "Ali Aksoy"],
      albumArtworks = ["_1", "_2", "_3", "_4"],
      trackUrl = [
        "./assets/musics/kuskunum.mp3",
        "./assets/musics/cicekler-acsin.mp3",
        "./assets/musics/dunya.mp3",
        "./assets/musics/altaylardan-tunaya.mp3",
      ],
      playPreviousTrackButton = document.getElementById("play-previous"),
      playNextTrackButton = document.getElementById("play-next"),
      currIndex = -1;

    function playPause() {
      setTimeout(function () {
        if (audio.paused) {
          playerTrack.classList.add("active");
          albumArt.classList.add("active");
          checkBuffering();
          i.className = "fa fa-pause";
          audio.play();
        } else {
          playerTrack.classList.remove("active");
          albumArt.classList.remove("active");
          clearInterval(buffInterval);
          albumArt.classList.remove("buffering");
          i.className = "fa fa-play";
          audio.pause();
        }
      }, 300);
    }

    function showHover(event) {
      seekBarPos = sArea.getBoundingClientRect();
      seekT = event.clientX - seekBarPos.left;
      seekLoc = audio.duration * (seekT / sArea.offsetWidth);

      sHover.style.width = seekT + "px";

      cM = seekLoc / 60;

      ctMinutes = Math.floor(cM);
      ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

      if (ctMinutes < 0 || ctSeconds < 0) return;

      if (ctMinutes < 0 || ctSeconds < 0) return;

      if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
      if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

      if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.innerText = "--:--";
      else insTime.innerText = ctMinutes + ":" + ctSeconds;

      insTime.style.left = seekT + "px";
      insTime.style.marginLeft = "-21px";
      insTime.style.display = "block";
    }

    function hideHover() {
      sHover.style.width = "0";
      insTime.innerText = "00:00";
      insTime.style.left = "0px";
      insTime.style.marginLeft = "0px";
      insTime.style.display = "none";
    }

    function playFromClickedPos() {
      audio.currentTime = seekLoc;
      seekBar.style.width = seekT + "px";
      hideHover();
    }

    function updateCurrTime() {
      nTime = new Date();
      nTime = nTime.getTime();

      if (!tFlag) {
        tFlag = true;
        trackTime.classList.add("active");
      }

      curMinutes = Math.floor(audio.currentTime / 60);
      curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

      durMinutes = Math.floor(audio.duration / 60);
      durSeconds = Math.floor(audio.duration - durMinutes * 60);

      playProgress = (audio.currentTime / audio.duration) * 100;

      if (curMinutes < 10) curMinutes = "0" + curMinutes;
      if (curSeconds < 10) curSeconds = "0" + curSeconds;

      if (durMinutes < 10) durMinutes = "0" + durMinutes;
      if (durSeconds < 10) durSeconds = "0" + durSeconds;

      if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.innerText = "00:00";
      else tProgress.innerText = curMinutes + ":" + curSeconds;

      if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.innerText = "00:00";
      else tTime.innerText = durMinutes + ":" + durSeconds;

      if (
        isNaN(curMinutes) ||
        isNaN(curSeconds) ||
        isNaN(durMinutes) ||
        isNaN(durSeconds)
      )
        trackTime.classList.remove("active");
      else trackTime.classList.add("active");

      seekBar.style.width = playProgress + "%";

      if (playProgress == 100) {
        i.className = "fa fa-play";
        seekBar.style.width = "0";
        tProgress.innerText = "00:00";
        albumArt.classList.remove("buffering");
        selectTrack(1);
        clearInterval(buffInterval);
      }
    }

    function checkBuffering() {
      clearInterval(buffInterval);
      buffInterval = setInterval(function () {
        if (nTime == 0 || bTime - nTime > 1000)
          albumArt.classList.add("buffering");
        else albumArt.classList.remove("buffering");

        bTime = new Date();
        bTime = bTime.getTime();
      }, 100);
    }

    function selectTrack(flag) {
      if (flag == 0 || flag == 1) ++currIndex;
      else --currIndex;

      if (currIndex > -1 && currIndex < albumArtworks.length) {
        if (flag == 0) i.className = "fa fa-play";
        else {
          albumArt.classList.remove("buffering");
          i.className = "fa fa-pause";
        }

        seekBar.style.width = "0";
        trackTime.classList.remove("active");
        tProgress.innerText = "00:00";
        tTime.innerText = "00:00";

        currAlbum = albums[currIndex];
        currTrackName = trackNames[currIndex];
        currArtwork = albumArtworks[currIndex];

        audio.src = trackUrl[currIndex];

        nTime = 0;
        bTime = new Date();
        bTime = bTime.getTime();

        if (flag != 0) {
          audio.play();
          playerTrack.classList.add("active");
          albumArt.classList.add("active");

          clearInterval(buffInterval);
          checkBuffering();
        }

        albumName.innerText = currAlbum;
        trackName.innerText = currTrackName;
        document.querySelector("img.active").classList.remove("active");
        document.getElementById(currArtwork).classList.add("active");

        bgArtworkUrl = document.getElementById(currArtwork).getAttribute("src");

        bgArtwork.style.backgroundImage = "url(" + bgArtworkUrl + ")";
      } else {
        if (flag == 0 || flag == 1) --currIndex;
        else ++currIndex;
      }
    }

    function initPlayer() {
      audio = new Audio();

      selectTrack(0);

      audio.loop = false;

      playPauseButton.addEventListener("click", playPause);

      sArea.addEventListener("mousemove", function (event) {
        showHover(event);
      });

      sArea.addEventListener("mouseout", hideHover);

      sArea.addEventListener("click", playFromClickedPos);

      audio.addEventListener("timeupdate", updateCurrTime);

      playPreviousTrackButton.addEventListener("click", function () {
        selectTrack(-1);
      });
      playNextTrackButton.addEventListener("click", function () {
        selectTrack(1);
      });
    }

    initPlayer();
  })();
});
