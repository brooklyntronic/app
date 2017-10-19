import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Image, TextInput, Switch, Picker, Flatlist, ActivityIndicator} from 'react-native'
import Video from 'react-native-video'
import { List, ListItem } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker'
import RoundedButton from './RoundedButton'
import FullButton from './FullButton'
import styles from './Styles/MatchupSideStyle'

export default class MatchupSide extends Component {
  // // Prop type warnings
  static propTypes = {
    side: PropTypes.number
  }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }
  constructor (props) {
    super(props)
    this.state = {
      mediaType: 'pic'
    }
  }
  getData () {
    return this.state;
    
  }
  getImage(){
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true
    }).then((result)=>{
      console.error(result.mime)
      this.setState(Object.assign({}, this.state,{imageSelected: true, imageUrl: result.path, mime: result.mime}))
    })
  }
  getVideo () {
    ImagePicker.openPicker({
      mediaType: "video"
    }).then((result)=>{
      this.setState(Object.assign({}, this.state,{videoSelected: true, videoUrl: result.path, mime: result.mime}))
    })
  }
  getYoutube (result) {
    this.setState(Object.assign({}, this.state, {youtubeSelected: true, youtubeResults: null, youtubeId: result.id.videoId}))
  }
  chooseOtherPhoto () {
    this.setState(Object.assign({}, this.state,  {imageSelected: false, imageUrl: ''}))
  }
  chooseOtherVideo () {
    this.setState(Object.assign({}, this.state,  {videoSelected: false, videoUrl: ''}))
  }
  chooseOtherYoutube () {
    this.setState(Object.assign({}, this.state,  {youtubeSelected: false, youtubeId: ''}))
  }
  
  getYoutubeResults(searchTerm, side) {
    this.setState(Object.assign({}, this.state, {ytResultsLoading: true, youtubeResults: []}), fetch('https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBit7fGezaGwPyaeH25wMS1IQ-SXlpou1o&part=snippet&maxResults=50&q='+ searchTerm).then((resp)=>resp.json()).then((respJSON)=>{
      respJSON.items.length = 10
      this.setState(Object.assign({}, this.state,{youtubeResults:respJSON.items, ytResultsLoading: false}))
    }).catch((err)=>{console.log(err)}).done())
    
  }
  render () {
    return (
      <View>
      <Text>Side {this.props.side}</Text>
      <TextInput style={{borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginVertical: 10}} placeholder='Media Title' onChangeText={(text) => this.setState(Object.assign({}, this.state, {name: text}))} value={this.state.name}/>
      <Text>Media Type</Text>
      <Picker style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginVertical: 10}}
      selectedValue ={this.state.mediaType}
      onValueChange={(itemValue, itemIndex) => this.setState(Object.assign({}, this.state, {mediaType: itemValue}))}
      >
      <Picker.Item label='Photo' value='pic'/>
      <Picker.Item label='Video' value='vid'/>
      <Picker.Item label='Youtube' value='yt'/>
      </Picker>

      {this.state.mediaType ==='yt' ? (<View>
        <TextInput style={{borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 10, marginVertical: 10}} placeholder='Search Youtube' onChangeText={(text) => this.setState(Object.assign({}, this.state, {youtubeSearch: text}))} value={this.state.youtubeSearch}/>
        <FullButton onPress={()=>{this.getYoutubeResults(this.state.youtubeSearch)}} text='Search'/>
        {this.state.ytResultsLoading ? (<View><ActivityIndicator/></View>) :
          (<List>
            {this.state.youtubeResults && this.state.youtubeResults.length > 0 ? this.state.youtubeResults.map((result, i)=>{
              return( <ListItem onPress={()=>{this.getYoutube(result)}} key={i} avatar={{uri: result.snippet.thumbnails.default.url}} title={result.snippet.title}/>)
            }) : null}
            </List>)}</View>): null}
      {this.state.mediaType === 'vid' && !this.state.videoSelected? <FullButton text='Get Video' onPress={()=>{this.getVideo()}} />
      :null}
      {this.state.mediaType ==='vid' && this.state.videoSelected ? <View style={styles.centered}><Video source={{uri: this.state.videoUrl}} style={styles.fullImage}/>
      <RoundedButton onPress={()=>{this.chooseOtherVideo()}} text='Choose Another'/>
      </View> : null}
      {this.state.mediaType ==='pic' && !this.state.imageSelected ? <FullButton text='Get Photo' onPress={()=>{this.getImage()}} />  : null}
      {this.state.mediaType ==='pic' && this.state.imageSelected ? <View style={styles.centered}><Image source={{uri: this.state.imageUrl}} style={styles.fullImage}/>
      <RoundedButton onPress={()=>{this.chooseOtherPhoto()}} text='Choose Another'/>
      </View> : null}
      </View>
      )
  }
}
