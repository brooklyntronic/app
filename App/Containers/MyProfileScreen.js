import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Picker, TouchableOpacity, FlatList, Animated} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import { List, ListItem } from 'react-native-elements'
import Swiper from 'react-native-swiper'
import Image from 'react-native-image-progress'
import ImagePicker from 'react-native-image-crop-picker'
import Utilities from '../Services/Utilities'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreferencesScreenStyle'


class MyProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {preferences: null, fetching: true, editSwitch: false}
  }
  componentWillMount (){
    return this.getPreferences()
  }
  showEdit(property, isText){
    this.props.navigation.navigate('PreferenceScreen', {property, fromProfile: 'yes', isText: isText || false})
  }
  uploadImage () {
    console.error('click')
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      console.error(image);
    }).done();
  }
  // getPhotos () {
  //   fetch(Utilities.baseUrl + 'getMyPhotos', {credentials: 'include'})
  //   .then((response)=> response.json())
  //   .then((responseJson) => {
  //     this.setState({photos: responseJson})
  //   }).done()
  // }
  getPreferences (){
    fetch(Utilities.baseUrl + 'getMyProfile', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({preferences: responseJson.attributes, photos: responseJson.photos, writtenAttributes: responseJson.writtenAttributes, fetching: false});
      // this.getPhotos()
    }).done()
  }
  goToSignIn () {
    this.props.navigation.navigate('SignupScreen')
  }
  signout () {
    self = this

    AsyncStorage.multiRemove(['@MySuperStore:sideVotes', '@MySuperStore:userID','@MySuperStore:matches','@MySuperStore:name']).then(()=>{
     fetch(Utilities.baseUrl + 'signout').then((response)=> { self.props.navigation.navigate('SignupScreen')
   }).done()
   })
  }
  render () {
    const self = this
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
      <BackArrow onPress={() => this.props.navigation.navigate('AuthenticatedLaunchScreen')}/>
      <View style={styles.logoContainer}><Image source={Images.circleLogo}  style={styles.smallLogo}/><Text style={styles.logoHeading}>Profile</Text></View>
      {this.state.photos.length > 0 ? 
        <View style={styles.sliderWrapper}>
        <Swiper showsButtons={true}  showsPagination={false}>
        {this.state.photos.map(function(photo, i){
          return (
            <View style={styles.centered} key={i}>
            <Image style={styles.fullImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/'+ photo}}></Image>
            </View>
            )}
          )}
        </Swiper>
        </View> : <Text>No Photos</Text>}
        <View style={styles.content}>
        <View style={styles.padding}><FullButton onPress={() => {this.uploadImage()}} text='Upload Photo'/></View>
        <List>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.Name, true)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Name.value}`}</Text></View>} title='Name' ></ListItem>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.Tagline, true)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Tagline.value}`}</Text></View>} title='Quotation' ></ListItem>
        <ListItem subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Location.value}`}</Text></View>} title='Location' ></ListItem>
        <FlatList data={this.state.preferences} renderItem={( {item }, i) => ( <ListItem onPress={()=>self.showEdit(item)} title={`${item.label.toString()}`} subtitle={ <View style={styles.subtitleView}><Text style={styles.attr}>{item.options.find((option)=>{return option.value === item.value}).label}</Text></View>}/>)} keyExtractor={(item) => item.label}/>
          <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.FavoriteFeature, true)} subtitle={<View style={styles.subtitleView} ><Text style={styles.attr}>{`${this.state.writtenAttributes.FavoriteFeature.value}`}</Text></View>} title='Favorite Feature' ></ListItem>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.FavoriteBook, true)} subtitle={<View style={styles.subtitleView} ><Text style={styles.attr}>{`${this.state.writtenAttributes.FavoriteBook.value}`}</Text></View>} title='Favorite Book' ></ListItem>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.FavoriteMovie, true)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.FavoriteMovie.value}`}</Text></View>} title='Favorite Movie' ></ListItem>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)
