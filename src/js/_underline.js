/* global document, window */

import loadFont from 'meownica-web-fonts-loader'
import $ from 'jquery'
import { debounce } from 'lodash'

export const underline = () => {
  loadFont('//fonts.googleapis.com/css?family=Roboto:300,400,900', 'webfont-loaded')

  const disqusId = $('meta[name=disqus]').attr('content')
  if (disqusId && document.getElementById('disqus_thread')) {
    window.disqus_config = function () {
      this.page.url = $('link[rel=canonical]').attr('href')
      this.page.identifier = $('meta[name=identifier]').attr('content')
    }
    const s = document.createElement('script')
    s.src = `https://${disqusId}.disqus.com/embed.js`
    s.setAttribute('data-timestamp', +new Date())
    document.body.appendChild(s)
  }

  const $window = $(window)
  const $body = $(document.body)
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
  $(() => {
    setScrollClass()
  })
}
