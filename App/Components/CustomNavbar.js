import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, AsyncStorage, InteractionManager } from 'react-native'
import styles from './Styles/CustomNavbarStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Badge } from 'react-native-elements'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
import io from 'socket.io-client';
import { EventRegister } from 'react-native-event-listeners'
export default class CustomNavbar extends Component {
  // // Prop type warnings
  static propTypes = {
    searchNavigate: PropTypes.func,
    messagesNavigate: PropTypes.func,
    profileNavigate: PropTypes.func,
    matchesNavigate: PropTypes.func,
    answerCall: PropTypes.func,
    newMessages:PropTypes.number,
    hangCall: PropTypes.func
  }
  constructor (props) {
    super(props)
    let self = this
    this.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})
    this.state = {newMessages: 0, newRequests: 0}
    
    this.socket.on('call_user_handle', function(username, data){
      console.error('test')
      self.props.answerCall(data)
    })
    this.socket.on('msg_user_handle', function(username, data){

      self.setState({newMessages: self.state.newMessages? self.state.newMessages + 1 : 1})
    })
  }
  componentWillMount(){
    let self = this
    AsyncStorage.multiGet(['@MySuperStore:userID', '@MySuperStore:name'])
    .then((response)=>{
      const myId = response[0][1]
      var obj = {};
      obj[response[0][1]] = {name: response[1][1], id:response[0][1]};
      this.socket.emit('adduser', obj);
      InteractionManager.runAfterInteractions(() => {
  // ...long-running synchronous task...

      fetch(Utilities.baseUrl + 'newMessages', {credentials: 'include'}).then((resp)=>resp.json()).then((responseJSON)=>{
        let newArray = new Array();
        for (var thread in responseJSON){
          newArray = newArray.concat(responseJSON[thread].messages.filter((message)=>{
            return (message.user._id !== myId) && !message.received && message.sent
          }))
        }
        // self.setState(Object.assign({}, self.state, {newMessages: newArray.length}))
      }).then(()=>{
        self.getMessages()
      })

      
      this.listener = EventRegister.addEventListener('messagesChecked', () => {
            this.setState({
                newMessages: 0
            })
        })
    });
    }).done()   
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener)
  }
  getMessages() {
    return fetch(Utilities.baseUrl + 'users/me', {credentials: 'include'}).then((resp)=>resp.json()).then((user)=>{
         if (user.requestsRecieved.length > 0) {
          var tempRequestArray = user.requestsRecieved.filter(function(request){
            return user.requestsAnswered.indexOf(request) < 0
          });
          const newRequests = tempRequestArray.length;
          this.setState(Object.assign({}, this.state, {newRequests: newRequests}))
        }
      }).catch((err)=>{alert('Network Error')})
  }
  removeBadgeAndNavigateToMessages(){
    this.setState({newMessages: 0}, ()=>{
      this.props.messagesNavigate()
    })
  }
  render () {
    const self = this
    return (
      <View style={styles.container}>
      <Swiper showsPagination={false}>
      <View style={styles.menuPart} key={1} >
      <TouchableOpacity onPress={()=>{this.props.searchNavigate()}}><Icon name='search' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{}}><Icon name='envelope' size={30} color='#add8e6'/>
      {self.state.newMessages && self.state.newMessages > 0 ? <View style={{position: 'absolute', right: -5}}><Badge containerStyle={{ backgroundColor: 'red', padding: 5, borderRadius:5}} value={self.state.newMessages} /></View>:null}
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.profileNavigate()}}><Icon name='user-circle' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.matchesNavigate()}}><Icon name='heart' size={30} color='#add8e6'/>
      {self.state.newRequests && self.state.newRequests > 0 ? <View style={{position: 'absolute', right: -5}}><Badge containerStyle={{ backgroundColor: 'red', padding: 5, borderRadius:5}} value={self.state.newRequests} /></View>:null}
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.homeNavigate()}}><Icon name='home' size={30} color='#add8e6'/></TouchableOpacity>
      </View>
      <View style={styles.menuPart} key={2}>
      <TouchableOpacity onPress={()=>{this.props.searchNavigate()}}><Icon name='search' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.removeBadgeAndNavigateToMessages()}}><Icon name='envelope' size={30} color='#add8e6'/>
      {self.state.newMessages && self.state.newMessages > 0 ? <View style={{position: 'absolute', right: -5}}><Badge containerStyle={{ backgroundColor: 'red', padding: 5, borderRadius:5}} value={self.state.newMessages} /></View>:null}
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.profileNavigate()}}><Icon name='user-circle' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.matchesNavigate()}}><Icon name='heart' size={30} color='#add8e6'/></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.props.homeNavigate()}}><Icon name='home' size={30} color='#add8e6'/></TouchableOpacity>
      </View>
      </Swiper>
      </View>
      )
  }
}
