import React, { Component } from 'react'
import Image from 'react-native-image-progress'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, FlatList} from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import Utilities from '../Services/Utilities'
import Swiper from 'react-native-swiper'
import PageHeader from '../Components/PageHeader'
import { List, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ProfileScreenStyle'
// Make mapview a static map on this page
//const staticMapURL = 'https://maps.googleapis.com/maps/api/staticmap'
class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {userId: this.props.navigation.state.params.id, user: {}, fetching: true, messages: []}
  }
  // componentWillMount () {
    
  // }
  componentWillMount() {
   return this.getUser()
 }
 
 gotoMessage (){
  this.props.navigation.navigate('MessageScreen', {threadId: this.state.user})
}
getUser () {
  this.state.fetching = true;
  fetch(Utilities.baseUrl + 'users/profile/'+this.state.userId,{credentials: 'same-origin'})
  .then((resp) =>resp.json())
  .then((jsonResp) => 
    this.setState({
      user: jsonResp, 
      avatar: Utilities.getAvatar(jsonResp), 
      fetching: false, 
      userProps: jsonResp.profileProps, 
      region:{
        longitude: jsonResp.coordinates[0],
        latitude: jsonResp.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    })
    ).catch((err)=>{console.log(err)}).done()
  AsyncStorage.getItem('@MySuperStore:userID').then((resp)=>{
    this.setState(Object.assign({}, this.state, {myId: resp}))}).done()
}
openVideoChat(){
  if(this.state.onCall){
    return
  }
  this.setState(Object.assign({}, this.state, {onCall: true}),
    function(){
      socket.emit('call_user', this.state.userId, this.state.myId, {called: this.state.userId, caller: this.state.myId});
      this.props.navigation.navigate('NewVideoChatContainer', {id: this.state.myId, toId: this.state.userId, called: 'no'})
    })
  
}
async getTurnServers () {
  fetch(Utilities.baseUrl + 'turnservers').then((resp)=>resp.json()).then((respJSON)=>{console.error(respJSON.v.iceServers)}).catch((err)=>{console.log(err)}).done()
}
makeProps (prop) {
  return this.state.userProps[prop].map(function(attribute){
    if (attribute.label){
      return ( <ListItem key={attribute.label} hideChevron={true} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${attribute.value.charAt(0).toUpperCase()+attribute.value.slice(1)}`}</Text></View>} title={attribute.label} ></ListItem>)
    }
  })
}
render () {

  if (this.state.fetching) {
    return (
      <View style={styles.mainContainer}>
      <View style={styles.content}>
      <ActivityIndicator />
      </View>
      </View>
      )
  }
  return (
    <ScrollView style={styles.mainScroll}>
    <View style={styles.container}>
    <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
    <View style={styles.mainContainer}>
    <Text style={styles.heading}>{this.state.user.name}</Text>
    {this.state.user && this.props.navigation.state.params.friend ==='match' ? <View style={styles.iconBox}>
    <Icon style={styles.icons} name='phone-square' size={40} onPress={()=>{this.openVideoChat()}}/>
    <Icon style={styles.icons} name='envelope' size={40} onPress={()=>{this.gotoMessage()}} />
    <Icon style={styles.icons} name='trash-o' size={40} />
    </View> : null}
    <Image style={styles.fullImage} source={{uri:this.state.avatar}}/>      
    {this.state.user.photos.length > 0? <Text style={styles.pageHeading}>{this.state.user.name}'s Photos</Text>:null}
    <View>
    {this.state.user.photos.length > 0 ? <View style={styles.sliderWrapper}><Swiper showsButtons={true}  showsPagination={false}
    >
    {this.state.user.photos.map(function(photo, i){
      return (
        <View style={styles.centered} key={i}>
        <Image style={styles.fullImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/'+ photo}}></Image>
        </View>
        )
    })}
    </Swiper></View> : null}
    </View>
    </View>
    <List>
    <ListItem hideChevron={true} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.user.location}`}</Text></View>} title='Location' ></ListItem>
    {this.makeProps('Personal')}{this.makeProps('Appearance')}{this.makeProps('Interests')} 
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
