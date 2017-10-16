import React, { Component } from 'react'
import { ActivityIndicator, View, ScrollView, Text, ListView, Dimensions, TouchableOpacity, AsyncStorage } from 'react-native'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images} from '../Themes'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import SearchBar from '../Components/SearchBar'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/MatchesSearchScreenStyle'
import * as Animatable from 'react-native-animatable'
import Swiper from 'react-native-swiper'
class MatchesSearchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: []
    }
  }

  componentWillMount() {
    return fetch(Utilities.baseUrl + 'byPreferences', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({prefUsers: responseJson})
    })
    .then(()=>
      {fetch(Utilities.baseUrl + 'byVotes', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({matchUsers: responseJson, isLoading: false})
    });
    
    }).done()
  }
  openMatchScreen = (matchid) => {
    this.props.navigation.navigate('ProfileScreen', {id: matchid})
  }
  
  /* ***********************************************************
  * STEP 3
  * `_renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
    *************************************************************/
    render() {
      const self = this;
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
    <ScrollView  contentContainerStyle={styles.mainScroll}>
    <View  style={styles.container}>
    <BackArrow onPress={() => this.props.navigation.goBack(null)} style={{position: 'absolute', left: 0, top: 0}}/>
    <PageHeader text='Find People'/>
    <View style = {styles.mainContainer}>
    <Text style={styles.swiperHeading}>By Preferences</Text>
    <View style={styles.sliderWrapper}>
    <Swiper showsButtons={true} showsPagination={false}>
    {this.state.prefUsers.map(function(user, i){
      return( <View  key={user._id}><TouchableOpacity onPress={()=>self.openMatchScreen(user._id)}>
        <View style={styles.centered}>
        <Image style={styles.image} source={{uri:Utilities.getAvatar(user)}}>
        <View style={styles.overlay}>
        <Text style={styles.paragraph}>{user.name.toUpperCase()}</Text>
        <Text style={styles.paragraph}>{user.location.split(',')[0]}</Text>
        </View>
        </Image>
        </View>
        </TouchableOpacity>
        
        </View>
        )
    })}
    </Swiper>
    </View>
     {this.state.matchUsers.length > 0 ? (
              <View>
              <Text style={styles.swiperHeading}>By Matchup Voting</Text>
              <View style={styles.sliderWrapper}>
              <Swiper showsButtons={true} showsPagination={false}>
              {this.state.matchUsers.map(function(user, i){
                return( <View  key={user._id}><TouchableOpacity onPress={()=>self.openMatchScreen(user._id)}>
                  <View style={styles.centered}>
                  <Image style={styles.image} source={{uri:Utilities.getAvatar(user)}}>
                  <View style={styles.overlay}>
                  <Text style={styles.paragraph}>{user.name.toUpperCase()}</Text>
                  <Text style={styles.paragraph}>{user.location.split(',')[0]}</Text>
                  </View>
                  </Image>
                  </View>
                  </TouchableOpacity>
                  
                  </View>
                  )
              })}
              </Swiper>
              </View></View>) :<View style={styles.centered}><Text style={styles.getMore}>You Need to Vote More For Matches by Matchups</Text></View>}
     </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(MatchesSearchScreen)
