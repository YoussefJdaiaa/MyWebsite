document.addEventListener("DOMContentLoaded", function() {
    const frenchBtn = document.getElementById('frenchBtn');
    const englishBtn = document.getElementById('englishBtn');
    const switchButton = document.getElementById('switchLanguage');

    if (frenchBtn) {
        frenchBtn.addEventListener('click', () => {
            window.location.href = 'site.fr.html';
        });
    }

    if (englishBtn) {
        englishBtn.addEventListener('click', () => {
            window.location.href = 'site.eng.html';
        });
    }

    if (switchButton) {
        switchButton.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            if (currentLang === 'fr') {
                window.location.href = 'site.eng.html';
            } else {
                window.location.href = 'site.fr.html';
            }
        });
    }

    const sections = document.querySelectorAll("section");

    sections.forEach(section => {
        section.addEventListener("mouseenter", () => {
            section.style.transform = "scale(1.02)";
            section.style.transition = "transform 0.3s";
        });

        section.addEventListener("mouseleave", () => {
            section.style.transform = "scale(1)";
        });
    });
});
