import { StackNavigator } from 'react-navigation'
import MapPreferenceScreen from '../Containers/MapPreferenceScreen'
import MatchupCreateScreen from '../Containers/MatchupCreateScreen'
import MyProfileScreen from '../Containers/MyProfileScreen'
import PreferenceScreen from '../Containers/PreferenceScreen'
import MessageScreen from '../Containers/MessageScreen'
import MessagesScreen from '../Containers/MessagesScreen'
import PreferencesScreen from '../Containers/PreferencesScreen'
import MatchesSearchScreen from '../Containers/MatchesSearchScreen'
import AuthenticatedLaunchScreen from '../Containers/AuthenticatedLaunchScreen'
import MatchupScreen from '../Containers/MatchupScreen'
import MatchesScreen from '../Containers/MatchesScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import SignupScreen from '../Containers/SignupScreen'
import MatchupListScreen from '../Containers/MatchupListScreen'
import Login from '../Containers/Login'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  MapPreferenceScreen: { screen: MapPreferenceScreen },
  MatchupCreateScreen: { screen: MatchupCreateScreen },
  MyProfileScreen: { screen: MyProfileScreen },
  PreferenceScreen: { screen: PreferenceScreen },
  MessageScreen: { screen: MessageScreen },
  MessagesScreen: { screen: MessagesScreen },
  PreferencesScreen: { screen: PreferencesScreen },
  MatchesSearchScreen: { screen: MatchesSearchScreen },
  AuthenticatedLaunchScreen: { screen: AuthenticatedLaunchScreen },
  MatchupScreen: { screen: MatchupScreen },
  MatchesScreen: { screen: MatchesScreen },
  ProfileScreen: { screen: ProfileScreen },
  SignupScreen: { screen: SignupScreen },
  MatchupListScreen: { screen: MatchupListScreen },
  Login: { screen: Login },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'SignupScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
