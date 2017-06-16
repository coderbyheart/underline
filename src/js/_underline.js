/* global document window URL */

import loadFont from 'meownica-web-fonts-loader'
import $ from 'jquery'
import {debounce} from 'lodash'

/**
 * @param {object} el
 * @returns {boolean}
 */
const shouldBeShown = el => {
  const rect = el.getBoundingClientRect()

  if (rect.top < 0) return true // user has scrolled over it, load it anyway
  if (rect.top < window.scrollY + (window.innerHeight || document.documentElement.clientHeight)) return true // top of element is in viewport
  return false
}

export const underline = () => {
  const $window = $(window)
  const $body = $(document.body)

  // Load extras
  loadFont($('link[rel=deferred-stylesheet]').attr('href'), 'styles-loaded', () => {
    $body.removeClass('critical')
    loadFont('//fonts.googleapis.com/css?family=Roboto:300,400,900', 'webfont-loaded')
    loadImages()
    loadTwitter()
  })

  // Images
  const responsiveImages = $('img.responsive').toArray()
  const responsiveBackgroundImages = $('.responsive-bg-image').toArray()
  const loadImages = () => new Promise(resolve => {
    const p = responsiveImages.map((img, index) => {
      if (!shouldBeShown(img)) return
      responsiveImages.splice(index, 1)
      const url = new URL(img.src, window.location.href)
      url.searchParams.set('w', img.getAttribute('width'))
      url.searchParams.set('h', img.getAttribute('height'))
      img.src = url.href
    })
    const b = responsiveBackgroundImages.map((el, index) => {
      console.log(el, shouldBeShown(el))
      if (!shouldBeShown(el)) return
      responsiveBackgroundImages.splice(index, 1)
      const url = new URL(el.style.backgroundImage.match(/url\("([^"]+)"\)/)[1], window.location.href)
      url.searchParams.set('w', '1200')
      el.style.backgroundImage = `url("${url.href}")`
    })
    resolve([...p, ...b])
  })

  // Disqus
  const disqusId = $('meta[name=disqus]').attr('content')
  let hasDisqus = false
  let disqusInited = false
  const disqusThread = document.getElementById('disqus_thread')
  if (disqusId && disqusThread) {
    hasDisqus = true
    window.disqus_config = function () {
      this.page.url = $('link[rel=canonical]').attr('href')
      this.page.identifier = $('meta[name=identifier]').attr('content')
    }
  }
  const loadDisqus = () => {
    if (hasDisqus && !disqusInited && shouldBeShown(disqusThread)) {
      disqusInited = true
      const s = document.createElement('script')
      s.src = `//${disqusId}.disqus.com/embed.js`
      s.setAttribute('data-timestamp', +new Date())
      document.body.appendChild(s)
    }
  }

  // Twitter
  let twitterLoaded = false
  const twitterEls = [...$('.twitter-timeline'), ...$('.twitter-tweet')]
  const loadTwitter = () => {
    if (!twitterLoaded && twitterEls.reduce((show, el) => show || shouldBeShown(el), false)) {
      twitterLoaded = true
      const s = document.createElement('script')
      s.src = '//platform.twitter.com/widgets.js'
      document.body.appendChild(s)
    }
  }

  $body.addClass('not-scrolling')
  const setScrollClass = () => {
    if ($window.scrollTop() > 0) {
      $body.addClass('scrolling')
      $body.removeClass('not-scrolling')
    } else {
      $body.removeClass('scrolling')
      $body.addClass('not-scrolling')
    }
  }
  $window.on('scroll', debounce(setScrollClass, 250))
  $window.on('scroll', debounce(loadDisqus, 250))
  $window.on('scroll', debounce(loadTwitter, 250))
  $window.on('scroll', debounce(loadImages, 250))
  $(() => {
    setScrollClass()
  })
}
