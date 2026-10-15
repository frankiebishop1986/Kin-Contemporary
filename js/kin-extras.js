/* KIN — Spring Studio Sale (bar + popup) and mobile menu */
(function () {
    var SALE_END = new Date("2026-11-01T23:59:59+11:00"); // Sydney time
    var POPUP_KEY = "kinSpringSale2026SeenDay";
    // today's date in Sydney, e.g. "2026-10-15" — the popup shows once per day
    function sydneyDay() {
        try {
            return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(new Date());
        } catch (e) {
            return new Date().toDateString();
        }
    }
    var saleOn = new Date() < SALE_END;

    document.addEventListener("DOMContentLoaded", function () {
        /* ---------- sale bar + popup ---------- */
        var bar = document.getElementById("sale-bar");
        var popup = document.getElementById("sale-popup");

        if (!saleOn) {
            document.querySelectorAll("[data-sale-only]").forEach(function (el) { el.remove(); });
            if (bar) bar.remove();
            if (popup) popup.remove();
        } else if (popup) {
            var seen = false;
            try { seen = localStorage.getItem(POPUP_KEY) === sydneyDay(); } catch (e) {}
            var close = function () {
                popup.classList.remove("is-open");
                popup.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
                try { localStorage.setItem(POPUP_KEY, sydneyDay()); } catch (e) {}
            };
            popup.querySelectorAll("[data-sale-close]").forEach(function (el) {
                el.addEventListener("click", close);
            });
            popup.querySelectorAll(".sale-btn").forEach(function (el) {
                el.addEventListener("click", function () {
                    try { localStorage.setItem(POPUP_KEY, sydneyDay()); } catch (e) {}
                });
            });
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && popup.classList.contains("is-open")) close();
            });
            if (!seen) {
                setTimeout(function () {
                    popup.classList.add("is-open");
                    popup.setAttribute("aria-hidden", "false");
                    document.body.style.overflow = "hidden";
                }, 2500);
            }
        }

        /* ---------- mobile menu ---------- */
        var toggle = document.querySelector(".menu-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var open = document.body.classList.toggle("menu-open");
                var header = document.querySelector(".site-header");
                var menu = document.getElementById("mobile-menu");
                if (open && header && menu) {
                    menu.style.paddingTop = (header.getBoundingClientRect().bottom + 12) + "px";
                }
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
                toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
                document.body.style.overflow = open ? "hidden" : "";
            });
            document.querySelectorAll(".mobile-menu a").forEach(function (a) {
                a.addEventListener("click", function () {
                    document.body.classList.remove("menu-open");
                    document.body.style.overflow = "";
                });
            });
        }
    });
})();
