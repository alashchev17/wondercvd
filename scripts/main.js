// Register all GSAP plugins at once for better performance
gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, CSSRulePlugin)

function hidePreloader() {
  // Cache jQuery selection for better performance
  const $preloader = $(".preloader")
  $preloader.addClass("hidden")
  setTimeout(() => {
    $("html").removeClass("no-transition")
    $preloader.remove()
  }, 500)
}

Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2)
  },
})

$("body").on("click touchstart", function () {
  const videoElement = document.getElementById("hero_video")
  if (videoElement.playing) {
    // video is already playing so do nothing
  } else {
    // video is not playing
    // so play video now
    videoElement.play()
  }
})

$(document).ready(function () {
  gsap.ticker.lagSmoothing(0)

  // Cache DOM elements and window properties
  const $window = $(window)
  const windowWidth = $window.width()
  const windowHeight = $window.height()
  const isMobile = windowWidth < 768

  // Menu elements
  const $body = $("body")
  const $lines = $(".lines")
  const $header = $(".header")
  const $headerEllipse = $(".header__ellipse")
  const $menu = $(".header__menu")
  const $burgerButton = $(".header__burger")

  // Common measurements for animations
  const headerHeight = $header.height()
  const headerBottomOffset = isMobile ? 100 : 40

  let isMenuOpened = false

  $burgerButton.on("click", (event) => {
    event.preventDefault()
    $body.toggleClass("overflow-hidden", !isMenuOpened)

    if (isMenuOpened) {
      $headerEllipse.toggleClass("active")
      setTimeout(() => {
        $lines.toggleClass("active")
        $menu.toggleClass("active")
        $burgerButton.toggleClass("rotate")
        setTimeout(() => {
          $burgerButton.toggleClass("active")
          $header.toggleClass("active")
        }, 300)
      }, 300)
    } else {
      $burgerButton.toggleClass("active")
      $lines.toggleClass("active")
      $header.toggleClass("active")
      setTimeout(() => {
        $menu.toggleClass("active")
        $burgerButton.toggleClass("rotate")
        setTimeout(() => {
          $headerEllipse.toggleClass("active")
        }, 300)
      }, 300)
    }

    isMenuOpened = !isMenuOpened
  })

  // Anchors
  $('a[href^="#"]').bind("click", function (e) {
    e.preventDefault()
    var anchor = $(this)
    if (anchor.attr("href") !== "#") {
      const isHeroAnchor = anchor.attr("href") === "#hero"
      const offsetTop = isHeroAnchor ? 0 : $(".header").height() + 32
      const overallScrollTop = $(anchor.attr("href")).offset().top - offsetTop

      function smoothAnimate() {
        $("html").stop().animate(
          {
            scrollTop: overallScrollTop,
          },
          1200
        )
      }
      if ($menu.hasClass("active")) {
        $headerEllipse.toggleClass("active")
        setTimeout(() => {
          $lines.toggleClass("active")
          $menu.toggleClass("active")
          $burgerButton.toggleClass("rotate")
          setTimeout(() => {
            $burgerButton.toggleClass("active")
            $header.toggleClass("active")
            $body.removeClass("overflow-hidden")
          }, 300)
        }, 300)
        setTimeout(smoothAnimate, 600)
        return
      }
      smoothAnimate()
    }
  })

  /* Header Animation */
  function animateHero() {
    // Cache DOM elements and measurements to avoid repeated lookups
    const $heroTitle = $(".hero__title")
    const heroTitleHeight = $heroTitle.height()

    // Create timeline with shared configuration
    const heroTl = gsap.timeline({
      defaults: {
        duration: 2,
        ease: "power3.inOut",
      },
    })

    // Common header animation for both mobile & desktop
    heroTl.from(".header", { y: -100 }).from(".header", { opacity: 0 }, "<20%")

    // Different title animation for desktop vs mobile
    if (!isMobile) {
      // Desktop: Use SplitText for words animation
      const splitWords = SplitText.create(".hero__title", { type: "words, chars" }).words
      heroTl.from(splitWords, { y: heroTitleHeight, stagger: 0.3 }, "<")
    } else {
      // Mobile: Simpler animation
      heroTl.from(".hero__title", { y: heroTitleHeight / 3, opacity: 0, stagger: 0.3 }, "<")
    }

    // Common slogan animations (same for both desktop and mobile)
    // All these animations run in parallel with the "<" position parameter
    const sloganRules = [
      { rule: ".hero__slogan::before", props: { cssRule: { right: "calc(100% + 1px)" } } },
      { rule: ".hero__slogan::after", props: { cssRule: { bottom: "calc(100% + 1px)" } } },
      { rule: ".hero__slogan-inner::after", props: { cssRule: { bottom: "calc(100% + 1px)", right: "calc(100% + 1px)" } } },
    ]

    // Add all CSS rule animations at once
    sloganRules.forEach(({ rule, props }) => {
      heroTl.from(CSSRulePlugin.getRule(rule), props, "<")
    })

    // Add the slogan title animation
    heroTl.from(".hero__slogan-title", { y: -25, x: -25, opacity: 0 }, "<")

    return heroTl
  }

  /* Slogan Animation */

  function animateSlogan() {
    // Cache all DOM elements and measurements
    const $sloganInfo = $(".slogan__info")
    const $sloganHexagons = $(".slogan__hexagons")
    const $sloganAuthor = $(".slogan__author")
    const $sloganTitleElements = $(".slogan__title-element")

    // Measure once to avoid reflows
    const sloganInfoHeight = $sloganInfo.height()
    const hexagonsHeight = $sloganHexagons.height()
    const authorWidth = $sloganAuthor.width()

    // Cache element widths for animations
    const titleElementWidths = []
    $sloganTitleElements.each(function (i) {
      titleElementWidths[i] = $(this).width()
    })

    // Create timeline with ScrollTrigger
    const sloganTl = gsap.timeline({
      defaults: {
        duration: 2,
        ease: "linear",
      },
      scrollTrigger: {
        trigger: ".slogan",
        start: "top 80%",
        end: `bottom ${windowHeight / 2 + sloganInfoHeight * 2}px`,
        scrub: isMobile ? 0.1 : true,
      },
    })

    // Element 0: move from left
    sloganTl.from($sloganTitleElements.eq(0), {
      x: titleElementWidths[0] * -1,
    })

    // Element 1: move from right (in parallel)
    sloganTl.from(
      $sloganTitleElements.eq(1),
      {
        x: titleElementWidths[1],
      },
      "<"
    )

    // Element 2: move from left (in parallel)
    sloganTl.from(
      $sloganTitleElements.eq(2),
      {
        x: titleElementWidths[2] * -1,
      },
      "<"
    )

    // Add the remaining animations in parallel
    sloganTl
      .from(
        $sloganHexagons,
        {
          y: hexagonsHeight,
          opacity: isMobile ? 1 : 0,
        },
        "<"
      )
      .from(
        $sloganAuthor,
        {
          x: authorWidth,
        },
        "<"
      )
      .from(
        $sloganAuthor,
        {
          opacity: 0,
        },
        "<15%"
      )
      .from(
        ".slogan__ellipse",
        {
          opacity: isMobile ? 1 : 0,
        },
        "<"
      )

    return sloganTl
  }

  /* History Animation */

  function animateHistory() {
    // Cache DOM elements
    const $historySubsections = $(".history__subsection")
    const subsectionsCount = $historySubsections.length

    // Add dynamic position classes instead of gsap.set
    // NOTE: Move these to CSS for better performance:
    // .history__container { position: relative; height: 100vh; }
    // .history__subsection { position: absolute; top: 0; width: 100%; }
    // .history__subsection--mobile { left: 9.25px; width: calc(100% - 18.5px); }

    // Only apply dynamic adjustments needed for mobile/desktop
    if (isMobile) {
      $historySubsections.addClass("history__subsection--mobile")
    }

    // Create main timeline
    const historyTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: "linear",
      },
      scrollTrigger: {
        trigger: ".history",
        start: "top top",
        end: () => `+=${windowHeight * subsectionsCount - 150}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: isMobile ? 0.1 : true,
      },
    })

    // Create a separate timeline for the first section
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".history",
          start: "top center",
          end: "+=450",
          scrub: isMobile ? 0.1 : true,
        },
      })
      .from($historySubsections.eq(0).find(".history__info"), {
        y: 120,
        opacity: 0,
      })
      .from(
        $historySubsections.eq(0).find(".history__info-inner"),
        {
          y: 40,
          opacity: 0,
        },
        "<55%"
      )

    // Animate the other sections
    $historySubsections.each(function (index) {
      if (index > 0) {
        // Cache jQuery lookups
        const $section = $(this)
        const $info = $section.find(".history__info")
        const $infoInner = $section.find(".history__info-inner")

        historyTl
          .from($section, {
            yPercent: 100,
          })
          .from(
            $info,
            {
              y: 120,
              opacity: 0,
            },
            "<15%"
          )
          .from(
            $infoInner,
            {
              y: 40,
              opacity: 0,
            },
            "<35%"
          )
      }
    })

    return historyTl
  }

  /* Team Animation */

  function animateTeam() {
    // Use the cached isMobile variable instead of re-querying
    return gsap
      .timeline({
        defaults: {
          duration: 3,
          ease: "linear",
        },
        scrollTrigger: {
          trigger: ".team",
          start: "10% bottom",
          end: "bottom 155%",
          scrub: isMobile ? 0.1 : true,
        },
      })
      .from(".team__title", { y: 100, opacity: 0 })
      .from(".team__info-inner", { y: 100 }, "<")
  }

  /* Solution Animation */

  function animateSolution() {
    // Use cached isMobile variable instead of re-querying
    if (isMobile) return

    // Cache DOM elements and measurements
    const $sliderWrapper = $(".solution__slider-wrapper")
    const $ellipseContainer = $(".solution__ellipse-container")
    const $ellipseWidth = $ellipseContainer.width()

    // Calculate scroll distance only once
    const totalWidth = $sliderWrapper[0].scrollWidth
    const containerWidth = $sliderWrapper.parent().width()
    const maxScroll = -(totalWidth - containerWidth)

    // Title animation before pin (separate timeline)
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".solution",
          start: "top 50%",
          end: "top top",
          scrub: true,
        },
      })
      .from(".solution__title", { y: 50, opacity: 0 })

    // Main slider animation (combined for efficiency)
    return gsap
      .timeline({
        defaults: {
          duration: 1.7,
          ease: "linear",
        },
        scrollTrigger: {
          trigger: ".solution",
          start: `top ${headerHeight + headerBottomOffset}`,
          end: "+=750",
          pin: true,
          pinSpacing: true,
          scrub: true,
        },
      })
      .to($sliderWrapper, { x: maxScroll, ease: "none" })
      .to(
        $ellipseContainer,
        {
          x: windowWidth - $ellipseWidth,
          ease: "none",
        },
        "<"
      )
  }

  /* Details animation */

  function animateDetailsAndAdvantages() {
    // Use cached isMobile variable
    const $detailsSection = $(".details")
    const detailsSectionHeight = $detailsSection.height()

    // Different animation logic for desktop vs mobile
    if (!isMobile) {
      // Desktop animation
      const $detailsInfo = $(".details__info")
      const $solutionEllipseContainer = $(".solution__ellipse-container")

      // Use CSS for static styling instead of gsap.set
      // $detailsInfo.css("margin", "0 auto");

      // Create and return single timeline
      return gsap
        .timeline({
          defaults: {
            duration: 1.7,
            ease: "power3.inOut",
          },
          scrollTrigger: {
            trigger: ".details",
            start: "top 80%",
            end: "bottom 70%",
            scrub: true,
          },
        })
        .from(".details__title", { y: 20, opacity: 0 })
        .from($detailsInfo, { width: "75%", opacity: 0 }, "<15%")
        .from(".details__info-image", { y: 90, opacity: 0 }, "<")
        .to(
          $solutionEllipseContainer,
          {
            x: 0,
            y: detailsSectionHeight * 1.2,
            ease: "none",
          },
          "<0"
        )
    } else {
      // Mobile animation (simpler, just pin the image)
      return gsap.timeline({
        defaults: {
          duration: 1.7,
          ease: "power3.inOut",
        },
        scrollTrigger: {
          trigger: ".details__info-image",
          start: "top 25%",
          end: `${detailsSectionHeight / 1.8} 23%`,
          pin: true,
          pinSpacing: false,
          scrub: true,
        },
      })
    }
  }

  /* Promotion Animation */

  function animatePromotion() {
    // Use cached isMobile variable
    const $contactSection = $(".contact")
    const $promotionHexagons = $(".promotion__hexagons")

    // Calculate distances for animation
    const contactOffset = $contactSection.offset().top
    const promotionHexagonsOffset = $promotionHexagons.offset().top
    const distance = Math.abs(contactOffset - promotionHexagonsOffset)
    const mobileAdjuster = isMobile ? 150 : -180

    // Create and return timeline
    return gsap
      .timeline({
        defaults: {
          duration: 1.7,
          ease: "linear",
        },
        scrollTrigger: {
          trigger: ".promotion",
          start: "bottom bottom",
          end: "bottom top",
          scrub: isMobile ? 0.1 : true,
          pinType: "transform",
        },
      })
      .to(".promotion__image", {
        y: isMobile ? -100 : -175,
        opacity: isMobile ? 0 : 1,
      })
      .to(
        ".promotion__info",
        {
          y: isMobile ? -15 : -55,
          opacity: isMobile ? 0 : 1,
        },
        "<"
      )
      .to(
        $promotionHexagons,
        {
          y: distance + mobileAdjuster,
        },
        "<"
      )
  }

  /* Contact Animation */

  function animateContact() {
    // Use cached isMobile variable instead of re-querying
    return gsap
      .timeline({
        defaults: {
          duration: 1.7,
          ease: "linear",
        },
        scrollTrigger: {
          trigger: ".contact",
          start: "top bottom",
          end: "75% bottom",
          scrub: isMobile ? 0.1 : true,
        },
      })
      .from(".contact__title", {
        y: isMobile ? 55 : 155,
        opacity: 0,
      })
      .from(
        ".contact__action",
        {
          y: isMobile ? 35 : 75,
          opacity: 0,
        },
        "<"
      )
  }

  // History sliders

  function destroyAndReinitializeHistorySliders() {
    // Cache all jQuery selectors before loop
    const $historySubsections = $(".history__subsection")
    const $historySliders = $(".history__subsection-slider-wrapper")
    const $historySlidersControls = $(".history__subsection-controls")

    // Prepare common slick options to avoid object creation in loop
    const commonSlickOptions = {
      infinite: true,
      draggable: false,
      adaptiveHeight: true,
      swipe: true,
      autoplay: true,
      autoplaySpeed: 3500,
      swipeToSlide: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
    }

    // Process each slider
    $historySliders.each(function (index) {
      const $slider = $(this)
      const slideCount = $slider.find(".history__subsection-slide").length

      if (slideCount <= 1) {
        $historySlidersControls.addClass("slick-hidden")
      }

      // Find buttons once for this iteration
      const $subsection = $historySubsections.eq(index)
      const slickOptions = {
        ...commonSlickOptions,
        prevArrow: $subsection.find(".history__slider-button--prev"),
        nextArrow: $subsection.find(".history__slider-button--next"),
      }

      // Destroy if already initialized
      if ($slider.hasClass("slick-initialized")) {
        $slider.slick("destroy")
      }

      // Initialize with cached options
      $slider.slick(slickOptions)
    })
  }

  // Solution slider

  function destroyAndReinitializeSolutionSlider() {
    // Skip for desktop
    if (!isMobile) return

    // Cache DOM elements
    const $solutionSlider = $(".solution__slider-wrapper")
    const sliderButtons = {
      prevArrow: $(".solution__slider-controls--mobile .solution__slider-button--prev"),
      nextArrow: $(".solution__slider-controls--mobile .solution__slider-button--next"),
    }

    // Reset if already initialized
    if ($solutionSlider.hasClass("slick-initialized")) {
      $solutionSlider.slick("destroy")
    }

    // Initialize with mobile settings
    $solutionSlider.slick({
      nextArrow: sliderButtons.nextArrow,
      prevArrow: sliderButtons.prevArrow,
      infinite: false,
      draggable: false,
      adaptiveHeight: true,
      swipe: true,
      swipeToSlide: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
          },
        },
      ],
    })
  }

  function destroyAndReinitializeAdvantagesSlider() {
    // Skip for desktop
    if (!isMobile) return

    // Cache DOM elements
    const $advantagesSlider = $(".advantages__slider-wrapper")
    const sliderButtons = {
      prevArrow: $(".advantages__slider-controls--mobile .advantages__slider-button--prev"),
      nextArrow: $(".advantages__slider-controls--mobile .advantages__slider-button--next"),
    }

    // Reset if already initialized
    if ($advantagesSlider.hasClass("slick-initialized")) {
      $advantagesSlider.slick("destroy")
    }

    // Initialize with mobile settings
    $advantagesSlider.slick({
      nextArrow: sliderButtons.nextArrow,
      prevArrow: sliderButtons.prevArrow,
      infinite: false,
      draggable: false,
      adaptiveHeight: true,
      variableWidth: true,
      swipe: true,
      swipeToSlide: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    })

    // Remove console.log to improve performance
  }

  function teamPlayer() {
    // Cache DOM elements
    const $playerPreview = $(".player-preview")
    const $progressBar = $(".player-progress__bar")
    const $player = $(".player.team__player")

    function setupPlayerButton() {
      // Use one-time event binding for better memory management
      $(".player-preview__button").one("click", function () {
        // Remove the player preview
        $playerPreview.remove()

        // Create video element with source
        const $video = $("<video>", {
          class: "team__player-video",
          controls: false,
          autoplay: true,
        }).append(
          $("<source>", {
            src: "./videos/team-video.mp4",
            type: "video/mp4",
          })
        )

        // Add to player
        $player.prepend($video)

        // Update progress bar - throttle updates for better performance
        $video.on("timeupdate", function () {
          const progress = (this.currentTime / this.duration) * 100
          gsap.to($progressBar, { width: `${progress}%`, duration: 0.05 })
        })

        // Reset when video ends
        $video.on("ended", function () {
          $video.remove()
          $player.prepend($playerPreview)
          setupPlayerButton()
        })
      })
    }

    setupPlayerButton()
  }

  console.log("Document was loaded up")
  ScrollTrigger.refresh()
  // Sliders
  destroyAndReinitializeHistorySliders()
  destroyAndReinitializeSolutionSlider()
  destroyAndReinitializeAdvantagesSlider()
  // Player
  teamPlayer()
  setTimeout(() => {
    // Animations
    setTimeout(() => {
      hidePreloader()
    }, 100)
    animateHero()
    animateSlogan()
    // animateHistory()
    animateTeam()
    animateSolution()
    animateDetailsAndAdvantages()
    animatePromotion()
    animateContact()
  }, 1000)
})

const eventTypes = ["touchstart", "touchmove", "wheel", "mousewheel"]

eventTypes.forEach((eventType) => {
  jQuery.event.special[eventType] = {
    setup: function (_, ns, handle) {
      const passive = eventType !== "touchmove" || !ns.includes("noPreventDefault")
      this.addEventListener(eventType, handle, { passive: passive })
    },
  }
})
