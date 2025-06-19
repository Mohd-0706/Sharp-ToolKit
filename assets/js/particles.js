// particles-hero.js

document.addEventListener("DOMContentLoaded", function () {
    const heroContainer = document.getElementById("hero-shapes");
    if (!heroContainer) return;

    // Load particles.js config
    particlesJS("hero-shapes", {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#4f46e5" }, // indigo
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 4, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#6366f1",
                opacity: 0.4,
                width: 1,
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            },
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
            },
        },
        retina_detect: true,
    });
});
