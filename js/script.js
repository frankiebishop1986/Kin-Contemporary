document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       ARTWORK IMAGE HOVER
    ========================================================= */

    const cards = document.querySelectorAll(".artwork-card");

    cards.forEach(function (card) {

        const images = Array.from(
            card.querySelectorAll(".artwork-image img")
        );

        if (images.length <= 1) return;

        let timeout;
        let interval;
        let current = 0;

        function show(index) {
            images.forEach(function (img) {
                img.classList.remove("active");
            });

            images[index].classList.add("active");
            current = index;
        }

        card.addEventListener("mouseenter", function () {

            clearTimeout(timeout);
            clearInterval(interval);

            timeout = setTimeout(function () {

                show(1);

                if (images.length > 2) {

                    interval = setInterval(function () {

                        current++;

                        if (current >= images.length) {
                            current = images.length - 1;
                        }

                        show(current);

                        if (current === images.length - 1) {
                            clearInterval(interval);
                        }

                    }, 1500);
                }

            }, 500);
        });

        card.addEventListener("mouseleave", function () {

            clearTimeout(timeout);
            clearInterval(interval);

            show(0);
        });
    });


    /* =========================================================
   OPEN / CLOSE FILTER PANEL
========================================================= */

const filterButton = document.querySelector(
    ".artwork-filter-button"
);

const filterPanel = document.querySelector(
    ".artwork-filter-panel"
);

const filterOverlay = document.querySelector(
    ".filter-overlay"
);

const filterClose = document.querySelector(
    ".filter-close"
);


function openFilterPanel() {

    if (!filterPanel || !filterOverlay) return;

    filterPanel.classList.add("open");
    filterOverlay.classList.add("open");

    document.body.style.overflow = "hidden";

    if (filterButton) {
        filterButton.setAttribute("aria-expanded", "true");
    }

    filterOverlay.setAttribute("aria-hidden", "false");
}


function closeFilterPanel() {

    if (!filterPanel || !filterOverlay) return;

    filterPanel.classList.remove("open");
    filterOverlay.classList.remove("open");

    document.body.style.overflow = "";

    if (filterButton) {
        filterButton.setAttribute("aria-expanded", "false");
    }

    filterOverlay.setAttribute("aria-hidden", "true");
}


if (filterButton) {

    filterButton.addEventListener("click", function () {

        const isOpen = filterPanel.classList.contains("open");

        if (isOpen) {
            closeFilterPanel();
        } else {
            openFilterPanel();
        }
    });
}


if (filterClose) {
    filterClose.addEventListener("click", closeFilterPanel);
}


if (filterOverlay) {
    filterOverlay.addEventListener("click", closeFilterPanel);
}


document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        filterPanel &&
        filterPanel.classList.contains("open")
    ) {
        closeFilterPanel();
    }
});

    /* =========================================================
       FILTERING AND SORTING
    ========================================================= */

    const artworkGrid = document.querySelector(".artwork-grid");

    const applyButton = document.querySelector(".filter-apply");
    const clearButton = document.querySelector(".filter-clear");

    if (!artworkGrid || !applyButton || !clearButton) {
        return;
    }

    const artworkCards = Array.from(
        artworkGrid.querySelectorAll(".artwork-card")
    );

    artworkCards.forEach(function (card, index) {
        card.dataset.originalOrder = index;
    });


    function getCheckedValues(name) {
        return Array.from(
            document.querySelectorAll(
                'input[name="' + name + '"]:checked'
            )
        ).map(function (input) {
            return input.value;
        });
    }


    function applyFilters() {

    const selectedMediums = getCheckedValues("medium");
    const selectedSizes = getCheckedValues("size");
    const selectedAvailability = getCheckedValues("availability");
    const selectedArtists = getCheckedValues("artist");


    artworkCards.forEach(function (card) {

        const mediumMatches =
            selectedMediums.length === 0 ||
            selectedMediums.includes(card.dataset.medium);

        const sizeMatches =
            selectedSizes.length === 0 ||
            selectedSizes.includes(card.dataset.size);

        const availabilityMatches =
            selectedAvailability.length === 0 ||
            selectedAvailability.includes(
                card.dataset.availability
            );

        const artistMatches =
            selectedArtists.length === 0 ||
            selectedArtists.includes(card.dataset.artist);

        const shouldShow =
            mediumMatches &&
            sizeMatches &&
            availabilityMatches &&
            artistMatches;

        card.style.display = shouldShow ? "" : "none";
    });


    let sortValue = "most-relevant";

    const selectedSort = document.querySelector(
        'input[name="sort"]:checked'
    );

    const selectedPrice = document.querySelector(
        'input[name="price"]:checked'
    );

    const selectedDate = document.querySelector(
        'input[name="date"]:checked'
    );


    if (selectedSort) {
        sortValue = selectedSort.value;
    }

    if (selectedPrice) {
        sortValue =
            selectedPrice.value === "low-high"
                ? "price-low-high"
                : "price-high-low";
    }

    if (selectedDate) {
        sortValue =
            selectedDate.value === "old-new"
                ? "date-old-new"
                : "date-new-old";
    }


    const sortedCards = [...artworkCards];


    sortedCards.sort(function (a, b) {

        const priceA = Number(a.dataset.price);
        const priceB = Number(b.dataset.price);

        const yearA = Number(a.dataset.year);
        const yearB = Number(b.dataset.year);


        if (sortValue === "price-low-high") {
            return priceA - priceB;
        }

        if (sortValue === "price-high-low") {
            return priceB - priceA;
        }

        if (sortValue === "date-old-new") {
            return yearA - yearB;
        }

        if (sortValue === "date-new-old") {
            return yearB - yearA;
        }

        return (
            Number(a.dataset.originalOrder) -
            Number(b.dataset.originalOrder)
        );
    });


    sortedCards.forEach(function (card) {
        artworkGrid.appendChild(card);
    });


    closeFilterPanel();
}


function clearFilters() {

    const filterInputs = filterPanel.querySelectorAll("input");


    filterInputs.forEach(function (input) {

        if (
            input.type === "checkbox" ||
            input.type === "radio"
        ) {
            input.checked = false;
        }
    });


    const defaultSort = filterPanel.querySelector(
        'input[name="sort"][value="most-relevant"]'
    );


    if (defaultSort) {
        defaultSort.checked = true;
    }


    artworkCards.forEach(function (card) {
        card.style.display = "";
    });


    artworkCards
        .sort(function (a, b) {

            return (
                Number(a.dataset.originalOrder) -
                Number(b.dataset.originalOrder)
            );
        })

        .forEach(function (card) {
            artworkGrid.appendChild(card);
        });
}


applyButton.addEventListener("click", applyFilters);

clearButton.addEventListener("click", clearFilters);

});