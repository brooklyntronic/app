import React, { Component } from 'react'
import { ScrollView, Text, FlatList, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import {Images, Colors} from '../Themes/'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import RadioButton from '../Components/RadioButton'
import BackArrow from '../Components/BackArrow'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MessagesScreenStyle'

class MessagesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {messages: {}, isLoading: true, messageType: 'messagesRecieved'}
  }
  componentDidMount() {
     fetch(Utilities.baseUrl + 'messages', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({messages: responseJson, isLoading: false});
    }).done()
  }
  gotoMessage = (id)=> {
    this.props.navigation.navigate('MessageScreen', {msgId: id})
  };
  changeMessageType =  (messageType)=>{
    this.setState({messageType: messageType})
  };
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
      <View style={styles.container}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      <View style={styles.logoContainer}><Image source={Images.circleLogo}  style={styles.smallLogo}/><Text style={styles.logoHeading}>Messages</Text></View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
      <RadioButton selected={this.state.messageType === 'messagesRecieved'} onPress={()=>self.changeMessageType('messagesRecieved')} text='Received'/>
      <RadioButton selected={this.state.messageType === 'messagesSent'} onPress={()=>self.changeMessageType('messagesSent')} text='Sent'/>
      <TouchableOpacity><Icon name='plus-circle' size={40} color={Colors.brand}/></TouchableOpacity>
      </View>
      <List>
      <FlatList
        data={this.state.messages[this.state.messageType]}
        renderItem={( {item }) => (
          <ListItem
            onPress={()=>self.gotoMessage(item.msgId)}
            roundAvatar
            title={`${item.to}`}
            subtitle={item.subject}
            avatar={{ uri: 'https://d23grucy15vpbj.cloudfront.net/' + item.avatar }}
          />
        )}
        keyExtractor={item => item.msgId}
      />
    </List>
    </View>
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
