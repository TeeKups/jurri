// Page functionality
const header_height = document.querySelector("header").offsetHeight;
const nav_links = document.querySelectorAll("nav a");
const logo = document.querySelector("#club-logo");
const burger_open = document.querySelector("#open-burger-nav");
const burger_close = document.querySelector("#close-burger-nav");
const nav = document.querySelector("nav");
const toggle_lang_btn = document.querySelector("#toggle-language");

const english_elements = document.querySelectorAll(".en");
const finnish_elements = document.querySelectorAll(".fi");

const LANGUAGES = ["fi", "en"];
const page_links = document.querySelectorAll("a[href$='.html']");

const stored_language = () => {
  try {
    return localStorage.getItem("language");
  } catch {
    return null;
  }
};

const store_language = lang => {
  try {
    localStorage.setItem("language", lang);
  } catch {}
};

// language priority: ?lang= in url, then remembered choice, then finnish
const initial_language = () => {
  const from_url = new URLSearchParams(window.location.search).get("lang");
  if (LANGUAGES.includes(from_url)) return from_url;
  const from_storage = stored_language();
  if (LANGUAGES.includes(from_storage)) return from_storage;
  return "fi";
};

let language = initial_language();

const clear_nav_links = () =>
  nav_links.forEach(link => {
    link.classList.remove("active");
  });

const scroll_to = event => {
  let target_top =
    document.querySelector(event.target.hash).getBoundingClientRect().top -
    header_height;
  let start_pos = window.scrollY;
  document.body.scrollTo({
    top: start_pos + target_top,
    left: 0,
  });
};

const open_burger = () => {
  burger_close.style.display = "flex";
  burger_open.style.display = "none";
  if (!nav.classList.contains("show")) {
    nav.classList.toggle("show");
  }
};

const close_burger = () => {
  burger_close.style.display = "none";
  burger_open.style.display = "flex";
  if (nav.classList.contains("show")) {
    nav.classList.toggle("show");
  }
};

// toggle burger
burger_open.addEventListener("click", event => {
  open_burger();
});

burger_close.addEventListener("click", event => {
  close_burger();
});

if (window.innerWidth < 980) {
  if (!nav.classList.contains("burger")) {
    nav.classList.toggle("burger");
  }
  burger_open.style.display = "flex";
}

window.matchMedia("(min-width: 980px)").addEventListener("change", event => {
  if (window.innerWidth < 980) {
    if (!nav.classList.contains("burger")) {
      nav.classList.toggle("burger");
    }

    if (nav.classList.contains("show")) {
      open_burger();
    } else {
      close_burger();
    }
  } else {
    if (nav.classList.contains("burger")) {
      nav.classList.toggle("burger");
    }
    burger_open.style.display = "none";
    burger_close.style.display = "none";
    if (nav.classList.contains("show")) {
      nav.classList.toggle("show");
    }
  }
});

// set navlink actions
nav_links.forEach(link =>
  link.addEventListener("click", event => {
    if (link.hasAttribute("scroll")) event.preventDefault();

    clear_nav_links();

    event.target.classList.add("active");

    if (link.hasAttribute("scroll")) {
      console.log("scrolling");
      scroll_to(event);
    }

    link.classList.add("active");

    if (nav.classList.contains("show")) {
      close_burger();
    }
  }),
);

// language
const update_language = lang => {
  if (lang === "en") {
    finnish_elements.forEach(element => {
      element.style.display = "none";
    });
    english_elements.forEach(element => {
      element.style.display = "";
    });
  } else {
    english_elements.forEach(element => {
      element.style.display = "none";
    });
    finnish_elements.forEach(element => {
      element.style.display = "";
    });
  }

  document.documentElement.lang = lang;

  // make page links lead to the same language version
  page_links.forEach(link => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    url.searchParams.set("lang", lang);
    link.href = url.href;
  });

  const current = new URL(window.location.href);
  current.searchParams.set("lang", lang);
  history.replaceState(null, "", current.href);
};

toggle_lang_btn.addEventListener("click", event => {
  language = language === "fi" ? "en" : "fi";
  update_language(language);
  store_language(language);
});

update_language(language);
