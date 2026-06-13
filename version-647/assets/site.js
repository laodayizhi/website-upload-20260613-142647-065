
(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
            return;
        }
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        var toggle = document.querySelector('[data-menu-toggle]');
        var mobileNav = document.querySelector('[data-mobile-nav]');
        if (toggle && mobileNav) {
            toggle.addEventListener('click', function () {
                mobileNav.classList.toggle('is-open');
                document.body.classList.toggle('menu-open', mobileNav.classList.contains('is-open'));
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }
                index = (nextIndex + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                    start();
                });
            });
            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    start();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    start();
                });
            }
            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var searchInput = document.querySelector('[data-search-input]');
        var categorySelect = document.querySelector('[data-category-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var emptyState = document.querySelector('[data-empty-state]');

        function filterCards() {
            if (!cards.length) {
                return;
            }
            var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
            var category = categorySelect ? categorySelect.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = (card.getAttribute('data-search') || '').toLowerCase();
                var cardCategory = card.getAttribute('data-category') || '';
                var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchedCategory = !category || cardCategory === category;
                var matched = matchedKeyword && matchedCategory;
                card.classList.toggle('card-hidden', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        }

        if (searchInput && cards.length) {
            searchInput.addEventListener('input', filterCards);
        }
        if (categorySelect && cards.length) {
            categorySelect.addEventListener('change', filterCards);
        }
    });
})();
