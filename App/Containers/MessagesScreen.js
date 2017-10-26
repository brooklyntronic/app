import React, { Component } from 'react'
import { ScrollView, Text, FlatList, View, ActivityIndicator, Image, TouchableOpacity, AsyncStorage } from 'react-native'
import {Images, Colors} from '../Themes/'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import PageHeader from '../Components/PageHeader'
import BackArrow from '../Components/BackArrow'
import Addicon from '../Components/Addicon'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
import Swipeout from 'react-native-swipeout'
import {orderBy} from 'lodash'
import io from 'socket.io-client'
import { EventRegister } from 'react-native-event-listeners'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MessagesScreenStyle'

class MessagesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {messages: {}, isLoading: true, messageType: 'messagesRecieved'}
    this.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    this.socket.on('msg_user_handle', (username, data)=>{
      this.getMessages()
    })
    this.socket.on('call_user_handle', (username, data)=>{this.props.navigation.navigate('PhoneCallScreen', {id: data.caller})
    })
  }
  componentWillMount() {
    let self = this
    EventRegister.emit('messagesChecked')
    AsyncStorage.multiGet(['@MySuperStore:userID', '@MySuperStore:name']).then((resp)=>{
      self.socket.emit('adduser',  {name: resp[1][1], id:resp[0][1]});
      self.setState(Object.assign({}, self.state, {myId: resp[0][1]}),
        function(){
          self.getMessages();
        })
    })

 }
 getMessages(){
  return fetch(Utilities.baseUrl + 'newMessages', {credentials: 'include'})
   .then((response) => response.json())
   .then((responseJson) => {
    let newArray = [], sortedArray = []
    for (var key in responseJson){
      newArray.push(responseJson[key])
    }

    sortedArray = orderBy(newArray, function(e) { return new Date(e.messages[0].createdAt)}, ['desc']);
    this.setState({messages: sortedArray, isLoading: false});
  }).done()
 }
 gotoMessage (id) {
  this.props.navigation.navigate('MessageScreen', {threadId: id})
}
changeMessageType (messageType) {
  this.setState({messageType: messageType})
}
createMessage () {
  this.props.navigation.navigate('MessageScreen', {user: 'newMessage'})
}
newMessages (list){

  var tempArray = [];
  list.forEach((item)=>{
    if(!item.received && item.user._id !== this.state.myId){
      tempArray.push(item)
    }
  })

  return tempArray.length > 0 ? {value: tempArray.length, containerStyle:{backgroundColor: 'red', top: 5}} : null
}
deleteThread (id) {
  this.setState(Object.assign({}, this.state, {isLoading: true}))
  let self = this
  fetch(Utilities.baseUrl + 'deleteNewMessage', 
    {credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})}
  ).then((resp)=>resp.json()).then((responseJson)=>{
    let newArray = []
    for (var key in responseJson){
      newArray.push(responseJson[key])
    }
    this.setState({messages: newArray, isLoading: false});
  })
}
render () {
  const self = this;
  if (this.state.isLoading) {
    return (
      <View style={styles.mainContainer}>
      <View style={styles.content}>
      <ActivityIndicator />
      </View>
      </View>
      );
  }
  return (
    <ScrollView contentContainerStyle={styles.mainScroll}>
    <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
    <Addicon onPress={()=>{this.createMessage()}} />
    <List containerStyle={{borderTopWidth: 0}}>
    <FlatList
    data={this.state.messages}
    renderItem={( {item }) => {
      let swipeoutBtns = [{
              text: 'Delete',
              backgroundColor: '#ff0000',
              onPress: ()=>{self.deleteThread(item.user._id)}
            }]
      return (
          <Swipeout right={swipeoutBtns} style={{backgroundColor: 'transparent'}}>
          <ListItem
          onPress={()=>self.gotoMessage(item.user)}
          subtitle={item.messages[0].text}
          title={item.user.name}
          avatar={Utilities.getAvatar(item.user)}
          roundAvatar
          badge={self.newMessages(item.messages)}
          hideChevron
          style={{borderBottomWidth: 0, marginVertical: 10}}
          /></Swipeout>
          )}
  }
    keyExtractor={item => item.user._id}
    />

    </List>
    </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessagesScreen)
