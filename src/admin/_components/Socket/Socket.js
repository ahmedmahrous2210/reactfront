import React, { useState, useEffect, Component } from 'react'
import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://127.0.0.1:5000'

export default class Socket extends Component {
  constructor () {
    super()

    this.state = {
      response: ''
    }
    const socket = socketIOClient(ENDPOINT)
    socket.on('FromAPI', data => {
      this.setState({ response: data })
    })
  }
                 
  render () {
    return (                   
      <p>
        <h3>Socket Test</h3>
        It's <time dateTime={this.state.response}>{this.state.response}</time>
      </p>
    )
  }
}
