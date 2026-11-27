/* =========================================================
   VIEW ON YOUR WALL (AR)
   - the page shows one button; it opens a panel to choose a frame
   - phone: the panel's button opens AR (Quick Look on iPhone,
     Scene Viewer on Android) in the chosen frame
   - desktop: the panel shows a QR code to this page, chosen frame included
========================================================= */

(function () {

    var box = document.querySelector(".ar-view");
    var modal = document.querySelector(".ar-modal");
    if (!box || !modal) return;

    var base = box.getAttribute("data-ar-base");
    var viewer = box.querySelector("model-viewer");
    var tiles = modal.querySelectorAll(".ar-frame");
    var qrHolder = modal.querySelector(".ar-qr");
    // the frame options come from the page (most works: black, oak, none)
    var FRAMES = Array.prototype.map.call(tiles, function (t) { return t.getAttribute("data-frame"); });
    var first = modal.querySelector(".ar-frame.is-active") || tiles[0];
    var frame = first ? first.getAttribute("data-frame") : "black";

    // a frame chosen on a computer carries over through the QR code
    var fromUrl = new URLSearchParams(window.location.search).get("frame");
    if (FRAMES.indexOf(fromUrl) !== -1) frame = fromUrl;

    function quickLookSupported() {
        var a = document.createElement("a");
        return !!(a.relList && a.relList.supports && a.relList.supports("ar"));
    }

    function canDoAr() {
        return (viewer && viewer.canActivateAR) || quickLookSupported();
    }

    function drawQr() {
        if (!qrHolder) return;
        var target = window.location.origin + window.location.pathname + "?frame=" + frame;
        qrHolder.innerHTML = "";
        if (window.QRCode) {
            new QRCode(qrHolder, { text: target, width: 160, height: 160, colorDark: "#111111", colorLight: "#ffffff" });
        } else {
            qrHolder.textContent = target;
        }
    }

    function setFrame(f) {
        frame = f;
        tiles.forEach(function (t) {
            var on = t.getAttribute("data-frame") === f;
            t.classList.toggle("is-active", on);
            t.setAttribute("aria-checked", on ? "true" : "false");
        });
        if (viewer) {
            viewer.setAttribute("src", base + "-" + f + ".glb");
            viewer.setAttribute("ios-src", base + "-" + f + ".usdz");
        }
        if (modal.classList.contains("is-desktop")) drawQr();
    }

    function openPanel() {
        var phone = canDoAr();
        modal.classList.toggle("is-desktop", !phone);
        modal.hidden = false;
        setFrame(frame);
        modal.querySelector(".ar-frame.is-active").focus();
    }

    function closePanel() {
        modal.hidden = true;
    }

    function launchAr() {
        if (viewer && viewer.canActivateAR) {
            viewer.activateAR();
            return;
        }
        // iPhone: Safari opens a rel="ar" link straight in AR Quick Look
        var link = document.createElement("a");
        link.rel = "ar";
        link.href = base + "-" + frame + ".usdz";
        link.appendChild(document.createElement("img"));
        link.click();
    }

    box.querySelector(".ar-view-button").addEventListener("click", openPanel);
    modal.querySelector(".ar-launch").addEventListener("click", launchAr);
    tiles.forEach(function (t) {
        t.addEventListener("click", function () { setFrame(t.getAttribute("data-frame")); });
    });

    modal.querySelector(".ar-modal-close").addEventListener("click", closePanel);
    modal.addEventListener("click", function (e) { if (e.target === modal) closePanel(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });

    // arriving from the QR code: open the panel with that frame ready
    if (fromUrl && canDoAr()) openPanel();

})();
