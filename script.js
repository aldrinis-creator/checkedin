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

    /* =========================================
       FAQ Accordion Logic
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });

    /* =========================================
       CCRM Dashboard Interactivity
       ========================================= */
    const resolveSosBtn = document.querySelector('.sos-panel .btn');
    if (resolveSosBtn) {
        resolveSosBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to resolve this SOS alert? All guardians will be notified.')) {
                document.body.classList.remove('active-sos');
                alert('SOS Alert Resolved. Notification sent to primary guardian.');
            }
        });
    }

    // Simple Patient Search Filter
    const searchInput = document.querySelector('.header-search input');
    const patientRows = document.querySelectorAll('.ccrm-table tbody tr');

    if (searchInput && patientRows.length > 0) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            patientRows.forEach(row => {
                const name = row.querySelector('.patient-name').textContent.toLowerCase();
                const id = row.querySelector('span[style*="font-size: 0.75rem"]').textContent.toLowerCase();
                if (name.includes(term) || id.includes(term)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});
