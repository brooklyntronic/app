import { TabNavigator } from 'react-navigation'
import NewVideoChatContainer from '../Containers/NewVideoChatContainer'
import PhoneCallScreen from '../Containers/PhoneCallScreen'
import SocketChatScreen from '../Containers/SocketChatScreen'
import VideoChatScreen from '../Containers/VideoChatScreen'
import ChatScreen from '../Containers/ChatScreen'
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
const SecondaryNav = TabNavigator({
  MessagesScreen: { screen: MessagesScreen },
  MatchesSearchScreen: { screen: MatchesSearchScreen },
  AuthenticatedLaunchScreen: { screen: AuthenticatedLaunchScreen },
  MatchesScreen: { screen: MatchesScreen },
}, {
  // Default config for all screens
  mode: 'modal',
  headerMode: 'none',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default SecondaryNav
