import React, { Component } from 'react'
import { View, Text, Picker, TextInput, ScrollView, ActivityIndicator, AsyncStorage, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import Utilities from '../Services/Utilities'
import { GiftedChat, Actions } from 'react-native-gifted-chat'
import { List, ListItem } from 'react-native-elements'
import { filter, indexOf, invert, findKey, union } from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-crop-picker'
import { RNS3 } from 'react-native-aws3'
import io from 'socket.io-client';
import { EventRegister } from 'react-native-event-listeners'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MessageScreenStyle'

class MessageScreen extends Component {
  constructor (props) {
    super(props)
    let user
    let self = this
    if (this.props.navigation.state.params.threadId ){
      user = this.props.navigation.state.params.threadId
      user.avatar = Utilities.getAvatar(user);
    }
    this.state = {sending: true, messages: [],friends: [], searchText: '', fetching: true, recipient: this.props.navigation.state.params.threadId ? user: null}
    this.socket = io.connect(Utilities.baseUrl, {transports: ['websocket']})

    
    this.socket.on('msg_user_handle', function(username, data){
      if (data.user === self.state.recipient._id ){
        data.messages.forEach((message)=>{
          message.received = true
        })
        self.socket.emit('msg_read', self.state.recipient._id,self.state.myId, data)
        self.setState(Object.assign({}, self.state, {messages: data.messages}));
      }
    })
    this.socket.on('call_user_handle', (username, data)=>{this.props.navigation.navigate('PhoneCallScreen', {id: data.caller})
  })
    this.socket.on('msg_read_handle', (data)=>{
      let tempMessages = data.messages
      tempMessages.forEach((message)=>{
        message.received = true
      })
      self.setState(Object.assign({}, self.state, {messages: tempMessages}))
    })
  }
  postMessages(messageBody){
    return fetch(Utilities.baseUrl + 'newMessages',
      {credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageBody)}
      )
  }
  componentWillMount(){
    let self = this
    this.listener = EventRegister.addEventListener('offCall', () => {
      this.setState({
        onCall: false
      })
    })
    AsyncStorage.multiGet(['@MySuperStore:userID', '@MySuperStore:name', '@MySuperStore:avatar']).then((resp)=>{
      self.socket.emit('adduser',  {name: resp[1][1], id:resp[0][1]});
      self.setState(Object.assign({}, self.state, {myId: resp[0][1], myAvatar: resp[2][1]})) })
    fetch(Utilities.baseUrl + 'users/matches', {credentials: 'include'}).then((resp)=>resp.json()).then((respJson)=>{
      this.setState(Object.assign({}, this.state, {friends: respJson}))
    }).
    then(function(){
      if (self.props.navigation.state.params.threadId){
        fetch(Utilities.baseUrl + 'newMessageThread/' + self.props.navigation.state.params.threadId._id).
        then((resp)=>resp.json()).
        then((respJson)=>{
          if (respJson.messages){
            respJson.messages.forEach((message)=>{
              if (message.user._id !== self.state.myId){
                message.received = true
              }
            })
            self.setState(Object.assign({}, self.state, {messages: respJson.messages, fetching: false}),()=>{
              self.socket.emit('msg_read', self.state.recipient._id,self.state.myId, respJson)
              if (respJson.messages.length > 0){
                self.postMessages(respJson)
              }
            })
          }
        }).
        catch((err)=>{self.setState(Object.assign({}, self.state, {fetching: false}))})
      } else {
        self.setState(Object.assign({}, self.state, {fetching: false}))
      }  }). 
    catch((err)=>{ self.setState(Object.assign({}, self.state, {fetching: false}))})
  }
  componentWillUnmount(){
    EventRegister.removeEventListener(this.listener)
  }
  openVideoChat(){
    let self = this
    if(this.state.onCall){
      return
    }
    this.setState(Object.assign({}, this.state, {onCall: true}))
    this.socket.emit('call_user', self.state.recipient._id, self.state.myId, {called: self.state.recipient._id, caller: self.state.myId});
    this.props.navigation.navigate('NewVideoChatContainer', {id: this.state.myId, toId: this.state.recipient._id, called: 'no'})
  }
  filterNames(searchText, names) {
    let text = searchText.toLowerCase();
    return filter(names, (n) => {
      let name = n.name.toLowerCase();
      return name.search(text) !== -1;
    });
  }
  setRecipient(user){
    this.setState(Object.assign({}, this.state, {recipient: user}))
  }
  renderActions() {
    const self = this
    return ( <Actions onPressActionButton = {() => {self.uploadImage()}} /> )
  }
  uploadImage () {
    let self = this
    this.setState({photosUploading: true})
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      const file = {
        uri: image.path,
        name: decodeURIComponent(this.state.myId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        type: "image/png"
      }
      const options = {
        key: decodeURIComponent( this.state.myId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        bucket: "toosentsvids",
        region: "us-west-2",
        accessKey: "AKIAIGA2C2IZIWOYPCWQ",
        secretKey: "si+aOyZ4zYRPSBz2ecI7uucl6zoAMfofgrDxcK6V",
        successActionStatus: 201
      }
      RNS3.put(file, options).then(response => {
        const responseText = JSON.stringify({photo: response.body.postResponse.key})
        const photoKey = response.body.postResponse.key
        const photoLocation = response.body.postResponse.location
        const message =  {
          sent: true,
          _id: new Date(),
          createdAt: new Date(),
          image:photoLocation,
          user: {
            _id: self.state.myId,
          },
        }
        this.setState((previousState) => ({
          messages: GiftedChat.append(previousState.messages, message),
        }))
        let messageBody = {
          messages: self.state.messages,
          user: {_id: this.state.recipient._id}
        }
        this.postMessages(messageBody).then((resp)=>{
          messageBody.user = self.state.myId
          this.socket.emit('msg_user', self.state.recipient._id,self.state.myId ,messageBody)
        });
      })
    }).catch((err) => {console.log(err);this.setState({photosUploading: false})}).done();
  }
  onSend(messages = []) {
    const self = this
    if (messages.length < 1){
      return
    }
    messages.forEach((message)=>{
      message.sent = true
    })
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), function(){
      self.setState(Object.assign({}, self.state, {sending: true}))
      let messageBody = {
        messages: self.state.messages,
        user: this.state.recipient
      }
      self.postMessages(messageBody).then((resp)=>{
        messageBody.user = self.state.myId
        this.socket.emit('msg_user', self.state.recipient._id,self.state.myId ,messageBody)
      });
    });
  }
  render () {
    if (this.state.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    return (

      <View style={styles.container}>
      <View style={styles.topBar}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      {this.state.recipient?<Text style={styles.messageHeading}>{this.state.recipient.name}</Text>:null}{this.state.recipient?<TouchableOpacity onPress={()=>{this.openVideoChat()}}><Icon name='phone-square' style={styles.phone} size={40}/></TouchableOpacity>:null}
      </View>
      {this.props.navigation.state.params.user === 'newMessage' && !this.state.recipient ? 
      ( <View>
        <View style={styles.centered}>
        <Text style={styles.heading}>Message</Text>
        </View>
        <View style={styles.formContainer}>
        <TextInput style={styles.matchupInput} placeholder='Search For Recipient' onChangeText={(text) => {this.setState({searchText: text})}} value={this.state.searchText}/>
        </View>
        <ScrollView>
        <List>
        {this.filterNames(this.state.searchText, this.state.friends).map((result, i)=>{
          return( <ListItem onPress={()=>{this.setRecipient(result)}} key={i} avatar={{uri: Utilities.getAvatar(result)}} title={result.name}/>)
        })}
        </List>
        </ScrollView>
        </View>) : null

    }
    {this.state.recipient?(<View style={styles.centered}>

      </View>):null}
    {this.props.navigation.state.params.user !== 'newMessage' || this.state.recipient ? 
    <GiftedChat
    renderActions={()=>this.renderActions()}
    messages={this.state.messages}
    onSend={(messages) => this.onSend(messages)}
    user={ {_id: this.state.myId, avatar:this.state.myAvatar}}
    />
    :null}
    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
