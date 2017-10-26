import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Picker, TouchableOpacity, FlatList, Animated} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import SocketChat from '../Components/SocketChat'
import { List, ListItem } from 'react-native-elements'
import Swiper from 'react-native-swiper'
import Image from 'react-native-image-progress'
import ImagePicker from 'react-native-image-crop-picker'
import Utilities from '../Services/Utilities'
import { RNS3 } from 'react-native-aws3'
import Icon from 'react-native-vector-icons/FontAwesome'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreferencesScreenStyle'


class MyProfileScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {preferences: null, fetching: true, editSwitch: false, index: 0}
  }
  componentWillMount (){
    return this.getPreferences()
  }
  showEdit(property, isText){
    this.props.navigation.navigate('PreferenceScreen', {property, fromProfile: 'yes', isText: isText || false})
  }
  showMap(property){
    this.props.navigation.navigate('MapPreferenceScreen', {property: property, fromProfile: 'yes'})
  }
  uploadImage () {
    this.setState({photosUploading: true})
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then(image => {
      const file = {
        uri: image.path,
        name: decodeURIComponent('profilePics/'+ this.state.userId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        type: "image/png"
      }
      let tempPhotoArray = this.state.photos
      const options = {
        key: decodeURIComponent('profilePics/'+ this.state.userId + '/' + Date.now() + image.filename.split(' ').join('-').split('.').join('-').replace('#', '-')),
        bucket: "toosentsvids",
        region: "us-west-2",
        accessKey: "AKIAIGA2C2IZIWOYPCWQ",
        secretKey: "si+aOyZ4zYRPSBz2ecI7uucl6zoAMfofgrDxcK6V",
        successActionStatus: 201
      }
      RNS3.put(file, options).then(response => {
        const responseText = JSON.stringify({photo: response.body.postResponse.key})
        const photoKey = response.body.postResponse.key
        fetch(Utilities.baseUrl + 'users/photos', 
          {method: 'POST', 
          credentials: 'include', 
          body: responseText,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }).then((resp)=>{tempPhotoArray.push(photoKey); this.setState({photos: tempPhotoArray, photosUploading: false})}).catch((err)=>{console.log(err); this.setState({photosUploading: false})}).done();
      });
    }).catch((err) => {console.log(err);this.setState({photosUploading: false})}).done();
  }
  getPreferences  (){
    fetch(Utilities.baseUrl + 'getMyProfile', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({preferences: responseJson.attributes, photos: responseJson.photos, writtenAttributes: responseJson.writtenAttributes, fetching: false, userId: responseJson.id, index: 0});
      // this.getPhotos()
    }).done()
  }
  setAvatar(photo) {
    this.setState(Object.assign({}, this.state, {fetching: true}))
    fetch(Utilities.baseUrl + 'users/avatar', {method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({avatar: photo}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(()=>{
      this.getPreferences()
      this.setState(Object.assign({}, this.state, {fetching: false}))
    }).catch((err)=>{alert('Operation Failed, Check Network Settings')})
  }
  deletePhoto(photo){
    this.setState(Object.assign({}, this.state, {fetching: true}))
    fetch(Utilities.baseUrl + 'users/photos/delete', {method: 'POST', 
      credentials: 'include', 
      body: JSON.stringify({pic: photo}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(()=>{
      this.getPreferences()
      this.setState(Object.assign({}, this.state, {fetching: false}))
    }).catch((err)=>{alert('Operation Failed, Check Network Settings')})
  }
  goToSignIn () {
    this.props.navigation.navigate('SignupScreen')
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
      <View style={styles.centered}><Text style={styles.heading}>My Profile</Text></View>
      {this.state.photos.length > 0 ?
        <View style={styles.sliderWrapper}>
        <Swiper showsButtons={true}  showsPagination={false} loop={false} index={this.state.index}>
        {this.state.photos.map(function(photo, i){
          return (
            <View key={i}>
            {i>0?<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}><TouchableOpacity onPress={()=>{self.setAvatar(photo)}}><Text style={styles.link}>Make Profile Pic</Text></TouchableOpacity><TouchableOpacity onPress={()=>{self.deletePhoto(photo)}}><Icon name='trash' size={30} style={styles.link}/></TouchableOpacity></View>:null}
            <View style={styles.centered}><Image style={styles.fullImage} source={{uri: 'https://d23grucy15vpbj.cloudfront.net/'+ photo}}/></View>
            </View>
            )}
          )}
        </Swiper>
        </View> : <Text>No Photos</Text>}
        <View style={styles.content}>
        {this.state.photosUploading ? <View style={styles.centered}><Text style={styles.padding}>Photo Uploading</Text><ActivityIndicator /></View>:<View style={styles.padding}><FullButton onPress={() => {this.uploadImage()}} text='Upload Photo'/></View>}
        <List>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.Name, true)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Name.value}`}</Text></View>} title='Name' ></ListItem>
        <ListItem onPress={()=>self.showEdit(this.state.writtenAttributes.Tagline, true)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Tagline.value}`}</Text></View>} title='Quotation' ></ListItem>
        <ListItem onPress={()=>self.showMap(self.state.writtenAttributes.Location)} subtitle={<View style={styles.subtitleView}><Text style={styles.attr}>{`${this.state.writtenAttributes.Location.value}`}</Text></View>} title='Location' ></ListItem>
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
