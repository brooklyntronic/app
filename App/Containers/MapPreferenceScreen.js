import React, { Component } from 'react'
import { ScrollView, Text, View, Slider } from 'react-native'
import { connect } from 'react-redux'
import MapView from 'react-native-maps'
import { List, ListItem } from 'react-native-elements'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import BackArrow from '../Components/BackArrow'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MapPreferenceScreenStyle'

class MapPreferenceScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      reverseGeocode: false,
      radius: 5000,
      location: this.props.navigation.state.params.property,
      region: {longitude: this.props.navigation.state.params.property.coordinates[0],
        latitude: this.props.navigation.state.params.property.coordinates[1],
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      marker: 
       {latlng: {latitude: this.props.navigation.state.params.property.coordinates[1], longitude: this.props.navigation.state.params.property.coordinates[0]}}
      
    }
  }
  reverseGeocode(){

  }
  moveMap(event){
    event.coordinate.latitudeDelta =0.0922
    event.coordinate.longitudeDelta = 0.0421
    this.setState({
      mapMoving: false,
      region:event.coordinate, 
      marker: {latlng:event.coordinate},
      reverseGeocode: true
    })
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.coordinate.latitude},${event.coordinate.longitude}&key=AIzaSyA_NZIZpd3TbCvuqg_fcnhcpWu-NBLSveE`).then((resp)=>resp.json()).then((respJson)=>{this.setState({location: {value: respJson.results[0].formatted_address}, reverseGeocode: false})}).done()
  }
  moveMapFromAddress(event){
    this.setState({
      mapMoving: false,
      region:{latitude: event.lat, longitude:event.lng, latitudeDelta: 0.0922, longitudeDelta: 0.0421}, 
      marker: {latlng:{latitude: event.lat, longitude:event.lng}}})

  } 
  startDrag() {
    this.setState({radius:0, mapMoving: true})
  }
  getInitialState() {
  return {
    radius: 5000,
    marker: 
        {latlng: {latitude: this.props.navigation.state.params.property.coordinates[1], longitude: this.props.navigation.state.params.property.coordinates[0]}}
      
    };
  } 
  changeRadius(val){
    let self = this;
    this.setState({mapMoving: true, radius: val});
    setTimeout(function(){
      self.setState({mapMoving: false})
    }, 10)
    
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
      <ScrollView contentContainerStyle={styles.mainScroll}>
      <View style={styles.container}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      <PageHeader text='Location Preference'/>
      <View style={styles.mainContainer}>
      <MapView
      style={styles.mapImage}
      initialRegion={this.state.region}
      onMarkerDragStart={e => this.startDrag()}
      onMarkerDragEnd={e => this.moveMap(e.nativeEvent)}
      region={this.state.region}
      >
        <MapView.Marker draggable
        coordinate={this.state.marker.latlng}
        title={this.state.marker.title}
        description={this.state.marker.description}
        />
        {this.state.mapMoving ? null:<MapView.Circle center={this.state.marker.latlng} radius={this.state.radius} fillColor='rgba(0,0,0,.2)'/>}
      </MapView>
      </View>
      <View style={styles.formContainer}>
      <Slider
            value={this.state.radius}
            onValueChange={(val )=> {self.changeRadius(val)}}
            onSlidingComplete={ val => this.changeRadius(val)}
            minimumValue={1000}
            maximumValue={10000}
            steps={100}
            minimumTrackTintColor='#1fb28a'
            maximumTrackTintColor='#d3d3d3'
            thumbTintColor='#1a9274' />
      {!this.state.reverseGeocode ? <GooglePlacesAutocomplete
      placeholder='Search'
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed='auto'    // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => { 
        this.moveMapFromAddress(details.geometry.location);
      }}
      
      getDefaultValue={() => this.state.location.value}
      
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyA_NZIZpd3TbCvuqg_fcnhcpWu-NBLSveE',
        language: 'en', // language of the results
        types: '(cities)' // default: 'geocode'
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

      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
    /> : null}
      <FullButton text='Done' onPress={()=>this.setPreference(this.propertyValue).bind(this)}/>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(MapPreferenceScreen)
