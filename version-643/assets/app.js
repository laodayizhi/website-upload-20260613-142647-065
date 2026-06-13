(function() {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (!value) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
      dot.setAttribute('aria-current', dotIndex === current ? 'true' : 'false');
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  if (filterPanel) {
    var keywordInput = filterPanel.querySelector('[data-filter="keyword"]');
    var regionSelect = filterPanel.querySelector('[data-filter="region"]');
    var typeSelect = filterPanel.querySelector('[data-filter="type"]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
    var params = new URLSearchParams(window.location.search);
    var initialKeyword = params.get('q') || '';

    if (keywordInput && initialKeyword) {
      keywordInput.value = initialKeyword;
    }

    function includes(text, keyword) {
      return String(text || '').toLowerCase().indexOf(String(keyword || '').toLowerCase()) !== -1;
    }

    function applyFilters() {
      var keyword = keywordInput ? keywordInput.value.trim() : '';
      var region = regionSelect ? regionSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';

      cards.forEach(function(card) {
        var hay = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.textContent
        ].join(' ');
        var okKeyword = !keyword || includes(hay, keyword);
        var okRegion = !region || card.getAttribute('data-region') === region;
        var okType = !type || card.getAttribute('data-type') === type;
        card.classList.toggle('is-hidden', !(okKeyword && okRegion && okType));
      });
    }

    [keywordInput, regionSelect, typeSelect].forEach(function(control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
