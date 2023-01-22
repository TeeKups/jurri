// Page functionality
(() => {
    const header_height = document.querySelector("header").offsetHeight;
    const nav_links = document.querySelectorAll("nav a");
    const logo = document.querySelector("#club-logo");
    const burger_open = document.querySelector("#open-burger-nav");
    const burger_close = document.querySelector("#close-burger-nav");
    const burger_nav = document.querySelector("#burger-nav");

    const clear_nav_links = () => nav_links.forEach(link => {
        link.classList.remove("active");
    });

    const scroll_to = event => {
        let target_top = document.querySelector(event.target.hash).getBoundingClientRect().top - header_height;
        let start_pos = window.scrollY;
        document.body.scrollTo({
            top: start_pos + target_top,
            left: 0
        });
    }

    const open_burger = () => {
        burger_close.style.display="flex";
        burger_nav.style.display="flex";
        burger_open.style.display="none";
    };

    const close_burger = () => {
        burger_close.style.display="none";
        burger_nav.style.display="none";
        burger_open.style.display="flex";
    }

    // set navlink actions
    nav_links.forEach(link => link.addEventListener("click", event => {
        if (link.hasAttribute("scroll"))
            event.preventDefault();

        clear_nav_links();

        event.target.classList.add("active");

        if (link.hasAttribute("scroll")) {
            console.log("scrolling");
            scroll_to(event);
        }

        link.classList.add("active");

        if (getComputedStyle(burger_nav).getPropertyValue("display") != "none") {
            close_burger();
        }
    }));


    // toggle burger
    burger_open.addEventListener("click", event => {
        open_burger();
    });

    burger_close.addEventListener("click", event => {
        close_burger();
    });
})();
