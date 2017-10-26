import React, { Component } from 'react'
import { ActivityIndicator, View, Text, Dimensions, TouchableOpacity, AsyncStorage, ScrollView, ImageBackground} from 'react-native'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import {Images, Colors} from '../Themes'
import BackArrow from '../Components/BackArrow'
import Addicon from '../Components/Addicon'
import SearchBar from '../Components/SearchBar'
import PageHeader from '../Components/PageHeader'
import FullButton from '../Components/FullButton'
import Icon from 'react-native-vector-icons/FontAwesome'
// Styles
import styles from './Styles/MatchupListScreenStyle'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
class MatchupListScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      matchups: [], sideVotes: [], context: 'matchups'
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
  componentDidMount() {
    this.getMatchups('matchups')
  }
  getMatchups (context) {
    this.setState(Object.assign({}, this.state, {isLoading: true, context: context}))
    return fetch(Utilities.baseUrl + context, {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState(Object.assign({}, this.state, {matchups: responseJson, isLoading: false}));
    }).then(()=>{this.getVotes()}).catch((err)=>{console.log(err)}).done()
  }
  openMatchupScreen (matchid, vote){
    const voteParam = vote ? {vote: vote} : null
    this.props.navigation.navigate('MatchupScreen', {id: matchid, voteParam})
  }
  showMyMatchups () {
    this.getMatchups('myMatchups')
  }
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
      <View style={styles.container}>
        <BackArrow onPress={() => this.props.navigation.navigate('AuthenticatedLaunchScreen')}/>
        <Addicon onPress={()=>this.props.navigation.navigate('MatchupCreateScreen')}/>
         <View style = {styles.mainContainer}>
        <View style={styles.sliderWrapper}>
          <Swiper showsButtons={true} showsPagination={false}>
      {this.state.matchups.map(function(matchup, i){
        return( 
          <TouchableOpacity key={matchup._id} onPress={()=>self.openMatchupScreen(matchup.prettyUrl, self.alreadyVoted(matchup._id))} style={styles.centered} >
          <Text style={styles.title}>{matchup.title.toUpperCase()}</Text>
          <Image  style={styles.overlayImage}   source={{uri:'https://d23grucy15vpbj.cloudfront.net/merged/' + matchup.mergedImage}}>
          {self.alreadyVoted(matchup._id)? <View style={styles.overlay}><Text style={styles.overlayText}>Already Voted {matchup.sides[self.alreadyVoted(matchup._id) - 1].name}</Text></View> : null}
          </Image>
          </TouchableOpacity>
          )
      })
    }
    </Swiper>
    </View>

    </View>
    <View style={styles.formContainer}>
    <FullButton text={this.state.context === 'matchups'?'Go To My Matchups': 'Go To Public Matchups'} onPress={()=>{this.showMyMatchups()}}/></View>
      </View>
      
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
