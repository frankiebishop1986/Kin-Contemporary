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
       SHOP GRID VIEW — 3 / 4 / 5 COLUMNS
    ========================================================= */

    const shopGrid = document.querySelector(".shop-artwork-grid");

    const viewButtons = document.querySelectorAll(
        ".shop-view-button"
    );

    if (shopGrid && viewButtons.length > 0) {

        viewButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const columns = button.dataset.columns;

                shopGrid.classList.remove(
                    "columns-3",
                    "columns-4",
                    "columns-5"
                );

                shopGrid.classList.add(
                    "columns-" + columns
                );

                viewButtons.forEach(function (item) {
                    item.classList.remove("active");
                });

                button.classList.add("active");

            });

        });

    }



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

            filterButton.setAttribute(
                "aria-expanded",
                "true"
            );

        }

        filterOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeFilterPanel() {

        if (!filterPanel || !filterOverlay) return;

        filterPanel.classList.remove("open");
        filterOverlay.classList.remove("open");

        document.body.style.overflow = "";

        if (filterButton) {

            filterButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        filterOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (filterButton && filterPanel) {

        filterButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    filterPanel.classList.contains("open");

                if (isOpen) {
                    closeFilterPanel();
                } else {
                    openFilterPanel();
                }

            }
        );

    }


    if (filterClose) {

        filterClose.addEventListener(
            "click",
            closeFilterPanel
        );

    }


    if (filterOverlay) {

        filterOverlay.addEventListener(
            "click",
            closeFilterPanel
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                filterPanel &&
                filterPanel.classList.contains("open")
            ) {

                closeFilterPanel();

            }

        }
    );



    /* =========================================================
       FILTERING AND SORTING
    ========================================================= */

    const artworkGrid = document.querySelector(
        ".artwork-grid, .shop-artwork-grid"
    );

    const applyButton =
        document.querySelector(".filter-apply");

    const clearButton =
        document.querySelector(".filter-clear");


    /*
       IMPORTANT:
       Do NOT return from the whole DOMContentLoaded function
       here, because single artwork pages do not have filters.
    */

    if (
        artworkGrid &&
        applyButton &&
        clearButton &&
        filterPanel
    ) {

        const artworkCards = Array.from(
            artworkGrid.querySelectorAll(".artwork-card")
        );


        artworkCards.forEach(function (card, index) {

            card.dataset.originalOrder = index;

        });



        /* =====================================================
           GET CHECKED FILTER VALUES
        ===================================================== */

        function getCheckedValues(name) {

            return Array.from(
                filterPanel.querySelectorAll(
                    'input[name="' + name + '"]:checked'
                )
            ).map(function (input) {

                return input.value;

            });

        }



        /* =====================================================
           ALLOW SORT OPTION TO BE UNCHECKED
        ===================================================== */

        const sortRadios = filterPanel.querySelectorAll(
            'input[name="sort"]'
        );


        sortRadios.forEach(function (radio) {

            radio.addEventListener("click", function () {

                if (radio.dataset.wasChecked === "true") {

                    radio.checked = false;
                    radio.dataset.wasChecked = "false";

                    return;
                }


                sortRadios.forEach(function (item) {

                    item.dataset.wasChecked = "false";

                });


                radio.dataset.wasChecked = "true";

            });


            radio.addEventListener("mousedown", function () {

                radio.dataset.wasChecked =
                    radio.checked ? "true" : "false";

            });

        });



        /* =====================================================
           APPLY FILTERS
        ===================================================== */

        function applyFilters() {

            const selectedMediums =
                getCheckedValues("medium");

            const selectedSizes =
                getCheckedValues("size");

            const selectedAvailability =
                getCheckedValues("availability");

            const selectedArtists =
                getCheckedValues("artist");


            artworkCards.forEach(function (card) {

                const mediumMatches =
                    selectedMediums.length === 0 ||
                    selectedMediums.includes(
                        card.dataset.medium
                    );


                const sizeMatches =
                    selectedSizes.length === 0 ||
                    selectedSizes.includes(
                        card.dataset.size
                    );


                const availabilityMatches =
                    selectedAvailability.length === 0 ||
                    selectedAvailability.includes(
                        card.dataset.availability
                    );


                const artistMatches =
                    selectedArtists.length === 0 ||
                    selectedArtists.includes(
                        card.dataset.artist
                    );


                const shouldShow =
                    mediumMatches &&
                    sizeMatches &&
                    availabilityMatches &&
                    artistMatches;


                card.style.display =
                    shouldShow ? "" : "none";

            });



            /* =================================================
               SORT
            ================================================= */

            let sortValue = "most-relevant";


            const selectedSort =
                filterPanel.querySelector(
                    'input[name="sort"]:checked'
                );


            if (selectedSort) {
                sortValue = selectedSort.value;
            }


            const sortedCards = [...artworkCards];


            sortedCards.sort(function (a, b) {

                const priceA =
                    Number(a.dataset.price) || 0;

                const priceB =
                    Number(b.dataset.price) || 0;

                const yearA =
                    Number(a.dataset.year) || 0;

                const yearB =
                    Number(b.dataset.year) || 0;


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



        /* =====================================================
           CLEAR FILTERS
        ===================================================== */

        function clearFilters() {

            const filterInputs =
                filterPanel.querySelectorAll("input");


            filterInputs.forEach(function (input) {

                if (
                    input.type === "checkbox" ||
                    input.type === "radio"
                ) {

                    input.checked = false;

                }

            });


            sortRadios.forEach(function (radio) {
                radio.dataset.wasChecked = "false";
            });


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



        /* =====================================================
           FILTER BUTTON EVENTS
        ===================================================== */

        applyButton.addEventListener(
            "click",
            applyFilters
        );


        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }

});



/* =========================================================
   SINGLE ARTWORK PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       SINGLE ARTWORK IMAGE GALLERY
    ===================================================== */

    const mainArtworkImage = document.querySelector(
        "#single-artwork-main-image"
    );

    const artworkThumbnails = document.querySelectorAll(
        ".artwork-thumbnail"
    );


    if (mainArtworkImage && artworkThumbnails.length > 0) {

        artworkThumbnails.forEach(function (thumbnail) {

            thumbnail.addEventListener("click", function () {

                const newImage = thumbnail.dataset.image;


                if (
                    !newImage ||
                    mainArtworkImage.src.includes(newImage)
                ) {
                    return;
                }


                mainArtworkImage.classList.add(
                    "is-changing"
                );


                window.setTimeout(function () {

                    mainArtworkImage.src = newImage;


                    artworkThumbnails.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    thumbnail.classList.add(
                        "active"
                    );


                    mainArtworkImage.onload =
                        function () {

                            mainArtworkImage.classList.remove(
                                "is-changing"
                            );

                        };


                }, 180);

            });

        });

    }



    /* =====================================================
       RANDOM ARTWORK RECOMMENDATIONS
       ALL ARTISTS
    ===================================================== */

    const recommendationTrack = document.querySelector(
        "#recommendation-track"
    );

    const ORIGINAL_ARTWORKS_PAGE =
        "original-artworks.html";


    let recommendationPosition = 0;



    /* =====================================================
       SHUFFLE ARRAY
    ===================================================== */

    function shuffleArray(items) {

        const shuffled = [...items];


        for (
            let i = shuffled.length - 1;
            i > 0;
            i--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() * (i + 1)
                );


            const temporary =
                shuffled[i];


            shuffled[i] =
                shuffled[randomIndex];


            shuffled[randomIndex] =
                temporary;

        }


        return shuffled;

    }



    /* =====================================================
       GET SLUG FROM URL
    ===================================================== */

    function getSlugFromUrl(url) {

        if (!url) return "";


        const cleanUrl =
            url
                .split("#")[0]
                .split("?")[0];


        const fileName =
            cleanUrl.substring(
                cleanUrl.lastIndexOf("/") + 1
            );


        return fileName.replace(
            /\.html$/i,
            ""
        );

    }



    /* =====================================================
       BUILD ARTWORK OBJECT FROM ORIGINAL ARTWORK CARD
    ===================================================== */

    function buildArtworkFromCard(card) {

        const link =
            card.getAttribute("href") || "";


        /*
           Ignore artworks that do not have
           their own artwork page yet.
        */

        if (
            !link ||
            link === "#" ||
            link.startsWith("javascript:")
        ) {
            return null;
        }


        const image =
            card.querySelector(
                ".artwork-image img"
            );


        const titleElement =
            card.querySelector(
                ".artwork-info h3"
            );


        const artistElement =
            card.querySelector(
                ".artwork-info p"
            );


        const priceElement =
            card.querySelector(
                ".artwork-info span"
            );


        if (
            !image ||
            !titleElement ||
            !artistElement
        ) {
            return null;
        }


        const title =
            titleElement.textContent.trim();


        const artist =
            artistElement.textContent
                .replace(/\s+/g, " ")
                .trim();


        const imageSource =
            image.getAttribute("src");


        const priceText =
            priceElement
                ? priceElement.textContent
                    .replace(/\s+/g, " ")
                    .trim()
                : "";


        return {

            slug:
                getSlugFromUrl(link),

            title:
                title,

            artist:
                artist,

            artistKey:
                card.dataset.artist || artist,

            medium:
                card.dataset.medium || "",

            size:
                card.dataset.size || "",

            availability:
                card.dataset.availability || "",

            price:
                Number(
                    card.dataset.price
                ) || 0,

            priceText:
                priceText,

            year:
                Number(
                    card.dataset.year
                ) || 0,

            image:
                imageSource,

            url:
                link

        };

    }



    /* =====================================================
       BALANCED RANDOM SELECTION
    ===================================================== */

    function buildBalancedRecommendations(
        artworks,
        currentSlug
    ) {

        /*
           First remove the artwork currently being viewed.
        */

        const eligible =
            shuffleArray(
                artworks.filter(
                    function (artwork) {

                        return (
                            artwork &&
                            artwork.slug !== currentSlug
                        );

                    }
                )
            );


        /*
           Group artworks by artist.
        */

        const artistGroups =
            new Map();


        eligible.forEach(
            function (artwork) {

                const artistKey =
                    artwork.artistKey ||
                    artwork.artist;


                if (!artistGroups.has(artistKey)) {

                    artistGroups.set(
                        artistKey,
                        []
                    );

                }


                artistGroups
                    .get(artistKey)
                    .push(artwork);

            }
        );


        /*
           Randomise the artist order AND
           randomise the works inside each artist.
        */

        const groups =
            shuffleArray(
                Array.from(
                    artistGroups.values()
                )
            ).map(
                function (group) {

                    return shuffleArray(group);

                }
            );


        const recommendations = [];

        let artworkAdded = true;


        /*
           Take one artwork from each artist
           before taking a second artwork
           from the same artist.

           This creates a much better mix.
        */

        while (artworkAdded) {

            artworkAdded = false;


            const randomGroups =
                shuffleArray(groups);


            randomGroups.forEach(
                function (group) {

                    if (group.length > 0) {

                        recommendations.push(
                            group.shift()
                        );

                        artworkAdded = true;

                    }

                }
            );

        }


        return recommendations;

    }



    /* =====================================================
       CREATE RECOMMENDATION CARD
    ===================================================== */

    function createRecommendationCard(artwork) {

        const card =
            document.createElement("a");


        card.className =
            "recommendation-card";


        card.href =
            artwork.url;


        let displayPrice =
            artwork.priceText;


        if (
            !displayPrice &&
            artwork.price > 0
        ) {

            displayPrice =
                artwork.price.toLocaleString(
                    "en-AU"
                ) + " AUD";

        }


        card.innerHTML = `

            <div class="recommendation-image">

                <img
                    src="${artwork.image}"
                    alt="${artwork.title} by ${artwork.artist}"
                    loading="lazy"
                >

            </div>

            <div class="recommendation-info">

                <h3>
                    ${artwork.title}
                </h3>

                <p>
                    ${artwork.artist}
                </p>

                <span>
                    ${displayPrice}
                </span>

            </div>

        `;


        return card;

    }



    /* =====================================================
       LOAD ARTWORKS FROM ORIGINAL ARTWORKS PAGE
    ===================================================== */

    async function loadRecommendations() {

        if (!recommendationTrack) return;


        const currentArtwork =
            document.querySelector(
                ".single-artwork"
            );


        let currentSlug = "";


        if (
            currentArtwork &&
            currentArtwork.dataset.currentArtwork
        ) {

            currentSlug =
                currentArtwork.dataset.currentArtwork;

        } else {

            currentSlug =
                getSlugFromUrl(
                    window.location.pathname
                );

        }


        try {

            const response =
                await fetch(
                    ORIGINAL_ARTWORKS_PAGE,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Could not load Original Artworks page"
                );

            }


            const html =
                await response.text();


            const parser =
                new DOMParser();


            const pageDocument =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            /*
               Read EVERY artwork from the
               Original Artworks grid.
            */

            const sourceCards =
                Array.from(
                    pageDocument.querySelectorAll(
                        ".shop-artwork-grid .artwork-card"
                    )
                );


            /*
               Convert HTML cards into artwork objects.
            */

            const artworkPool =
                sourceCards
                    .map(function (card) {

                        return buildArtworkFromCard(
                            card
                        );

                    })
                    .filter(function (artwork) {

                        return artwork !== null;

                    });


            /*
               Generate balanced random order.
            */

            const recommendations =
                buildBalancedRecommendations(
                    artworkPool,
                    currentSlug
                );


            /*
               Remove anything that may already
               exist inside the track.
            */

            recommendationTrack.innerHTML = "";


            /*
               Add all recommendations.
            */

            recommendations.forEach(
                function (artwork) {

                    const card =
                        createRecommendationCard(
                            artwork
                        );


                    recommendationTrack.appendChild(
                        card
                    );

                }
            );


            /*
               Reset carousel.
            */

            recommendationPosition = 0;


            recommendationTrack.style.transform =
                "translateX(0)";


        } catch (error) {

            console.error(
                "KIN recommendation error:",
                error
            );

        }

    }



    /* =====================================================
       RECOMMENDATION CAROUSEL
    ===================================================== */

    const previousButton =
        document.querySelector(
            ".recommendation-prev"
        );


    const nextButton =
        document.querySelector(
            ".recommendation-next"
        );


    function getCardWidth() {

        if (!recommendationTrack) return 0;


        const card =
            recommendationTrack.querySelector(
                ".recommendation-card"
            );


        if (!card) return 0;


        const trackStyles =
            window.getComputedStyle(
                recommendationTrack
            );


        const gap =
            parseFloat(
                trackStyles.gap
            ) || 0;


        return (
            card.getBoundingClientRect().width +
            gap
        );

    }



    function moveRecommendations(direction) {

        if (!recommendationTrack) return;


        const cards =
            recommendationTrack.querySelectorAll(
                ".recommendation-card"
            );


        if (cards.length === 0) return;


        const cardWidth =
            getCardWidth();


        const visibleWidth =
            recommendationTrack.parentElement
                .getBoundingClientRect()
                .width;


        const totalWidth =
            recommendationTrack.scrollWidth;


        const maximumMove =
            Math.max(
                0,
                totalWidth - visibleWidth
            );


        recommendationPosition +=
            direction * cardWidth;


        recommendationPosition =
            Math.max(
                0,
                Math.min(
                    recommendationPosition,
                    maximumMove
                )
            );


        recommendationTrack.style.transform =
            `translateX(-${recommendationPosition}px)`;

    }



    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                moveRecommendations(1);

            }
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                moveRecommendations(-1);

            }
        );

    }



    /* =====================================================
       RESET CAROUSEL ON RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

            recommendationPosition = 0;


            if (recommendationTrack) {

                recommendationTrack.style.transform =
                    "translateX(0)";

            }

        }
    );



    /* =====================================================
       START RECOMMENDATIONS
    ===================================================== */

    loadRecommendations();

});



/* =========================================================
   CONTACT PAGE — ARTWORK ENQUIRY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const subjectInput =
        document.querySelector("#contact-subject");

    if (!subjectInput) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const artwork =
        params.get("artwork");


    const artist =
        params.get("artist");


    if (!artwork) return;


    function formatText(text) {

        return text.replace(
            /-/g,
            " "
        );

    }


    const artworkName =
        formatText(artwork);


    const artistName =
        artist
            ? formatText(artist)
            : "";


    subjectInput.value =
        artistName
            ? "Enquiry about " +
              artworkName +
              " — " +
              artistName
            : "Enquiry about " +
              artworkName;

});/* =========================================================
   KIN CONTEMPORARY — GLOBAL SITE SEARCH
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchToggle =
        document.querySelector(".search-toggle");

    const searchPanel =
        document.querySelector("#site-search");

    const searchInput =
        document.querySelector("#site-search-input");

    const searchResults =
        document.querySelector("#site-search-results");

    const searchClose =
        document.querySelector(".site-search-close");

    const searchBackdrop =
        document.querySelector(".site-search-backdrop");

    const suggestionButtons =
        document.querySelectorAll(
            "[data-search-term]"
        );


    if (
        !searchToggle ||
        !searchPanel ||
        !searchInput ||
        !searchResults
    ) {
        return;
    }



    /* =====================================================
       BASE SEARCH INDEX
    ===================================================== */

    let searchIndex = [

        /* =========================
           MAIN PAGES
        ========================= */

        {
            title: "Artists",
            type: "Page",
            url: "artists.html",
            keywords:
                "artists contemporary artists represented artists"
        },

        {
            title: "Exhibitions",
            type: "Page",
            url: "exhibitions.html",
            keywords:
                "exhibitions shows exhibition current upcoming"
        },

        {
            title: "Available Works",
            type: "Page",
            url: "available-works.html",
            keywords:
                "available works art artworks buy art collection"
        },

        {
            title: "Original Artworks",
            type: "Category",
            url: "original-artworks.html",
            keywords:
                "original artwork original artworks painting paintings sculpture sculptures"
        },

        {
            title: "Limited Editions",
            type: "Category",
            url: "limited-editions.html",
            keywords:
                "limited edition limited editions print prints art print editions"
        },

        {
            title: "Paintings",
            type: "Category",
            url: "original-artworks.html",
            keywords:
                "painting paintings painted canvas oil acrylic mixed media"
        },

        {
            title: "Sculptures",
            type: "Category",
            url: "original-artworks.html",
            keywords:
                "sculpture sculptures ceramic ceramics object objects three dimensional 3d"
        },

        {
            title: "Prints",
            type: "Category",
            url: "limited-editions.html",
            keywords:
                "print prints limited edition editions archival print fine art print"
        },

        {
            title: "About KIN Contemporary",
            type: "Page",
            url: "about.html",
            keywords:
                "about gallery kin contemporary sydney gallery information"
        },

        {
            title: "Contact",
            type: "Page",
            url: "contact.html",
            keywords:
                "contact enquiry email gallery enquire"
        },


        /* =========================
           ARTISTS
        ========================= */

        {
            title: "Tim Fry",
            type: "Artist",
            url: "tim-fry.html",
            keywords:
                "tim fry artist sculpture sculptures ceramic ceramics"
        },

        {
            title: "Audrey Rhoda",
            type: "Artist",
            url: "audrey-rhoda.html",
            keywords:
                "audrey rhoda artist painting paintings"
        },

        {
            title: "Jakey Pedro",
            type: "Artist",
            url: "jakey-pedro.html",
            keywords:
                "jakey pedro artist painting paintings contemporary"
        },

        {
            title: "Alessandro D'Aquila",
            type: "Artist",
            url: "alessandro-daquila.html",
            keywords:
                "alessandro daquila d'aquila artist sculpture sculptures"
        },

        {
            title: "Federico Boni",
            type: "Artist",
            url: "federico-boni.html",
            keywords:
                "federico boni artist painting paintings print prints limited edition"
        },

        {
            title: "Sean Loch",
            type: "Artist",
            url: "sean-loch.html",
            keywords:
                "sean loch artist painting paintings"
        },

        {
            title: "Pablo Martín",
            type: "Artist",
            url: "pablo-martin.html",
            keywords:
                "pablo martin martín artist painting paintings"
        }

    ];



    /* =====================================================
       NORMALISE SEARCH TEXT
    ===================================================== */

    function normaliseText(text) {

        return String(text || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /['’]/g,
                ""
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }



    /* =====================================================
       OPEN SEARCH
    ===================================================== */

    function openSearch() {

        searchPanel.classList.add("open");

        if (searchBackdrop) {
            searchBackdrop.classList.add("open");
        }

        searchPanel.setAttribute(
            "aria-hidden",
            "false"
        );

        searchToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow =
            "hidden";


        window.setTimeout(
            function () {

                searchInput.focus();

            },
            250
        );

    }



    /* =====================================================
       CLOSE SEARCH
    ===================================================== */

    function closeSearch() {

        searchPanel.classList.remove("open");

        if (searchBackdrop) {
            searchBackdrop.classList.remove("open");
        }

        searchPanel.setAttribute(
            "aria-hidden",
            "true"
        );

        searchToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow =
            "";

    }



    /* =====================================================
       BUILD RESULT
    ===================================================== */

    function createSearchResult(item) {

        const result =
            document.createElement("a");


        result.className =
            "search-result";


        result.href =
            item.url;


        result.innerHTML = `

            <span class="search-result-title">
                ${item.title}
            </span>

            <span class="search-result-meta">
                ${item.type}
            </span>

            <span class="search-result-arrow">
                →
            </span>

        `;


        return result;

    }



    /* =====================================================
       SEARCH
    ===================================================== */

    function performSearch(value) {

        const query =
            normaliseText(value);


        searchResults.innerHTML =
            "";


        if (!query) {
            return;
        }


        const words =
            query.split(" ");


        const matches =
            searchIndex
                .map(
                    function (item) {

                        const title =
                            normaliseText(
                                item.title
                            );


                        const keywords =
                            normaliseText(
                                item.keywords
                            );


                        const type =
                            normaliseText(
                                item.type
                            );


                        const searchableText =
                            title +
                            " " +
                            keywords +
                            " " +
                            type;


                        let score = 0;


                        if (title === query) {
                            score += 100;
                        }


                        if (
                            title.startsWith(query)
                        ) {
                            score += 50;
                        }


                        if (
                            title.includes(query)
                        ) {
                            score += 25;
                        }


                        if (
                            keywords.includes(query)
                        ) {
                            score += 15;
                        }


                        words.forEach(
                            function (word) {

                                if (
                                    searchableText.includes(
                                        word
                                    )
                                ) {

                                    score += 5;

                                }

                            }
                        );


                        return {
                            ...item,
                            score: score
                        };

                    }
                )
                .filter(
                    function (item) {

                        return item.score > 0;

                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            b.score -
                            a.score
                        );

                    }
                )
                .slice(
                    0,
                    12
                );


        if (matches.length === 0) {

            searchResults.innerHTML = `

                <p class="search-no-results">
                    No results found for
                    “${value.trim()}”.
                </p>

            `;

            return;

        }


        const heading =
            document.createElement("p");


        heading.className =
            "search-results-heading";


        heading.textContent =
            matches.length +
            (
                matches.length === 1
                    ? " result"
                    : " results"
            );


        searchResults.appendChild(
            heading
        );


        matches.forEach(
            function (item) {

                searchResults.appendChild(
                    createSearchResult(
                        item
                    )
                );

            }
        );

    }



    /* =====================================================
       READ ARTWORKS FROM A PAGE
    ===================================================== */

    async function loadArtworkPage(
        pageUrl,
        defaultType
    ) {

        try {

            const response =
                await fetch(
                    pageUrl,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                return;
            }


            const html =
                await response.text();


            const parser =
                new DOMParser();


            const pageDocument =
                parser.parseFromString(
                    html,
                    "text/html"
                );


            const artworkCards =
                pageDocument.querySelectorAll(
                    ".artwork-card"
                );


            artworkCards.forEach(
                function (card) {

                    const titleElement =
                        card.querySelector(
                            ".artwork-info h3"
                        );


                    const artistElement =
                        card.querySelector(
                            ".artwork-info p"
                        );


                    if (!titleElement) {
                        return;
                    }


                    const title =
                        titleElement.textContent
                            .trim();


                    const artist =
                        artistElement
                            ? artistElement
                                .textContent
                                .trim()
                            : "";


                    const medium =
                        card.dataset.medium ||
                        defaultType;


                    const availability =
                        card.dataset.availability ||
                        "";


                    const href =
                        card.getAttribute(
                            "href"
                        );


                    let destination =
                        pageUrl;


                    if (
                        href &&
                        href !== "#" &&
                        !href.startsWith(
                            "javascript:"
                        )
                    ) {

                        destination =
                            href;

                    }


                    searchIndex.push(
                        {

                            title:
                                title,

                            type:
                                medium
                                    ? medium
                                    : defaultType,

                            url:
                                destination,

                            keywords:
                                [
                                    title,
                                    artist,
                                    medium,
                                    availability,
                                    defaultType,
                                    "art",
                                    "artwork"
                                ].join(" ")

                        }
                    );

                }
            );


        } catch (error) {

            console.warn(
                "KIN search could not read:",
                pageUrl
            );

        }

    }



    /* =====================================================
       LOAD ORIGINAL + LIMITED EDITION ARTWORKS
    ===================================================== */

    async function buildDynamicSearchIndex() {

        await Promise.all([

            loadArtworkPage(
                "original-artworks.html",
                "Original Artwork"
            ),

            loadArtworkPage(
                "limited-editions.html",
                "Limited Edition"
            )

        ]);

    }



    /* =====================================================
       EVENTS
    ===================================================== */

    searchToggle.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            openSearch();

        }
    );


    if (searchClose) {

        searchClose.addEventListener(
            "click",
            closeSearch
        );

    }


    if (searchBackdrop) {

        searchBackdrop.addEventListener(
            "click",
            closeSearch
        );

    }


    searchInput.addEventListener(
        "input",
        function () {

            performSearch(
                searchInput.value
            );

        }
    );


    suggestionButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const term =
                        button.dataset
                            .searchTerm;


                    searchInput.value =
                        term;


                    performSearch(
                        term
                    );


                    searchInput.focus();

                }
            );

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                searchPanel.classList.contains(
                    "open"
                )
            ) {

                closeSearch();

            }

        }
    );



    /* =====================================================
       START
    ===================================================== */

    buildDynamicSearchIndex();

});
/* =========================================================
   KIN — ARTIST PAGE MOBILE ACCORDIONS
   MOBILE ONLY — DESKTOP HTML REMAINS UNTOUCHED
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /*
       IMPORTANT:
       Do absolutely nothing on desktop/tablet.
    */

    if (
        !window.matchMedia(
            "(max-width: 600px)"
        ).matches
    ) {
        return;
    }


    const biography =
        document.querySelector(
            ".artist-page-biography"
        );

    const statement =
        document.querySelector(
            ".artist-statement"
        );


    /*
       Only run on individual artist pages
    */

    if (!biography && !statement) {
        return;
    }


    function createMobileAccordion(
        section,
        label
    ) {

        if (!section) return;


        /*
           Prevent duplicate setup
        */

        if (
            section.classList.contains(
                "artist-mobile-accordion"
            )
        ) {
            return;
        }


        /*
           Keep hidden semantic heading
        */

        const hiddenHeading =
            section.querySelector(
                ":scope > .visually-hidden"
            );


        /*
           Collect section content
           without the hidden heading
        */

        const elements =
            Array.from(
                section.children
            ).filter(
                function (element) {

                    return (
                        element !== hiddenHeading
                    );

                }
            );


        /*
           Create button
        */

        const button =
            document.createElement(
                "button"
            );

        button.type =
            "button";

        button.className =
            "artist-mobile-toggle";

        button.setAttribute(
            "aria-expanded",
            "false"
        );


        button.innerHTML = `

            <span>
                ${label}
            </span>

            <span
                class="artist-mobile-toggle-icon"
                aria-hidden="true"
            ></span>

        `;


        /*
           Create collapsible panel
        */

        const panel =
            document.createElement(
                "div"
            );

        panel.className =
            "artist-mobile-panel";


        /*
           Move existing content
           inside panel
        */

        elements.forEach(
            function (element) {

                panel.appendChild(
                    element
                );

            }
        );


        /*
           Insert accordion
        */

        if (hiddenHeading) {

            hiddenHeading
                .insertAdjacentElement(
                    "afterend",
                    button
                );

            button
                .insertAdjacentElement(
                    "afterend",
                    panel
                );

        } else {

            section.prepend(
                button
            );

            button
                .insertAdjacentElement(
                    "afterend",
                    panel
                );

        }


        section.classList.add(
            "artist-mobile-accordion"
        );


        /*
           Open / close
        */

        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    button.getAttribute(
                        "aria-expanded"
                    ) === "true";


                button.setAttribute(
                    "aria-expanded",
                    String(!isOpen)
                );


                panel.classList.toggle(
                    "is-open",
                    !isOpen
                );

            }
        );

    }


    createMobileAccordion(
        biography,
        "Bio"
    );


    createMobileAccordion(
        statement,
        "Artist Statement"
    );

});