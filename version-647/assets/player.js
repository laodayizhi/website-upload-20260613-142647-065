
(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var video = document.querySelector('[data-player-video]');
        var overlay = document.querySelector('[data-player-overlay]');
        if (!video) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var attached = false;
        var hlsInstance = null;

        function attachStream() {
            if (attached || !stream) {
                return;
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                attached = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
                attached = true;
                return;
            }
            video.src = stream;
            attached = true;
        }

        function startPlayback() {
            attachStream();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });
        window.addEventListener('pagehide', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    });
})();
