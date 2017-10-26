import React, { Component } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import io from 'socket.io-client'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/SocketChatScreenStyle'

class SocketChatScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

componentDidMount () {


  }
  render () {
    return (
      <View></View>
      )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketChatScreen)
