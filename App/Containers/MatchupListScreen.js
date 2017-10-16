import React, { Component } from 'react'
import { ActivityIndicator, View, Text, Dimensions, TouchableOpacity, AsyncStorage, ScrollView, ImageBackground, Image } from 'react-native'
import { connect } from 'react-redux'
import {Images, Colors} from '../Themes'
import BackArrow from '../Components/BackArrow'
import SearchBar from '../Components/SearchBar'
import Icon from 'react-native-vector-icons/FontAwesome'
// Styles
import styles from './Styles/MatchupListScreenStyle'
import * as Animatable from 'react-native-animatable'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
class MatchupListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true, matchups: [], sideVotes: []
    }
  }
  getVotes () {
        AsyncStorage.getItem('@MySuperStore:sideVotes').then((value) => {
       this.setState({sideVotes: JSON.parse(value)});
    }, (err)=>{alert(err)}).done();
  }
  alreadyVoted (matchup){
      if (!this.state.sideVotes){
        return false;
      }
      var sideVotes = this.state.sideVotes;
      var result = sideVotes.find(function(sv){
        return sv.matchup === matchup 
      });
      return result ? result.vote : false
    }
  componentWillMount() {
    return fetch(Utilities.baseUrl + 'matchups', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({matchups: responseJson, isLoading: false});this.getVotes()
    }).done()
  }
  openMatchupScreen = (matchid, vote) => {
    const voteParam = vote ? {vote: vote} : null
    this.props.navigation.navigate('MatchupScreen', {id: matchid, voteParam})
  }
  /* ***********************************************************
  * STEP 3
  * `_renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={matchup.title} description={matchup.description} />
  *************************************************************/
render() {
  var self= this
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
      <ScrollView style={styles.mainScroll}>
      <View style={styles.container}>
        <BackArrow onPress={() => this.props.navigation.navigate('AuthenticatedLaunchScreen')}/>
        <View style={styles.logoContainer}><Image source={Images.circleLogo}  style={styles.smallLogo}/><Text style={styles.logoHeading}>Matchups</Text></View>
         <TouchableOpacity style={{marginLeft: 20}} onPress={()=>this.props.navigation.navigate('MatchupCreateScreen')}><Icon name='plus-circle' size={40} color={Colors.brand}/></TouchableOpacity>
         <View style = {styles.mainContainer}>

        <View style={styles.sliderWrapper}>
          <Swiper showsButtons={true} showsPagination={false}>
      {this.state.matchups.map(function(matchup, i){
        return( 
          <TouchableOpacity key={matchup._id} onPress={()=>self.openMatchupScreen(matchup.prettyUrl, self.alreadyVoted(matchup._id))} style={styles.centered} >
          <Text style={styles.title}>{matchup.title.toUpperCase()}</Text>
          <ImageBackground  style={styles.overlayImage}   source={{uri:'https://d23grucy15vpbj.cloudfront.net/merged/' + matchup.mergedImage}}>
          {self.alreadyVoted(matchup._id)? <View style={styles.overlay}><Text style={styles.overlayText}>Already Voted {matchup.sides[self.alreadyVoted(matchup._id) - 1].name}</Text></View> : null}
          </ImageBackground>
          </TouchableOpacity>
          )
      })
    }
    </Swiper>
    </View>
    </View>
      </View>
      </ScrollView>
      
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // matchups: getVisibleMatchups(state.matchups, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onMatchupClick: id => {
    //   dispatch(checkMatchupAsWatched(id))
    // }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MatchupListScreen)
