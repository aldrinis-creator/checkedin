document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Navigation Scroll Effect
       ========================================= */
    const header = document.getElementById('site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* =========================================
       Smooth Scrolling for Anchor Links
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position considering fixed header height
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================
       Reveal on Scroll Animation
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* =========================================
       Pricing Toggle Logic
       ========================================= */
    const pricingToggle = document.getElementById('pricing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');
    const priceElements = document.querySelectorAll('.price');
    const durationElements = document.querySelectorAll('.duration');

    if (pricingToggle) {
        pricingToggle.addEventListener('change', function () {
            const isYearly = this.checked;

            // Update Labels
            if (isYearly) {
                labelYearly.classList.add('active');
                labelMonthly.classList.remove('active');
            } else {
                labelMonthly.classList.add('active');
                labelYearly.classList.remove('active');
            }

            // Update Prices and Durations with a quick blink effect
            priceElements.forEach(priceEl => {
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    priceEl.textContent = isYearly ? priceEl.dataset.yearly : priceEl.dataset.monthly;
                    priceEl.style.opacity = '1';
                }, 200);
            });

            durationElements.forEach(durationEl => {
                durationEl.style.opacity = '0';
                setTimeout(() => {
                    durationEl.textContent = isYearly ? durationEl.dataset.yearly : durationEl.dataset.monthly;
                    durationEl.style.opacity = '1';
                }, 200);
            });

        });
    }
});
