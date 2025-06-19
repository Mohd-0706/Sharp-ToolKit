/**
 * Initialize all GSAP animations and transitions
 */
document.addEventListener('DOMContentLoaded', () => {
    initTypingAnimation();
    initFloatingIconsGSAP();
    initScrollAnimationsGSAP();
    initPageTransitionsGSAP();
});

/**
 * Typing animation (type + delete effect)
 */
function initTypingAnimation() {
    const words = ['Workflow', 'Documents', 'Images', 'Videos', 'Education'];
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const word = words[wordIndex];
        typingText.textContent = word.substring(0, charIndex);

        if (!isDeleting && charIndex < word.length) {
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 60);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 1000);
        }
    }

    gsap.set(typingText, { opacity: 1 });
    type();
}

/**
 * Floating icons animation (yoyo bounce)
 */
function initFloatingIconsGSAP() {
    const icons = document.querySelectorAll('.animate-float, .animate-float-reverse');
    icons.forEach(el => {
        const dir = el.classList.contains('animate-float-reverse') ? -1 : 1;
        gsap.to(el, {
            y: 10 * dir,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimationsGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero section
    const hero = document.querySelector('#home, .hero-content');
    if (hero) {
        gsap.from(hero, {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        });
    }

    // Tool cards
    gsap.utils.toArray('.tool-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 80, rotation: -5 },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.4,
                ease: 'back.out(1.7)',
                delay: i * 0.05
            }
        );
    });

    // Feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: -50, rotation: 10 },
            {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.4,
                ease: 'power2.out',
                delay: i * 0.05
            }
        );
    });

    // Generic animate-on-scroll
    gsap.utils.toArray('.animate-on-scroll').forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power1.out',
                delay: i * 0.03
            }
        );
    });

    setTimeout(() => ScrollTrigger.refresh(), 300);
}

/**
 * Page transitions & dynamic section loader
 */
function initPageTransitionsGSAP() {
    // Disable auto scroll restore
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // Fade-in page on load
    gsap.set('body', { opacity: 0, y: 30 });
    gsap.to('body', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => window.scrollTo(0, 0)
    });

    // Normal page link transitions
    const pageLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"])');
    pageLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const url = link.href;
            const isSameHost = new URL(url, location.origin).origin === location.origin;
            if (!isSameHost) return;

            e.preventDefault();

            gsap.to('body', {
                opacity: 0,
                y: -30,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    window.location.href = url;
                }
            });
        });
    });

    // Dynamic content loader for tools
    const dynamicLinks = document.querySelectorAll('a[data-load="true"]');
    dynamicLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetUrl = link.getAttribute('href');
            const container = document.querySelector('#tool-container');
            if (!targetUrl || !container) return;

            // Animate out old content
            gsap.to(container, {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    fetch(targetUrl)
                        .then(res => res.text())
                        .then(html => {
                            container.innerHTML = html;

                            // Animate in new content
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            gsap.fromTo(container,
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                            );

                            // Re-initialize for new content
                            initScrollAnimationsGSAP();
                            initFloatingIconsGSAP();
                        });
                }
            });
        });
    });
}
