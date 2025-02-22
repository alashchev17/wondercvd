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
  const menu = $('.header__menu')
  const burgerButton = $('.header__burger')

  let isMenuOpened = false

  burgerButton.on('click', (event) => {
    event.preventDefault()
    body.toggleClass('overflow-hidden')

    if (isMenuOpened) {
      lenis.start()
      lines.toggleClass('active')
      menu.toggleClass('active')
      burgerButton.toggleClass('rotate')
      setTimeout(() => {
        burgerButton.toggleClass('active')
        header.toggleClass('active')
      }, 300)
    } else {
      lenis.stop()
      burgerButton.toggleClass('active')
      lines.toggleClass('active')
      header.toggleClass('active')
      setTimeout(() => {
        menu.toggleClass('active')
        burgerButton.toggleClass('rotate')
      }, 300)
    }

    isMenuOpened = !isMenuOpened
  })
})
