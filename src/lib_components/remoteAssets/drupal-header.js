(function ($) {
  $(document).ready(function () {
    try {
      onReady();
    } catch (error) {
      console.error(error);
    }
  });

  function onReady() {
    var $header = $(".header");

    // ── Throttle utility ───────────────────────────────────────────────────────
    function throttle(fn, wait) {
      var isThrottled = false,
        lastArgs = null;
      return function wrapper() {
        if (isThrottled) {
          lastArgs = arguments;
        } else {
          fn.apply(this, arguments);
          isThrottled = setTimeout(function () {
            isThrottled = false;
            if (lastArgs) {
              wrapper.apply(this, lastArgs);
              lastArgs = null;
            }
          }, wait);
        }
      };
    }

    // ── Sticky offset / padding-top recalculation ──────────────────────────────
    var NAV_BP_SMALL_DESKTOP = 1100; // matches $nav-bp-small-desktop in header.scss
    var $searchPanel = $("#header-search-panel");
    var $searchBtn = $(".nav__search-btn");

    function onResize() {
      var mainNavHeight = $header.outerHeight() || 0;
      var mainNavOffset = ($header.parent().offset() || { top: 0 }).top;

      $header.parent().css("padding-top", mainNavHeight + "px");
      $header.css("top", mainNavOffset + "px");

      if ($(".sticky").length) {
        $(".sticky").css(
          "top",
          mainNavHeight + mainNavOffset + 15 + "px"
        );
      }

      // Collapse search panel when viewport drops below desktop breakpoint
      if ($(window).width() < NAV_BP_SMALL_DESKTOP) {
        closeSearchPanel();
      }
    }

    $(window).on("resize", throttle(onResize, 100));
    onResize();

    // ── Deduplicate search form IDs (mobile form gets -mobile suffix) ─────────
    // The same search block is rendered twice (desktop panel + mobile nav).
    // Duplicate IDs break ARIA and cause accessibility failures.
    var $mobileSearch = $(".header__search-mobile");
    $mobileSearch.find("[id]").each(function () {
      var oldId = $(this).attr("id");
      var newId = oldId + "-mobile";
      $(this).attr("id", newId);
      // Update any label[for] pointing to this id
      $mobileSearch.find("label[for='" + oldId + "']").attr("for", newId);
      // Update any aria-labelledby / aria-describedby pointing to this id
      $mobileSearch.find("[aria-labelledby~='" + oldId + "']").each(function () {
        $(this).attr("aria-labelledby", $(this).attr("aria-labelledby").replace(oldId, newId));
      });
    });
    // Update data-drupal-selector to avoid Drupal JS conflicts
    $mobileSearch.find("[data-drupal-selector]").each(function () {
      var old = $(this).attr("data-drupal-selector");
      $(this).attr("data-drupal-selector", old + "-mobile");
    });

    // ── Hamburger / mobile nav toggle ────────────────────────────────────────
    var $hamburger = $(".nav__hamburger");

    $hamburger.on("click", function () {
      if ($("body").hasClass("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    function openNav() {
      $("body").addClass("nav-open js-prevent-scroll");
      $hamburger.attr("aria-expanded", "true");
    }

    function closeNav() {
      $("body").removeClass("nav-open js-prevent-scroll");
      $hamburger.attr("aria-expanded", "false");
      closeAllDropdowns();
    }

    // ── Dropdown toggles ─────────────────────────────────────────────────────
    // Attach to the nav block; re-query on each click to support dynamic markup.
    $(document).on(
      "click",
      "nav#block-neon-main-menu .nav__toggle",
      function (e) {
        e.stopPropagation();
        var $btn = $(this);
        var isExpanded = $btn.attr("aria-expanded") === "true";

        // Close every other open dropdown
        $('nav#block-neon-main-menu .nav__toggle')
          .not($btn)
          .each(function () {
            $(this).attr("aria-expanded", "false");
          });

        // Close search panel when opening a dropdown
        if (!isExpanded) {
          closeSearchPanel();
        }

        // Toggle this one and mirror on the sibling dropdown
        $btn.attr("aria-expanded", isExpanded ? "false" : "true");
        $btn.next(".nav__dropdown").attr("aria-hidden", isExpanded ? "true" : "false");
      }
    );

    function closeAllDropdowns() {
      $("nav#block-neon-main-menu .nav__toggle").attr("aria-expanded", "false");
      $("nav#block-neon-main-menu .nav__dropdown").attr("aria-hidden", "true");
    }

    // ── Click outside: close all dropdowns ───────────────────────────────────
    $(document).on("click", function (e) {
      if (
        !$(e.target).closest(
          ".nav__item--has-dropdown, .nav__item--search"
        ).length
      ) {
        closeAllDropdowns();
      }
    });

    // ── Escape key ────────────────────────────────────────────────────────────
    $(document).on("keyup", function (e) {
      if (e.which === 27) {
        closeAllDropdowns();
        closeSearchPanel();
        closeNav();
      }
    });

    // ── Desktop search panel ──────────────────────────────────────────────────
    var $searchClose = $(".button__search-close");

    $searchBtn.on("click", function (e) {
      e.stopPropagation();
      if ($searchPanel.hasClass("is-open")) {
        closeSearchPanel();
      } else {
        closeAllDropdowns();
        $searchPanel.addClass("is-open");
        $(this).attr("aria-expanded", "true");
        // Focus the first search input
        $searchPanel
          .find("input[type='text'], input[type='search']")
          .first()
          .focus();
      }
    });

    $searchClose.on("click", function () {
      closeSearchPanel();
    });

    function closeSearchPanel() {
      $searchPanel.removeClass("is-open");
      $searchBtn.attr("aria-expanded", "false");
    }
  }
})(jQuery);
