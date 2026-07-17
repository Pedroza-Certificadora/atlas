document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".header-menu-button");
    const menu = document.querySelector(".header-menu");
    const menuLinks = document.querySelectorAll(".header-menu a");

    if (!menuButton || !menu) {
        return;
    }

    const closeMenu = () => {
        menu.classList.remove("active");
        menuButton.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    menuButton.addEventListener("click", () => {
        const willOpen = !menu.classList.contains("active");

        menu.classList.toggle("active", willOpen);
        menuButton.classList.toggle("active", willOpen);
        menuButton.setAttribute(
            "aria-expanded",
            String(willOpen)
        );

        document.body.classList.toggle("menu-open", willOpen);
    });

    menuLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) {
            closeMenu();
        }
    });
});
