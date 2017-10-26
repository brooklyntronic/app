import React, { Component } from 'react'
import { ScrollView, Text, View, Slider, ActivityIndicator, AsyncStorage, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import MapView from 'react-native-maps'
import { List, ListItem } from 'react-native-elements'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import BackArrow from '../Components/BackArrow'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Utilities from '../Services/Utilities'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MapPreferenceScreenStyle'
const mapStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
class MapPreferenceScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reverseGeocode: false,
      radius: this.props.navigation.state.params.property.radius || 5000,
      location: this.props.navigation.state.params.property,
      region: {longitude: this.props.navigation.state.params.property.coordinates[0],
        latitude: this.props.navigation.state.params.property.coordinates[1],
        latitudeDelta: 1,
        longitudeDelta:1,
      },
      marker: 
       {latlng: {latitude: this.props.navigation.state.params.property.coordinates[1], longitude: this.props.navigation.state.params.property.coordinates[0]}}
      
    }
  }
  componentWillMount () {
    AsyncStorage.getItem('@MySuperStore:userID').then((resp)=>{this.setState({userID: resp})}).done()
  }
  setPreference () {
    this.setState({fetching: true});
    var tempuser = this.props.navigation.state.params.fromProfile ==='yes' ?  {
      location: this.state.location.value,
      coordinates: [this.state.marker.latlng.longitude,this.state.marker.latlng.latitude],
      locationRadius: this.state.radius
    } : {
      preferredLocation: this.state.location.value,
      preferredCoordinates: [this.state.marker.latlng.longitude,this.state.marker.latlng.latitude],
      preferredLocationRadius: this.state.radius
    } 
    let user = {...tempuser, id: this.state.userID

    };
    fetch(Utilities.baseUrl + 'users/editProfile',
    {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: user,
      })
    }
    ).then(()=>{let navigationScreen = this.props.navigation.state.params.fromProfile === 'yes'? 'MyProfileScreen': 'PreferencesScreen'; this.props.navigation.navigate(navigationScreen)})
  }
  moveMap (event) {
    event.coordinate.latitudeDelta =0.0922
    event.coordinate.longitudeDelta = 0.0421
    this.setState({
      mapMoving: false,
      region:event.coordinate, 
      marker: {latlng:event.coordinate},
      reverseGeocode: true
    })
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.coordinate.latitude},${event.coordinate.longitude}&key=AIzaSyA_NZIZpd3TbCvuqg_fcnhcpWu-NBLSveE`).then((resp)=>resp.json()).then((respJson)=>{this.setState({location: {value: respJson.results[0].formatted_address}, reverseGeocode: false, radius: this.state.initialRadius});}).done()
  }
  moveMapFromAddress(event, details){
    this.setState({
      mapMoving: true,
      location: {value:details},
      region:{latitude: event.lat, longitude:event.lng, latitudeDelta: 1, longitudeDelta: 1}, 
      marker: {latlng:{latitude: event.lat, longitude:event.lng}}}, function(){
        this.setState({mapMoving: false})
      })

  } 
  startDrag(radius) {
    
    this.setState({mapMoving: true, initialRadius: radius})
  }
  getInitialState() {
  return {
    radius: 5000,
    marker: 
        {latlng: {latitude: this.props.navigation.state.params.property.coordinates[1], longitude: this.props.navigation.state.params.property.coordinates[0]}}
      
    };
  } 
  changeRadius(val){
    this.setState({mapMoving: false, radius: val})
    
  } 
  hideRadius () {
    this.setState({mapMoving: true})
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
      <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}  style={styles.mainScroll}>
      <View style={styles.container}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      <View style={styles.mainContainer}>
      <MapView
      style={styles.mapImage}
      initialRegion={this.state.region}
      region={this.state.region}
      onMarkerDragStart={e => this.startDrag(this.state.radius)}
      onMarkerDragEnd={e => this.moveMap(e.nativeEvent)}
      >
        <MapView.Marker draggable
        coordinate={this.state.marker.latlng}
        title={this.state.marker.title}
        description={this.state.marker.description}
        />
        {this.state.mapMoving || this.props.navigation.state.params.fromProfile === 'yes' ? null:<MapView.Circle center={this.state.marker.latlng} radius={this.state.radius} fillColor='rgba(0,0,0,.2)'/>}
      </MapView>
      </View>
      <View style={styles.formContainer}>
      {this.props.navigation.state.params.fromProfile === 'yes' ? null: 
      <View>
      <Text>Change Search Area</Text>
      <Slider
                  value={this.state.radius}
                  onValueChange={(val )=> {self.hideRadius()}}
                  onSlidingComplete={ val => this.changeRadius(val)}
                  minimumValue={6000}
                  maximumValue={50000}
                  steps={10}
                  minimumTrackTintColor='#1fb28a'
                  maximumTrackTintColor='#d3d3d3'
                  thumbTintColor='#1a9274' /></View>}
      {!this.state.reverseGeocode ? <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      onPress={(data, details = null) => { 
        this.moveMapFromAddress(details.geometry.location, data.description);
      }}
      
      getDefaultValue={() => this.state.location.value}
      
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyA_NZIZpd3TbCvuqg_fcnhcpWu-NBLSveE',
        language: 'en'
      }}
      
      styles={{
        textInputContainer: {
          width: '100%'
        },
        description: {
          fontWeight: 'bold'
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        }
      }}
      
      currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
    /> : null}
      <FullButton text='Done' onPress={()=>{this.setPreference()}}/>
      </View>
      </View>
      </KeyboardAwareScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MapPreferenceScreen)
