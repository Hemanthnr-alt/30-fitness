document.addEventListener('DOMContentLoaded', () => {

    // ── Starfield Canvas ──────────────────────────────────────
    const canvas = document.getElementById('starfield');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 120; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.2,
                a: Math.random(),
                speed: Math.random() * 0.004 + 0.002,
                phase: Math.random() * Math.PI * 2
            });
        }

        const drawStars = (t) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.a = 0.3 + 0.4 * Math.sin(t * s.speed + s.phase);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 190, 255, ${s.a})`;
                ctx.fill();
            });
            requestAnimationFrame(drawStars);
        };
        requestAnimationFrame(drawStars);
    }

    // ── Scroll Progress ───────────────────────────────────────
    const progressBar = document.getElementById('scroll-progress');
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        const scrolled = document.documentElement.scrollTop;
        const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (progressBar) progressBar.style.width = `${(scrolled / total) * 100}%`;
        if (nav) nav.classList.toggle('scrolled', scrolled > 60);
    }, { passive: true });

    // ── Hamburger Menu ────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('.mob-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ── Reveal on Scroll ──────────────────────────────────────
    const revealEls = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    // Trigger hero immediately
    setTimeout(() => {
        document.querySelectorAll('.hero [data-reveal]').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // ── Counter Animation ─────────────────────────────────────
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            const duration = 1600;
            const start = performance.now();

            const update = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ── FAQ Accordion ─────────────────────────────────────────
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-q');
        const answer = item.querySelector('.faq-a');

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('open');
                other.querySelector('.faq-a').style.maxHeight = null;
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ── Plan Bar Animations ───────────────────────────────────
    const planBars = document.querySelectorAll('.plan-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = el.style.width;
                el.style.width = '0%';
                setTimeout(() => { el.style.width = target; }, 200);
                barObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    planBars.forEach(b => barObserver.observe(b));

    // ── Smooth Scroll for Anchor Links ────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ── Subtle Mouse Parallax on ambient glows ─────────────────
    const a1 = document.querySelector('.a1');
    const a2 = document.querySelector('.a2');
    let rafPending = false;

    document.addEventListener('mousemove', (e) => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            const nx = (e.clientX / window.innerWidth - 0.5);
            const ny = (e.clientY / window.innerHeight - 0.5);
            if (a1) a1.style.transform = `translate(${nx * 60}px, ${ny * 60}px)`;
            if (a2) a2.style.transform = `translate(${nx * -80}px, ${ny * -80}px)`;
            rafPending = false;
        });
    });

});