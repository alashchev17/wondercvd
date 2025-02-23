jQuery(function () {
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(CustomEase)

  const lenis = new Lenis({
    autoRaf: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)

  // Header
  const body = $('body')
  const lines = $('.lines')
  const header = $('.header')
  const headerEllipse = $('.header__ellipse')
  const menu = $('.header__menu')
  const burgerButton = $('.header__burger')

  let isMenuOpened = false

  burgerButton.on('click', (event) => {
    event.preventDefault()
    body.toggleClass('overflow-hidden')

    if (isMenuOpened) {
      lenis.start()
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
      lenis.stop()
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
      // переназначение кнопок управление в слайдер для десктопной версии
      solutionSlider.slick('destroy')
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
      // переназначение кнопок управление в слайдер для десктопной версии
      advantagesSlider.slick('destroy')
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
    // Starting all instances of the landing page
    destroyAndReinitializeSolutionSlider()
    destroyAndReinitializeAdvantagesSlider()
  })
})
