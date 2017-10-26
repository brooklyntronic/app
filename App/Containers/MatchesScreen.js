import React, { Component } from 'react'
import { ActivityIndicator, View, Text,Dimensions, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images} from '../Themes'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/MatchesScreenStyle'
class MatchesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: []
    }
  }
  renderMatches (type) {
    const self = this
    if (this.state[type].length > 0)  {
      return (
        <View>
        <View style={styles.centered}>
        <Text style={styles.heading}>{type==='matches'? 'Matches':'Requests'}</Text>
        </View>
        <List containerStyle={{borderTopWidth: 0}}>
        {this.state.matches.map(function(user, i){
          return( 
              <ListItem
              key={user._id}
              onPress={()=>{self.openMatchScreen(user._id, type==='matches' ? 'match': 'request')}}
              avatar={{ uri: Utilities.getAvatar(user) }}
              roundAvatar
              subtitle={`${user.location.split(',')[0]}`}
              title={user.name.toUpperCase()}
              hideChevron
              style={{borderBottomWidth: 0, marginVertical: 10}}
              />
              )
        })}
        </List>
        </View>)
    }
  }
    componentWillMount() {
      return fetch(Utilities.baseUrl + 'users/matches', {credentials: 'include'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState(Object.assign({}, this.state, {matches: responseJson}))
      })
      .then(()=>
        {fetch(Utilities.baseUrl + 'users/matchRequests', {credentials: 'include'})
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState(Object.assign({}, this.state, {requests: responseJson, isLoading: false}))
        });

      }).done()
    }
    openMatchScreen (matchid, friend){
      this.props.navigation.navigate('ProfileScreen', {id: matchid, friend: friend})
    }
    render() {
      var self = this
      const { width, height } = Dimensions.get('window');
      if (this.state.isLoading) {
        return (
          <View style={styles.mainContainer}>
          <View style={styles.content}>
          <ActivityIndicator />
          </View>
          </View>
          );
      }
  //
  return (
    <ScrollView contentContainerStyle={styles.mainScroll}>
    <View style={styles.container}>
    <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
    {this.renderMatches('requests') }
    {this.renderMatches('matches')}
    </View>
    </ScrollView>
    );
}
}

const mapStateToProps = (state) => {
  return {
    // matchups: getVisibleMatches(state.matchups, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onMatchClick: id => {
    //   dispatch(checkMatchAsWatched(id))
    // }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchesScreen)
