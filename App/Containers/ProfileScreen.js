import React, { Component } from 'react'
import Image from 'react-native-image-progress'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, FlatList} from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import Utilities from '../Services/Utilities'
import Swiper from 'react-native-swiper'
import PageHeader from '../Components/PageHeader'
import MapView from 'react-native-maps'
import { List, ListItem } from 'react-native-elements'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ProfileScreenStyle'

class ProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {userId: this.props.navigation.state.params.id, user: {}, fetching: true}
  }
  componentWillMount () {
    this.getUser()
  }
  getUser () {
    this.state.fetching = true;
    fetch('http:localhost:3000/users/profile/'+this.state.userId,{credentials: 'same-origin'})
    .then((resp) =>resp.json())
    .then((jsonResp) => this.setState({user: jsonResp, avatar: Utilities.getAvatar(jsonResp), fetching: false, userProps: jsonResp.profileProps, region:{
      longitude: jsonResp.coordinates[0],
      latitude: jsonResp.coordinates[1],
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}))
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
      <PageHeader text={this.state.user.name}/>
      <View style={styles.mainContainer}>

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
      <MapView
      style={styles.mapImage}
      initialRegion={this.state.region}
      />
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
