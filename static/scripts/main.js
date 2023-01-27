// Page functionality
    const header_height = document.querySelector("header").offsetHeight;
    const nav_links = document.querySelectorAll("nav a");
    const logo = document.querySelector("#club-logo");
    const burger_open = document.querySelector("#open-burger-nav");
    const burger_close = document.querySelector("#close-burger-nav");
    const nav = document.querySelector("nav");
    const toggle_lang_btn = document.querySelector("#toggle-language");

    const english_elements = document.querySelectorAll(".en")
    const finnish_elements = document.querySelectorAll(".fi")

    let cookies = {};
    if (document.cookie === "") {
        document.cookie = "language=fi;";
    }

    document.cookie.split(';').map(cookieString => {
        let keyVal = cookieString.split('=');
        cookies[keyVal[0].trim()] = keyVal[1].trim();
    });

    const bake_cookies = () => {
        let cookieString = "";
        for (const [key, value] of Object.entries(cookies)) {
            cookieString = cookieString.concat(`${key}=${value};`);
        }

        document.cookie=cookieString;
    };

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
    };

    const open_burger = () => {
        burger_close.style.display="flex";
        burger_open.style.display="none";
        if ( ! nav.classList.contains('show') ) {
            nav.classList.toggle('show');
        }
    };

    const close_burger = () => {
        burger_close.style.display="none";
        burger_open.style.display="flex";
        if ( nav.classList.contains('show') ) {
            nav.classList.toggle('show');
        }
    }

    // toggle burger
    burger_open.addEventListener("click", event => {
        open_burger();
    });

    burger_close.addEventListener("click", event => {
        close_burger();
    });

    if (window.innerWidth < 800) {
        if ( ! nav.classList.contains('burger') ) {
            nav.classList.toggle('burger');
        }
        burger_open.style.display = 'flex';
    }

    window.matchMedia('(min-width: 800px)').addEventListener('change', event => {
        if (window.innerWidth < 800) {
            if ( ! nav.classList.contains('burger') ) {
                nav.classList.toggle('burger');
            }

            if (nav.classList.contains('show')) {
                open_burger();
            } else {
                close_burger();
            }
        } else {
            if ( nav.classList.contains('burger') ) {
                nav.classList.toggle('burger');
            }
            burger_open.style.display = 'none';
            burger_close.style.display = 'none';
            if (nav.classList.contains('show')) {
                nav.classList.toggle('show');
            }
        }
    });

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


    // language
    const update_language = (lang) => {
        if (lang === "en") {
            finnish_elements.forEach(element => {
                element.style.display="none";
            });
            english_elements.forEach(element => {
                element.style.display="";
            });
        } else {
            english_elements.forEach(element => {
                element.style.display="none";
            });
            finnish_elements.forEach(element => {
                element.style.display="";
            });
        }
    };

    toggle_lang_btn.addEventListener("click", event => {
        if (cookies.language === "fi") {
            cookies.language = "en";
        } else {
            cookies.language = "fi";
        }
        update_language(cookies.language);
        bake_cookies();
        console.log(document.cookie);
    });

    update_language(cookies.language);
