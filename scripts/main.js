gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CustomEase)
gsap.registerPlugin(SplitText)

// Performance utilities for smoother animations and DOM operations
const PerformanceUtils = {
  // Throttle: Limit function calls to once per X milliseconds
  throttle: function (fn, delay) {
    let lastCall = 0
    return function (...args) {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        fn.apply(this, args)
      }
    }
  },

  // Debounce: Wait until X ms have passed since last call
  debounce: function (fn, delay) {
    let timer
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  },

  // RAF wrapper: Schedule function to run during next animation frame
  raf: function (fn) {
    return function (...args) {
      requestAnimationFrame(() => fn.apply(this, args))
    }
  },

  // Batch DOM reads and writes to prevent layout thrashing
  batchDOM: function (readFn, writeFn) {
    return function () {
      // Read phase (measure)
      const result = readFn()
      // Write phase (mutate) in next animation frame
      requestAnimationFrame(() => writeFn(result))
    }
  },
}

function optimizeScrollTrigger() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  // ScrollTrigger.normalizeScroll({
  //   allowNestedScroll: true,
  //   lockAxis: false,
  //   momentum: (self) => Math.min(3, self.velocityY / 10000000),
  //   type: 'touch,wheel,pointer',
  // })

  const commonScrollConfig = {
    markers: false,
    toggleActions: 'play none none reverse',
    ignoreMobileResize: true,
    anticipatePin: 1,
  }

  window.createScrollAnimation = function (options) {
    const { trigger, target, properties, start = 'top bottom', end = 'bottom top', scrub = true } = options

    return gsap
      .timeline({
        scrollTrigger: {
          ...commonScrollConfig,
          trigger,
          start,
          end,
          scrub,
        },
      })
      .to(target, properties)
  }
}

const PerformanceMonitor = {
  marks: {},
  start: function (label) {
    this.marks[label] = performance.now()
  },
  end: function (label) {
    if (this.marks[label]) {
      const duration = performance.now() - this.marks[label]
      console.log(`${label}: ${duration.toFixed(2)}ms`)
      delete this.marks[label]
      return duration
    }
    return 0
  },
}

function hidePreloader(preloader) {
  preloader.addClass('hidden')
  setTimeout(() => {
    $('body').removeClass('no-transition')
    preloader.remove()
  }, 500)
}

$(function () {
  ts = new Date().getTime()
  PerformanceMonitor.start('document_ready')
  optimizeScrollTrigger()

  te = new Date().getTime()
  console.log(`On-Ready Load Time: ${te - ts}ms`)
  PerformanceMonitor.end('document_ready')
})

$(window).on('load', function () {
  ScrollTrigger.refresh()
})

// $(window).on(
//   'scroll',
//   PerformanceUtils.debounce(function () {
//     ScrollTrigger.refresh(true)
//   }, 20)
// )

$(document).ready(function () {
  gsap.ticker.lagSmoothing(0)

  // Menu
  const body = $('body')
  const lines = $('.lines')
  const header = $('.header')
  const headerEllipse = $('.header__ellipse')
  const menu = $('.header__menu')
  const burgerButton = $('.header__burger')

  let isMenuOpened = false

  burgerButton.on('click', (event) => {
    event.preventDefault()
    body.toggleClass('overflow-hidden', !isMenuOpened)

    if (isMenuOpened) {
      headerEllipse.toggleClass('active')
      setTimeout(() => {
        lines.toggleClass('active')
        menu.toggleClass('active')
        burgerButton.toggleClass('rotate')
        setTimeout(() => {
          burgerButton.toggleClass('active')
          header.toggleClass('active')
        }, 300)
      }, 300)
    } else {
      burgerButton.toggleClass('active')
      lines.toggleClass('active')
      header.toggleClass('active')
      setTimeout(() => {
        menu.toggleClass('active')
        burgerButton.toggleClass('rotate')
        setTimeout(() => {
          headerEllipse.toggleClass('active')
        }, 300)
      }, 300)
    }

    isMenuOpened = !isMenuOpened
  })

  // Anchors
  $('a[href^="#"]').bind('click', function (e) {
    e.preventDefault()
    var anchor = $(this)
    if (anchor.attr('href') !== '#') {
      const isHeroAnchor = anchor.attr('href') === '#hero'
      const offsetTop = isHeroAnchor ? 0 : $('.header').height() + 32
      const overallScrollTop = $(anchor.attr('href')).offset().top - offsetTop

      function smoothAnimate() {
        $('html').stop().animate(
          {
            scrollTop: overallScrollTop,
          },
          1200
        )
      }
      if (menu.hasClass('active')) {
        headerEllipse.toggleClass('active')
        setTimeout(() => {
          lines.toggleClass('active')
          menu.toggleClass('active')
          burgerButton.toggleClass('rotate')
          setTimeout(() => {
            burgerButton.toggleClass('active')
            header.toggleClass('active')
            body.removeClass('overflow-hidden')
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
    const heroTl = gsap.timeline({
      defaults: {
        duration: 2,
        ease: 'power3.inOut',
      },
    })
    if ($(window).width() > 768) {
      heroTl
        .from('.header', {
          y: -100,
        })
        .from('.header', { opacity: 0 }, '<20%')
        .from(
          SplitText.create('.hero__title', { type: 'words, chars' }).words,
          {
            y: $('.hero__title').height(),
            stagger: 0.3,
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan::before'),
          {
            cssRule: {
              right: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan::after'),
          {
            cssRule: {
              bottom: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan-inner::after'),
          {
            cssRule: {
              bottom: 'calc(100% + 1px)',
              right: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          '.hero__slogan-title',
          {
            y: -25,
            x: -25,
            opacity: 0,
          },
          '<'
        )
    } else {
      heroTl
        .from('.header', {
          y: -100,
        })
        .from('.header', { opacity: 0 }, '<20%')
        .from(
          '.hero__title',
          {
            y: $('.hero__title').height() / 3,
            opacity: 0,
            stagger: 0.3,
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan::before'),
          {
            cssRule: {
              right: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan::after'),
          {
            cssRule: {
              bottom: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          CSSRulePlugin.getRule('.hero__slogan-inner::after'),
          {
            cssRule: {
              bottom: 'calc(100% + 1px)',
              right: 'calc(100% + 1px)',
            },
          },
          '<'
        )
        .from(
          '.hero__slogan-title',
          {
            y: -25,
            x: -25,
            opacity: 0,
          },
          '<'
        )
    }
  }

  /* Slogan Animation */

  function animateSlogan() {
    const sloganInfoHeight = $('.slogan__info').height()
    const isMobileMode = $(window).width() < 768
    const windowHeight = $(window).height()
    const sloganTl = gsap.timeline({
      defaults: {
        duration: 2,
        ease: 'linear',
      },
      scrollTrigger: {
        trigger: '.slogan',
        start: 'top 80%',
        end: `bottom ${windowHeight / 2 + sloganInfoHeight}px`,
        scrub: 1.1,
      },
    })
    const sloganTitleElements = $('.slogan__title-element')
    console.log(sloganTitleElements)
    sloganTl
      .from(sloganTitleElements[0], {
        x: $(sloganTitleElements[0]).width() * -1,
      })
      .from(
        sloganTitleElements[1],
        {
          x: $(sloganTitleElements[1]).width(),
        },
        '<'
      )
      .from(
        sloganTitleElements[2],
        {
          x: $(sloganTitleElements[2]).width() * -1,
        },
        '<'
      )
      .from(
        '.slogan__hexagons',
        {
          y: $('.slogan__hexagons').height(),
          opacity: isMobileMode ? 1 : 0,
        },
        '<'
      )
      .from(
        '.slogan__author',
        {
          x: $('.slogan__author').width(),
        },
        '<'
      )
      .from(
        '.slogan__author',
        {
          opacity: 0,
        },
        '<15%'
      )
      .from(
        '.slogan__ellipse',
        {
          opacity: isMobileMode ? 1 : 0,
        },
        '<'
      )
  }

  /* History Animation */

  function animateHistory() {
    const isMobileMode = $(window).width() < 768
    const windowHeight = $(window).height()

    gsap.set('.history__container', {
      position: 'relative',
      height: '100vh',
    })

    gsap.set('.history__subsection', {
      position: 'absolute',
      top: 0,
      left: isMobileMode ? 9.25 : 0,
      width: isMobileMode ? 'calc(100% - (9.25px * 2))' : '100%',
    })

    const historyTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: 'linear',
      },
      scrollTrigger: {
        trigger: '.history',
        start: 'top top',
        end: () => `+=${windowHeight * 3}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
      },
    })

    const subsections = $('.history__subsection')

    const firstSectionTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.history',
        start: 'top center',
        end: '+=450',
        scrub: true,
      },
    })

    firstSectionTl
      .from(subsections.eq(0).find('.history__info'), {
        y: 120,
        opacity: 0,
      })
      .from(
        subsections.eq(0).find('.history__info-inner'),
        {
          y: 40,
          opacity: 0,
        },
        '<55%'
      )

    subsections.each(function (index) {
      if (index > 0) {
        historyTl
          .from(this, {
            yPercent: 100,
          })
          .from(
            $(this).find('.history__info'),
            {
              y: 120,
              opacity: 0,
            },
            '<15%'
          )
          .from(
            $(this).find('.history__info-inner'),
            {
              y: 40,
              opacity: 0,
            },
            '<35%'
          )
      }
    })

    return historyTl
  }

  /* Team Animation */

  function animateTeam() {
    const teamTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: 'linear',
      },
      scrollTrigger: {
        trigger: '.team',
        start: 'top bottom',
        end: 'bottom 25%',
        scrub: true,
      },
    })

    teamTl.from(
      '.team__title',
      {
        y: 50,
        opacity: 0,
      },
      '<'
    )

    teamTl.from(
      '.team__info-inner',
      {
        y: 50,
      },
      '<15%'
    )
  }

  /* Solution Animation */

  function animateSolution() {
    if ($(window).width() < 768) return

    const sliderWrapper = $('.solution__slider-wrapper')
    const ellipseContainer = $('.solution__ellipse-container')
    const totalWidth = sliderWrapper[0].scrollWidth
    const containerWidth = sliderWrapper.parent().width()
    const maxScroll = -(totalWidth - containerWidth) // negative value for sliding left

    // Title animation before pin
    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.solution',
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    })

    titleTl.from('.solution__title', {
      y: 50,
      opacity: 0,
    })

    // Main slider animation
    const solutionTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: 'power3.inOut',
      },
      scrollTrigger: {
        trigger: '.solution',
        start: 'top top',
        end: '+=750',
        pin: true,
        pinSpacing: true,
        scrub: true,
      },
    })
    solutionTl.to(sliderWrapper, {
      x: maxScroll,
      ease: 'none',
    })
    solutionTl.to(
      ellipseContainer,
      {
        x: $(window).width() - $(ellipseContainer).width(),
        ease: 'none',
      },
      '<'
    )

    return solutionTl
  }

  /* Details animation */

  function animateDetailsAndAdvantages() {
    if ($(window).width() < 768) return

    const currentWindowHeight = $(window).height() * 1.8

    const detailsTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: 'power3.inOut',
      },
      scrollTrigger: {
        trigger: '.details',
        start: 'top 25%',
        end: `+=${currentWindowHeight + 200}`, // Increased scroll distance
        // end: `max`, // Increased scroll distance
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        scrub: true,
      },
    })

    const detailsInfo = $('.details__info')
    const solutionEllipseContainer = $('.solution__ellipse-container')

    gsap.set(detailsInfo, {
      margin: '0 auto',
    })

    // Details animations
    detailsTl
      .from('.details__title', {
        y: 20,
        opacity: 0,
      })
      .from(
        detailsInfo,
        {
          width: '75%',
          opacity: 0,
        },
        '<15%'
      )
      .from(
        '.details__info-image',
        {
          y: 90,
        },
        '<'
      )
      .to(
        solutionEllipseContainer,
        {
          x: 0,
          ease: 'none',
        },
        '<50%'
      )

    // Advantages overlay
    ScrollTrigger.create({
      trigger: '.advantages',
      start: 'top bottom',
      endTrigger: '.advantages',
      end: 'bottom top',
      anticipatePin: 1,
      scrub: true,
    })

    return detailsTl
  }

  /* Promotion Animation */

  function animatePromotion() {
    const isMobileMode = $(window).width() < 768
    const promotionTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: 'linear',
      },
      scrollTrigger: {
        trigger: '.promotion',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    promotionTl
      .to('.promotion__image', {
        y: isMobileMode ? -100 : -175,
        opacity: isMobileMode ? 0 : 1,
      })
      .to(
        '.promotion__info',
        {
          y: isMobileMode ? -15 : -55,
          opacity: isMobileMode ? 0 : 1,
        },
        '<'
      )
  }

  /* Contact Animation */

  function animateContact() {
    const isMobileMode = $(window).width() < 768
    const contactTl = gsap.timeline({
      defaults: {
        duration: 1.7,
        ease: 'linear',
      },
      scrollTrigger: {
        trigger: '.contact',
        start: 'top bottom',
        end: 'bottom center',
        scrub: true,
      },
    })

    contactTl
      .from('.contact__title', {
        y: isMobileMode ? 55 : 155,
        opacity: 0,
      })
      .from(
        '.contact__action',
        {
          y: isMobileMode ? 35 : 75,
          opacity: 0,
        },
        '<'
      )
  }

  // Solution slider

  function destroyAndReinitializeSolutionSlider() {
    const solutionSlider = $('.solution__slider-wrapper')
    let sliderButtons = {
      prevArrow: $('.solution__slider-controls--mobile .solution__slider-button--prev'),
      nextArrow: $('.solution__slider-controls--mobile .solution__slider-button--next'),
    }
    if (solutionSlider.hasClass('slick-initialized')) {
      solutionSlider.slick('destroy')
    }
    if ($(window).width() > 768) {
      if (solutionSlider.hasClass('slick-initialized')) {
        solutionSlider.slick('destroy')
      }
    } else {
      solutionSlider.slick({
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
              adaptiveHeight: true,
              swipe: true,
              swipeToSlide: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
        ],
      })
      console.log(solutionSlider.slick('getSlick'))
    }
  }
  function destroyAndReinitializeAdvantagesSlider() {
    const advantagesSlider = $('.advantages__slider-wrapper')
    let sliderButtons = {
      prevArrow: $('.advantages__slider-controls--mobile .advantages__slider-button--prev'),
      nextArrow: $('.advantages__slider-controls--mobile .advantages__slider-button--next'),
    }
    if (advantagesSlider.hasClass('slick-initialized')) {
      advantagesSlider.slick('destroy')
    }
    if ($(window).width() > 768) {
      if (advantagesSlider.hasClass('slick-initialized')) {
        advantagesSlider.slick('destroy')
      }
    } else {
      advantagesSlider.slick({
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
      console.log(advantagesSlider.slick('getSlick'))
    }
  }

  $(window).on('load', () => {
    const preloader = $('.preloader')
    setTimeout(() => {
      hidePreloader(preloader)

      animateHero()
      animateSlogan()
      animateHistory()
      animateTeam()
      animateSolution()
      animateDetailsAndAdvantages()
      animatePromotion()
      animateContact()
    }, 1000)
    // Starting all instances of the landing page
    destroyAndReinitializeSolutionSlider()
    destroyAndReinitializeAdvantagesSlider()
    // Animations
  })
})
