import { StackNavigator } from 'react-navigation'
import React from 'react'
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
import CustomNavbar from '../Components/CustomNavbar'
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  NewVideoChatContainer: { screen: NewVideoChatContainer, navigationOptions: {
        headerMode: 'none',
      } },
  PhoneCallScreen: { screen: PhoneCallScreen , navigationOptions: {
        headerMode: 'none',
      } },
  SocketChatScreen: { screen: SocketChatScreen },
  VideoChatScreen: { screen: VideoChatScreen },
  ChatScreen: { screen: ChatScreen },
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
  SignupScreen: { screen: SignupScreen,navigationOptions: {
        header: null,
      } },
  MatchupListScreen: { screen: MatchupListScreen },
  Login: { screen: Login },
  LaunchScreen: { screen: LaunchScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'SignupScreen',
  navigationOptions: {
    header: (props)=>{
      return(
        <CustomNavbar
          answerCall={(data)=>{props.navigation.navigate('PhoneCallScreen', {id: data.caller})}}
          searchNavigate={()=>{props.navigation.navigate('MatchesSearchScreen')}}
          messagesNavigate={()=>{props.navigation.navigate('MessagesScreen')}}
          matchesNavigate={()=>{props.navigation.navigate('MatchesScreen')}}
          profileNavigate={()=>{props.navigation.navigate('MyProfileScreen')}}
          homeNavigate={()=>{props.navigation.navigate('AuthenticatedLaunchScreen')}}
          hangCall={()=>{props.navigation.goBack(null)}}
        />
        )
    }

  }
})
export default PrimaryNav
