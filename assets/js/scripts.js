document.addEventListener('DOMContentLoaded', () => {
    const switchLanguageBtn = document.getElementById('switchLanguage');

    if (switchLanguageBtn) {
        const explicitTarget = switchLanguageBtn.dataset.target;
        let fallbackTarget = '../fr/site.fr.html';

        if (document.documentElement.lang === 'fr') {
            fallbackTarget = '../en/site.eng.html';
        }

        switchLanguageBtn.addEventListener('click', () => {
            window.location.href = explicitTarget || fallbackTarget;
        });
    }

    document.querySelectorAll('.reveal').forEach((element) => {
        element.classList.add('visible');
    });
});
