(function () {
  var body = document.body;
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var searchLayer = document.getElementById('site-search');
  var searchOpenButtons = document.querySelectorAll('[data-search-open]');
  var searchCloseButton = document.querySelector('[data-search-close]');
  var searchInput = document.getElementById('global-search-input');
  var searchResults = document.getElementById('global-search-results');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function openSearch() {
    if (!searchLayer) {
      return;
    }
    searchLayer.classList.add('is-open');
    searchLayer.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    setTimeout(function () {
      if (searchInput) {
        searchInput.focus();
      }
    }, 20);
  }

  function closeSearch() {
    if (!searchLayer) {
      return;
    }
    searchLayer.classList.remove('is-open');
    searchLayer.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  }

  searchOpenButtons.forEach(function (button) {
    button.addEventListener('click', openSearch);
  });

  if (searchCloseButton) {
    searchCloseButton.addEventListener('click', closeSearch);
  }

  if (searchLayer) {
    searchLayer.addEventListener('click', function (event) {
      if (event.target === searchLayer) {
        closeSearch();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeSearch();
    }
  });

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function renderSearch() {
    if (!searchInput || !searchResults) {
      return;
    }
    var query = normalize(searchInput.value);
    var items = window.SEARCH_ITEMS || [];
    if (!query) {
      searchResults.innerHTML = '<p class="empty-tip is-visible">输入关键词后显示匹配影片</p>';
      return;
    }
    var matched = items.filter(function (item) {
      return normalize(item.title + ' ' + item.region + ' ' + item.type + ' ' + item.year + ' ' + item.genre + ' ' + item.tags).indexOf(query) !== -1;
    }).slice(0, 30);
    if (!matched.length) {
      searchResults.innerHTML = '<p class="empty-tip is-visible">没有找到匹配内容</p>';
      return;
    }
    searchResults.innerHTML = matched.map(function (item) {
      return [
        '<a class="search-result" href="' + item.url + '">',
        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" onerror="this.classList.add(\'is-missing\')">',
        '<span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.type) + '</span></span>',
        '</a>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (searchInput) {
    searchInput.addEventListener('input', renderSearch);
    renderSearch();
  }

  document.querySelectorAll('[data-local-filter]').forEach(function (input) {
    input.addEventListener('input', function () {
      var query = normalize(input.value);
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-filter') || card.textContent);
        var matched = !query || text.indexOf(query) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      document.querySelectorAll('[data-empty-tip]').forEach(function (tip) {
        tip.classList.toggle('is-visible', visible === 0);
      });
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startHero() {
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        clearInterval(timer);
        showSlide(Number(dot.getAttribute('data-hero-dot')));
        startHero();
      });
    });

    if (slides.length > 1) {
      startHero();
    }
  }

  window.setupMoviePlayer = function (videoUrl) {
    var video = document.getElementById('movie-player');
    var overlay = document.getElementById('player-overlay');
    if (!video || !overlay || !videoUrl) {
      return;
    }

    var hlsInstance = null;
    var ready = false;

    function playVideo() {
      overlay.classList.add('is-hidden');
      video.controls = true;
      var request = video.play();
      if (request && typeof request.catch === 'function') {
        request.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    }

    function attachAndPlay() {
      if (ready) {
        playVideo();
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoUrl;
        ready = true;
        playVideo();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(videoUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          ready = true;
          playVideo();
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
            video.src = videoUrl;
            ready = true;
            playVideo();
          }
        });
        return;
      }

      video.src = videoUrl;
      ready = true;
      playVideo();
    }

    overlay.addEventListener('click', attachAndPlay);
    video.addEventListener('click', function () {
      if (video.paused) {
        attachAndPlay();
      }
    });
  };
})();
