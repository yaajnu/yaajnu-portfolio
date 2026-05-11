document.addEventListener('DOMContentLoaded', () => {

    // ── Copyright year ──────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Theme toggle ─────────────────────────────────────────────────
    const themeBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Persist preference
    const saved = localStorage.getItem('theme') || 'dark';
    root.setAttribute('data-theme', saved);
    updateToggleLabel(saved);

    themeBtn.addEventListener('click', () => {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleLabel(next);
    });

    function updateToggleLabel(theme) {
        themeBtn.textContent = theme === 'dark' ? '☀ LIGHT' : '☾ DARK';
        themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // ── Typewriter effect ────────────────────────────────────────────
    const target = document.getElementById('typewriter');       // green
    const prefix = document.getElementById('typewriter-prefix'); // white

    // Each entry: prefix text (white) + highlight text (green)
    const sequences = [
        { pre: "Hi, the name's ", hi: "Yaajnu",              pause: 1800 },
        { pre: "",                hi: "In love with coffee ☕", pause: 1600 },
        { pre: "",                hi: "Gym addict 🏋️",         pause: 1600 },
        { pre: "",                hi: "Obsessed with live concerts 🎵", pause: 1600 },
        { pre: "Hi, the name's ", hi: "Yaajnu",              pause: null },
    ];

    const TYPE_SPEED   = 75;
    const DELETE_SPEED = 40;

    let seqIndex = 0;

    function runSequence() {
        if (seqIndex >= sequences.length) return;
        const step = sequences[seqIndex];

        // 1. Type the white prefix first, then the green highlight
        typeInto(prefix, step.pre, TYPE_SPEED, () => {
            typeInto(target, step.hi, TYPE_SPEED, () => {
                if (step.pause === null) return; // final — stop forever
                setTimeout(() => {
                    // Backspace green first, then white
                    backspace(target, 0, DELETE_SPEED, () => {
                        backspace(prefix, 0, DELETE_SPEED, () => {
                            seqIndex++;
                            setTimeout(runSequence, 180);
                        });
                    });
                }, step.pause);
            });
        });
    }

    function typeInto(el, text, speed, done) {
        if (!text) { done(); return; }
        let i = 0;
        function tick() {
            if (i < text.length) {
                el.textContent += text[i++];
                setTimeout(tick, speed);
            } else {
                done();
            }
        }
        tick();
    }

    function backspace(el, keepLen, speed, done) {
        function tick() {
            if (el.textContent.length > keepLen) {
                el.textContent = el.textContent.slice(0, -1);
                setTimeout(tick, speed);
            } else {
                done();
            }
        }
        tick();
    }

    setTimeout(runSequence, 500);

    // ── Skill bars: set CSS var for hover animation ──────────────────
    document.querySelectorAll('.skill-pill').forEach(pill => {
        const level = pill.getAttribute('data-level') || '0';
        pill.querySelector('.skill-bar').style.setProperty('--bar-width', level + '%');
        // Also set it directly so the CSS transition works
        pill.addEventListener('mouseenter', () => {
            pill.querySelector('.skill-bar').style.width = level + '%';
        });
        pill.addEventListener('mouseleave', () => {
            pill.querySelector('.skill-bar').style.width = '0%';
        });
    });

    // ── Active nav highlight on scroll ──────────────────────────────
    const sections = document.querySelectorAll('section[id], .content-section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));

    // ── Contact form (basic client-side handler) ─────────────────────
    window.handleSubmit = function (e) {
        e.preventDefault();
        const btn = e.target.querySelector('.submit-btn');
        btn.textContent = 'Sent ✓';
        btn.style.background = 'var(--accent)';
        btn.style.color = '#000';
        btn.disabled = true;
        e.target.reset();
        setTimeout(() => {
            btn.textContent = 'Submit';
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
        }, 3000);
    };

});
