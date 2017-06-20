/* global fetch */

import React from 'react'

export class HnShare extends React.Component {
  constructor (props) {
    super(props)
    this.url = props.url
    this.title = props.title
    this.label = props.label
    this.state = {item: false}
  }

  componentDidMount () {
    this.fetchHnStats()
  }

  fetchHnStats () {
    return fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(this.url)}&tags=story`)
      .then(response => response.json())
      .then(({hits}) => {
        if (!hits[0]) return
        this.setState({item: hits[0]})
      })
  }

  render () {
    const {item} = this.state
    const link = !item ? `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(this.url)}&t=${encodeURIComponent(this.title)}` : `https://news.ycombinator.com/item?id=${item.objectID}`
    return <div>
      <a className='share' href={link} target='_blank' aria-label={this.label}>
        <strong>HackerNews</strong>
      </a>
      {!item ? null : <div>
        <dl>
          <dt>Points</dt>
          <dd>{item.points}</dd>
          <dt>Comments</dt>
          <dd>{item.num_comments}</dd>
        </dl>
      </div>}
    </div>
  }
}
