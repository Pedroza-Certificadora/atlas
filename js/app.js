document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const developmentLinks = document.querySelectorAll(
        '.portal-card[href="#"]'
    );

    developmentLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
        });
    });
});
