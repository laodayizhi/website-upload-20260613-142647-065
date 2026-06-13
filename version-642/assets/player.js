(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.watch-player'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var coverButton = player.querySelector('.player-poster');
    var actionButton = player.querySelector('.player-action');
    var streamUrl = player.getAttribute('data-stream');
    var isReady = false;
    var hlsInstance = null;

    function prepareVideo() {
      if (isReady || !video || !streamUrl) {
        return;
      }

      isReady = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 32,
          enableWorker: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function startPlayback() {
      prepareVideo();
      player.classList.add('is-playing');
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    if (coverButton) {
      coverButton.addEventListener('click', startPlayback);
    }

    if (actionButton) {
      actionButton.addEventListener('click', startPlayback);
    }

    if (video) {
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
