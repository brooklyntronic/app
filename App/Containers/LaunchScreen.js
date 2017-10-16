import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TouchableOpacity} from 'react-native'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import FullButton from '../Components/FullButton'
import { Images } from '../Themes'
import ProfileScreen from './ProfileScreen'
import SignupScreen from './SignupScreen'
import MatchupListScreen from './MatchupListScreen'
import { connect } from 'react-redux'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends React.Component {
  openSignupScreen = () => {
    this.props.navigation.navigate('SignupScreen')
  }
  openMatchupListScreen = () => {
    this.props.navigation.navigate('MatchupListScreen')
  }
  openAuthenticatedLaunchScreen = () => {
    this.props.navigation.navigate('AuthenticatedLaunchScreen')
  }
  openProfileScreen = () => {
    this.props.navigation.navigate('ProfileScreen')
  }
  render () {
    return (
      <ScrollView>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={styles.logo} />
          </View>
          <View style={styles.padding} >
            <FullButton onPress={this.openSignupScreen}  text="Sign In"/>
            <FullButton onPress={this.openMatchupListScreen}  text="List"/>
            <FullButton onPress={this.openProfileScreen}  text="Profile"/>
            <FullButton onPress={this.openAuthenticatedLaunchScreen}  text="Logged In Screen"/>
          </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

