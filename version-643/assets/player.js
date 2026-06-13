(function() {
  function activatePlayer(shell) {
    var video = shell.querySelector('video');
    var stream = shell.getAttribute('data-stream');

    if (!video || !stream) {
      return;
    }

    if (!shell.dataset.ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new Hls({ enableWorker: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
        shell._hls = hls;
      } else {
        video.src = stream;
      }
      shell.dataset.ready = '1';
    }

    shell.classList.add('is-playing');
    video.controls = true;
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function() {});
    }
  }

  document.querySelectorAll('.player-shell').forEach(function(shell) {
    var button = shell.querySelector('.play-start');
    var video = shell.querySelector('video');

    if (button) {
      button.addEventListener('click', function() {
        activatePlayer(shell);
      });
    }

    if (video) {
      video.addEventListener('click', function() {
        if (!shell.classList.contains('is-playing')) {
          activatePlayer(shell);
        }
      });
    }
  });
})();
