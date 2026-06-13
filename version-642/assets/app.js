(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var params = new URLSearchParams(window.location.search);
  var queryValue = params.get('q') || '';
  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter(form) {
    var scope = document.querySelector(form.getAttribute('data-filter-scope')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.searchable-card'));
    var emptyState = document.querySelector(form.getAttribute('data-empty-target'));
    var keywordInput = form.querySelector('[name="q"]');
    var genreSelect = form.querySelector('[name="genre"]');
    var yearSelect = form.querySelector('[name="year"]');
    var keyword = normalize(keywordInput && keywordInput.value);
    var genre = normalize(genreSelect && genreSelect.value);
    var year = normalize(yearSelect && yearSelect.value);
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search'));
      var cardGenre = normalize(card.getAttribute('data-genre'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchGenre = !genre || cardGenre.indexOf(genre) !== -1;
      var matchYear = !year || cardYear === year;
      var matched = matchKeyword && matchGenre && matchYear;
      card.hidden = !matched;
      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  filterForms.forEach(function (form) {
    var keywordInput = form.querySelector('[name="q"]');
    if (keywordInput && queryValue) {
      keywordInput.value = queryValue;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter(form);
    });

    Array.prototype.slice.call(form.querySelectorAll('input, select')).forEach(function (input) {
      input.addEventListener('input', function () {
        applyFilter(form);
      });
      input.addEventListener('change', function () {
        applyFilter(form);
      });
    });

    applyFilter(form);
  });
})();
