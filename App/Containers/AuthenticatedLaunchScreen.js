import React, { Component } from 'react'
import { ScrollView, Text, View, Image, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import Orientation from 'react-native-orientation'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import {Images} from '../Themes'
import ButtonBox from '../Components/ButtonBox'
import BackArrow from '../Components/BackArrow'
// Styles
import styles from './Styles/AuthenticatedLaunchScreenStyle'
import Utilities from '../Services/Utilities'

class AuthenticatedLaunchScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: null
    }
  }
  componentWillMount () {
    let self = this
    AsyncStorage.getItem('@MySuperStore:userID')
      .then((resp)=>self.setState({userID: resp})).done()
    const initial = Orientation.getInitialOrientation();
    if (initial === 'PORTRAIT') {
      this.setState({orientation: 'portrait'})
    } else {
      this.setState({orientation: 'landscape'})
    }
  }
  componentDidMount () {
    Orientation.addOrientationListener(this._orientationDidChange);
  }
  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE') {
      this.setState({orientation: 'landscape'})
    } else {
      this.setState({orientation: 'portrait'})
    }
  }
  openMatchupListScreen = () => {
    this.props.navigation.navigate('MatchupListScreen')
  }
  openProfile= () => {
    this.props.navigation.navigate('MyProfileScreen')
  }
  openMatches = () => {
    this.props.navigation.navigate('MatchesScreen')
  }
  openMatchesSearch = () => {
    this.props.navigation.navigate('MatchesSearchScreen')
  }
  openPreferences = () => {
    this.props.navigation.navigate('PreferencesScreen')
  }
   openMessages = () => {
    this.props.navigation.navigate('MessagesScreen')
  }
  signout () {
    this.setState({isLoading: true})
    self = this

    AsyncStorage.multiRemove(['@MySuperStore:sideVotes', '@MySuperStore:userID','@MySuperStore:matches','@MySuperStore:name']).then(()=>{
     fetch(Utilities.baseUrl + 'signout').then((response)=> { self.props.navigation.navigate('SignupScreen')
   }).done()
   })
  }
  render () {
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
      <ScrollView bounces={false}>
        <View style={styles.container}>
        <View style={styles.mainContainer}>

          <View style={styles.buttonsContainer}>
            <ButtonBox onPress={this.openMatchupListScreen} style={styles.topLeftButton} text='Matchups'  image={Images.circleLogo}  />
            <ButtonBox onPress={this.openMatchesSearch} style={styles.topRightButton} text='Find People' icon='search' iconSize={40} />
            {this.state.orientation === 'landscape' ? <ButtonBox onPress={this.openMatches} style={styles.middleLeftButton} text='My Matches' image={Images.match}/> : null}
          </View>
          {this.state.orientation === 'portrait' ? <View style={styles.buttonsContainer}>
            <ButtonBox onPress={this.openMatches} style={styles.middleLeftButton} text='My Matches' image={Images.match}/>
            <ButtonBox onPress={this.openMessages} style={styles.middleRightButton} text='Messages' icon='envelope' iconSize={40}/>
          </View>:null}
          <View style={styles.buttonsContainer}>
            {this.state.orientation === 'landscape' ?<ButtonBox onPress={this.openMessages} style={styles.middleRightButton} text='Messages' icon='envelope' iconSize={40}/>:null}
            <ButtonBox onPress={this.openProfile} style={styles.bottomLeftButton} text='My Profile' icon='user-circle' iconSize={40}/>
            <ButtonBox onPress={this.openPreferences} style={styles.bottomRightButton} text='Match Preferences' icon='wrench' iconSize={40} />
          </View>
          <TouchableOpacity style={styles.signout}>
          <Text onPress={this.signout.bind(this)} style={styles.signoutText}>Sign Out</Text>
        </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedLaunchScreen)
