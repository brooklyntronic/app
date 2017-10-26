import React, { Component } from 'react'
import Image from 'react-native-image-progress'
import { View, Text, ActivityIndicator, ScrollView, AsyncStorage, Animated } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import FullButton from '../Components/FullButton'
import YouTube from 'react-native-youtube'
import UserActions from '../Redux/UserRedux'
import Swiper from 'react-native-swiper'
import Utilities from '../Services/Utilities'
import { VictoryBar, VictoryPie } from 'victory-native'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MatchupScreenStyle'
import {Images} from '../Themes'
class MatchupScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }
  componentWillMount() {
    return this.getData()
  }
  getData() {
    fetch(Utilities.baseUrl + 'matchups/' + this.props.navigation.state.params.id, {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        dataSource: responseJson
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }
  vote (side){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const now = new Date().getTime();
    const self = this
    self.setState({isLoading: true});
    fetch(Utilities.baseUrl + 'users/votes', {
      method: 'POST',
      credentials: 'include',
      headers: myHeaders,
      mode: 'cors',
      body: JSON.stringify(
      {
        'date': now,
        'vote': side,
        'matchup': self.state.dataSource._id
      })
    }).then((resp)=>resp.json()).then((respJson) => {
      self.getData()
      AsyncStorage.setItem('@MySuperStore:sideVotes', JSON.stringify(respJson))
    }).then(()=>self.setState({isLoading: false})).done()
  }
  staticContent () {
    const self = this
    return (
      self.state.dataSource.sides.map(function (item) {
        if (item.mediaType === 'pic'){
          return (
            <View style={styles.matchupContainer}  key={item.side}>
            <Image source={{uri: 'https://d23grucy15vpbj.cloudfront.net/' + item.image}}  style={styles.fullImage}  />
            {self.state.dataSource.matchupType === 'Poll' || self.state.dataSource.myVote  ? null : <FullButton onPress={self.vote(item.side)}  text={'Vote '+ item.name} />}
            </View>
            )
        } if (item.mediaType === 'y'){
          return(
            <View key={item.side}>
            <View style={styles.centered}>
            <YouTube
            videoId={item.ytvideo}   
            play={false}             
            fullscreen={false}       
            loop={false} 
            style={styles.fullImage} 
            />
            </View>
            {self.state.dataSource.matchupType === 'Poll' || self.state.dataSource.myVote ? null : <FullButton onPress={()=>self.vote(item.side)}  text={'Vote '+ item.name} />}
            </View>
            )
        }
      })
      )
  }
  contents () {
    const self = this
    return (self.state.dataSource.matchupType==='Poll' ? this.staticContent() : (
      <View style={styles.matchupSliderWrapper}>
      <Swiper showsButtons={true} showsPagination={false} loop={false}>
      {this.swiperSlides()}
      </Swiper>
      </View>
      ))
  }
  swiperSlides () {
    const self = this
    return (
      self.state.dataSource.sides.map(function (item){
        if (item.mediaType === 'pic'){
          return (
            <View style={styles.centered}  key={item.side}>
            <Image source={{uri: 'https://d23grucy15vpbj.cloudfront.net/' + item.image}}  style={styles.fullImage}  />
            {!self.state.dataSource.myVote ? <FullButton onPress={()=>self.vote(item.side)}  text={'Vote '+ item.name} /> : self.state.dataSource.myVote == item.side ? <Text style={styles.matchupHeading}>Voted for {self.state.dataSource.sides[self.state.dataSource.myVote - 1].name}</Text> : <Text style={styles.matchupHeading}>{item.name}</Text>}
            </View>
            )
        } if (item.mediaType === 'y'){
          return(
            <View  style={styles.centered}   key={item.side}>
            <View>
            <YouTube
            videoId={item.ytvideo}   
            play={false}             
            fullscreen={false}       
            loop={false} 
            style={styles.fullImage} 
            />
            </View>
            {!self.state.dataSource.myVote ? <FullButton onPress={()=>self.vote(item.side)}  text={'Vote '+ item.name} /> : self.state.dataSource.myVote == item.side ? <Text style={styles.matchupHeading}>Voted for {self.state.dataSource.sides[self.state.dataSource.myVote - 1].name}</Text> : <Text style={styles.matchupHeading}>{item.name}</Text>}
            </View>
            )
        }
      }) 
      )
  }
  choices() {
    const self = this
    return (self.state.dataSource.matchupType==='Poll' ? self.state.dataSource.sides[0].choices.map(function(side) {
      if (!self.state.dataSource.myVote){
        return <FullButton text={side.name} onPress={()=>self.vote(self.state.dataSource.sides[0].choices.indexOf(side) + 1)} key={self.state.dataSource.sides[0].choices.indexOf(side)}/>
      }
      return <Text key={self.state.dataSource.sides[0].choices.indexOf(side)} style={self.state.dataSource.myVote == self.state.dataSource.sides[0].choices.indexOf(side) + 1 ? styles.bold: {}}>{side.name}</Text>
    }) : null)
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
      <ScrollView contentContainerStyle={styles.mainScroll}>
      <View style={styles.container}>
      <BackArrow onPress={() => this.props.navigation.navigate('MatchupListScreen')}/>
      <View style={styles.mainContainer}>
      <View>
      {this.contents()}
      {this.state.dataSource.matchupType === 'Poll'  && !this.state.dataSource.myVote  ?<View style={styles.centered}><Text style={styles.voteNow}>VOTE NOW</Text></View> : null}
      {this.choices()}
      </View>
      {
      this.state.dataSource.myVote ? <VictoryPie
          style={{
            labels: {
              fill: "white"
            }
          }}
          data={this.state.dataSource.sides.filter((side)=>side.votePercentage > 0).map((side)=>{
            if (side.votePercentage > 0){
              return {x: side.name, y:side.votePercentage}
            }
          })}
          colorScale={[
            "#D85F49",
            "#F66D3B",
            "#D92E1D",
            "#D73C4C",
            "#FFAF59",
            "#E28300",
            "#F6A57F"
          ]}
          innerRadius={70}
          labelRadius={100}
        />:null
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(MatchupScreen)
