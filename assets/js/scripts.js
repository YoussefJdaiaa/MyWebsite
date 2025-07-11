// Modern JavaScript for enhanced user experience
document.addEventListener('DOMContentLoaded', function() {
    // Language switcher
    const switchLanguageBtn = document.getElementById('switchLanguage');
    if (switchLanguageBtn) {
        switchLanguageBtn.addEventListener('click', function() {
            const currentLang = document.documentElement.lang;
            if (currentLang === 'fr') {
                // From French to English
                window.location.href = '../en/site.eng.html';
            } else {
                // From English to French
                window.location.href = '../fr/site.fr.html';
            }
        });
    }

    // Simple hover effects for project items
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
    });
});