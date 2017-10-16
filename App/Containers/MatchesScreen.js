import React, { Component } from 'react'
import { ActivityIndicator, View, Text,Dimensions, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images} from '../Themes'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import Icon from 'react-native-vector-icons/FontAwesome'
import Utilities from '../Services/Utilities'
// Styles
import styles from './Styles/MatchesScreenStyle'
import Swiper from 'react-native-swiper'
class MatchesScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: []
    }
  }
  renderMatches () {
    const self = this
    if (this.state.matches.length > 0)  {
      return (
          <View style={styles.sliderWrapper}>
          <Swiper showsButtons={true}   showsPagination={false}>
          {this.state.matches.map(function(user, i){
            return( <View  key={user._id}><TouchableOpacity onPress={()=>self.openMatchScreen(user._id)}>
              <View style={styles.centered}>
              <Image style={styles.overlayImage} source={{uri:Utilities.getAvatar(user)}}>
              <View style={styles.overlay}>
              <Text style={styles.overlayText}>{user.name.toUpperCase()}</Text>
              <Text style={styles.overlayText}>{user.location.split(',')[0]}</Text>
              </View>
              </Image>
              </View>
              </TouchableOpacity>
              
              </View>
              )
          })}
          </Swiper>
          </View>)
    }
  }
  renderRequests () {
    const self = this
    if (this.state.requests.length > 0) {
      return (
          <View style={styles.sliderWrapper}>
          <Swiper showsButtons={true}>
          {this.state.matches.map(function(user, i){
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
          </View>)}
  }
  componentWillMount() {
    return fetch(Utilities.baseUrl + 'users/matches', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({matches: responseJson})
    })
    .then(()=>
      {fetch(Utilities.baseUrl + 'users/matchRequests', {credentials: 'include'})
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({requests: responseJson, isLoading: false})
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
    <PageHeader text='Matches'/>
     <View style={styles.mainContainer}>
    {this.renderRequests() }
    {this.renderMatches()}
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
export default connect(mapStateToProps, mapDispatchToProps)(MatchesScreen)
