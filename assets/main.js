/* Voltrace — small progressive-enhancement script */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("open"));
    });

    /* Following a link navigates away; collapse first so a back-navigation
       restored from cache doesn't show a stale open menu. */
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Tapping the page outside the menu dismisses it. */
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });

    /* Rotating to landscape can cross the 900px breakpoint, where the menu
       becomes the desktop bar again — drop the open state so it isn't left
       applying mobile styles at desktop width. */
    var desktop = window.matchMedia("(min-width: 901px)");
    var onChange = function (e) { if (e.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  if (document.documentElement.classList.contains("reveal-on") && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    /* Safety net: never leave content hidden if the observer misfires. */
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* ---- Contact form → mailto ---- */
  /* Change this address to your real inbox. */
  var CONTACT_EMAIL = "contact@voltrace.io";
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var email = (data.get("email") || "").toString().trim();
      var org = (data.get("organization") || "").toString().trim();
      var message = (data.get("message") || "").toString().trim();

      var body =
        "Name: " + name + "\n" +
        "E-mail: " + email + "\n" +
        "Business/Organization: " + org + "\n\n" +
        message;

      var href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Voltrace enquiry from " + name) +
        "&body=" + encodeURIComponent(body);

      window.location.href = href;
    });
  }
})();
