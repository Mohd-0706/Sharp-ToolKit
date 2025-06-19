/**
 * Initialize everything after DOM is ready
 */
document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initSearch();
  initBackToTop();
  initToolCardHover();
});

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const closeBtn = document.getElementById("mobile-menu-close");
  const menu = document.getElementById("mobile-menu");
  const searchBtn = document.getElementById("mobile-search-btn");
  const searchContainer = document.getElementById("mobile-search-container");

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.remove("translate-x-full");
      document.body.classList.add("overflow-hidden");
      if (searchContainer) searchContainer.classList.add("hidden");
    });
  }

  if (closeBtn && menu) {
    closeBtn.addEventListener("click", () => {
      menu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    });
  }

  if (searchBtn && searchContainer) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      searchContainer.classList.toggle("hidden");
      if (menu) {
        menu.classList.add("translate-x-full");
        document.body.classList.remove("overflow-hidden");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (menu && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
      menu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      menu &&
      !menu.classList.contains("translate-x-full")
    ) {
      menu.classList.add("translate-x-full");
      document.body.classList.remove("overflow-hidden");
    }
  });
}

/**
 * Live search with suggestions for desktop and mobile
 */
function initSearch() {
  const tools = [
    {
      name: "Merge PDF",
      path: "/tools/organizepdf/merge.html",
      keywords: ["merge", "combine", "join"],
    },
    {
      name: "Split PDF",
      path: "/tools/organizepdf/splitpdf.html",
      keywords: ["split", "divide", "separate"],
    },
    {
      name: "Compress PDF",
      path: "/tools/organizepdf/compresspdf.html",
      keywords: ["compress", "reduce", "shrink"],
    },
    {
      name: "PDF to JPG",
      path: "/tools/convert-from-pdf/pdf-to-jpeg.html",
      keywords: ["convert", "image", "jpg"],
    },
    {
      name: "JPG to PDF",
      path: "/tools/convert-to-pdf/jpg-to-pdf.html",
      keywords: ["convert", "jpg", "pdf"],
    },
    {
      name: "Word to PDF",
      path: "/tools/convert-to-pdf/word-to-pdf.html",
      keywords: ["word", "doc", "pdf"],
    },
    {
      name: "Compress Image",
      path: "/tools/image/compress-image.html",
      keywords: ["compress", "photo", "image"],
    },
    {
      name: "Resize Image",
      path: "/tools/image/resize-image.html",
      keywords: ["resize", "photo", "image"],
    },
    {
      name: "Convert Image",
      path: "/tools/image/convert-image.html",
      keywords: ["convert", "format", "image"],
    },
    {
      name: "Compress Video",
      path: "/tools/video/compress-video.html",
      keywords: ["compress", "video", "reduce"],
    },
    {
      name: "Convert Video",
      path: "/tools/video/convert-video.html",
      keywords: ["convert", "video", "format"],
    },
    {
      name: "Trim Video",
      path: "/tools/video/trim-video.html",
      keywords: ["trim", "cut", "video"],
    },
  ];

  const desktopInput = document.getElementById("desktop-search-input");
  const desktopResults = document.getElementById("desktop-search-results");
  const mobileInput = document.getElementById("mobile-search-input");
  const mobileResults = document.getElementById("mobile-search-results");

  if (desktopInput && desktopResults) {
    desktopInput.addEventListener("input", () => {
      const query = desktopInput.value.trim().toLowerCase();
      showSuggestions(query, tools, desktopResults);
    });
  }

  if (mobileInput && mobileResults) {
    mobileInput.addEventListener("input", () => {
      const query = mobileInput.value.trim().toLowerCase();
      showSuggestions(query, tools, mobileResults);
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#desktop-search-input"))
      desktopResults?.classList.add("hidden");
    if (!e.target.closest("#mobile-search-input"))
      mobileResults?.classList.add("hidden");
  });
}

/**
 * Display search suggestions in dropdown
 */
function showSuggestions(query, tools, resultsContainer) {
  resultsContainer.innerHTML = "";

  if (!query) {
    resultsContainer.classList.add("hidden");
    return;
  }

  const matched = tools.filter((tool) => {
    const nameMatch = tool.name.toLowerCase().includes(query);
    const keywordMatch = tool.keywords.some((k) =>
      k.toLowerCase().includes(query)
    );
    return nameMatch || keywordMatch;
  });

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<li class="px-4 py-2 text-gray-500">No tools found</li>`;
  } else {
    matched.forEach((tool) => {
      const li = document.createElement("li");
      li.className =
        "px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 cursor-pointer rounded-md";
      li.textContent = tool.name;
      li.addEventListener("click", () => {
        window.location.href = tool.path;
      });
      resultsContainer.appendChild(li);
    });
  }

  resultsContainer.classList.remove("hidden");
}

/**
 * Back to top button visibility and scroll behavior
 */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.classList.remove("opacity-0", "invisible");
      btn.classList.add("opacity-100", "visible");
    } else {
      btn.classList.remove("opacity-100", "visible");
      btn.classList.add("opacity-0", "invisible");
    }
  });
}

/**
 * Hover effects for tool cards
 */
function initToolCardHover() {
  const cards = document.querySelectorAll(".tool-card");
  cards.forEach((card) => {
    card.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px) scale(1.02)";
      card.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";
    });
  });
}
