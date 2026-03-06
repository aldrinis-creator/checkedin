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
    const initCRMModules = () => {
        const navItems = document.querySelectorAll('.ccrm-sidebar .nav-item');
        const modules = document.querySelectorAll('.crm-module');

        if (!navItems.length || !modules.length) return;

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const moduleId = item.getAttribute('data-module');
                if (!moduleId) return; // Skip if no data-module (e.g. Logout)

                e.preventDefault();

                // Update Sidebar
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Update Modules
                modules.forEach(m => m.classList.remove('active'));
                const targetModule = document.getElementById(`module-${moduleId}`);
                if (targetModule) {
                    targetModule.classList.add('active');
                }
            });
        });
    };

    initCRMModules();

    const resolveSosBtns = document.querySelectorAll('.resolve-sos-btn');
    resolveSosBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to resolve this SOS alert? All guardians will be notified.')) {
                const sosPanel = btn.closest('.sos-panel');
                if (sosPanel) {
                    sosPanel.style.display = 'none';
                }
                alert('SOS Alert Resolved. Emergency Actions Logged.');
            }
        });
    });

    // Generic Search Filter for Active Module Table
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const activeModule = document.querySelector('.crm-module.active');
            if (!activeModule) return;

            const rows = activeModule.querySelectorAll('.ccrm-table tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(term)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    /* =========================================
       CCRM Authentication Logic
       ========================================= */
    const initCCRMAuth = () => {
        const loginGate = document.getElementById('ccrm-login-gate');
        const loginBtn = document.getElementById('ccrm-login-btn');
        const logoutBtn = document.getElementById('ccrm-logout-btn');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMsg = document.getElementById('login-error-msg');

        if (!loginGate || !loginBtn) return;

        // Check for existing session
        if (sessionStorage.getItem('ccrm_authenticated') === 'true') {
            document.body.classList.add('is-authenticated');
            loginGate.style.display = 'none';
        }

        const handleLogin = () => {
            const user = usernameInput.value;
            const pass = passwordInput.value;

            // Simplified admin check
            if (user === 'admin' && pass === 'guardian2026') {
                sessionStorage.setItem('ccrm_authenticated', 'true');
                document.body.classList.add('is-authenticated');
                loginGate.style.display = 'none';
                errorMsg.style.display = 'none';
            } else {
                errorMsg.style.display = 'block';
                passwordInput.value = '';
            }
        };

        loginBtn.addEventListener('click', handleLogin);

        // Allow 'Enter' key to login
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleLogin();
            });
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('ccrm_authenticated');
                window.location.reload();
            });
        }
    };

    initCCRMAuth();
});
