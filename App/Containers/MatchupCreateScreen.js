import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, TextInput, Picker, TouchableOpacity, Switch, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import MatchupSide from '../Components/MatchupSide'
import Utilities from '../Services/Utilities'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Colors} from '../Themes/'
import { RNS3 } from 'react-native-aws3'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MatchupCreateScreenStyle'

class MatchupCreateScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {userId: '', sides: [{side: 1}, {side: 2}]}
  }
  
  addSide () {
    let tempArray = this.state.sides;
    tempArray.push({side: this.state.sides.length + 1})
    this.setState(Object.assign({}, this.state, {sides: tempArray}))
  }
  sendToS3 (tempObject, key) {
    const file = {
      uri: tempObject.imageUrl,
      name: key,
      type: "image/png"
    }
    const options = {
      key: key,
      bucket: "toosentsvids",
      region: "us-west-2",
      accessKey: "AKIAIGA2C2IZIWOYPCWQ",
      secretKey: "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",
      successActionStatus: 201
    }
    return RNS3.put(file, options).then((resp)=>resp).catch((err)=>{console.log(err)})
  }
  isSideInvalid (side) {
    return !side.name || (!side.ytvideo && !side.image)
  }
  isFormInvalid() {
    return !this.state.title
  }
  async getData () {
    if(this.isFormInvalid()){
      return this.setState(Object.assign({}, this.state, {missingData: true}))
    }
    let isValid = true;
    this.setState(Object.assign({}, this.state, {isLoading: true, missingData: false}))
    let tempArray = [], tempObject = {}, matchupSides = []
    this.state.sides.forEach((side, i)=>{
      tempObject = this['side' + (i+1)].getData()
      if (this.isSideInvalid(tempObject)){
        isValid = false
        return
      }
      if (tempObject.mediaType !== 'y'){  
        tempArray.push(this.sendToS3(tempObject, tempObject.image))
      } 
      tempObject.side = i + 1;
      matchupSides.push(tempObject)
    });
    if (!isValid){
      return this.setState(Object.assign({}, this.state, {missingData: true, isLoading: false}))
    }
    if (tempArray.length > 0){
      const sidesResult = await Promise.all(tempArray)
        sidesResult.forEach((result)=>{
          if (result.status !== 201){
            console.error('Error Uploading')
             this.setState(Object.assign({}, this.state, {isLoading: false}))
          }
      })
    }
    let matchup = {
      title: this.state.title,
      category: this.state.category,
      sides: matchupSides,
      isPublicRequest: this.state.isPublic,
      matchupType: this.state.matchupType || 'Matchup'
    }
    fetch(Utilities.baseUrl + 'matchups', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchup: matchup,
      })
    }).then((resp)=>{if(resp.status !== 200){console.log('Error', resp)}
    this.props.navigation.navigate('MatchupListScreen')
  })
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
      <ScrollView style={styles.container}>
      <BackArrow onPress={() => this.props.navigation.goBack(null)}/>
      <View style={styles.centered}><Text style={styles.heading}>Create Matchup</Text></View>
      <View style={styles.formContainer}>
      <TextInput style={styles.matchupInput} placeholder='Matchup Title' onChangeText={(text) => this.setState(Object.assign({}, this.state, {title: text}))} value={this.state.title}/>
      <Text>Category</Text>
      <Picker style={styles.matchupInput}
      selectedValue ={this.state.category}
      onValueChange={(itemValue, itemIndex) => this.setState(Object.assign({}, this.state, {category: itemValue}))}
      >
      {Utilities.matchupCategories.map((category, i)=><Picker.Item key={i} label={category} value={category}/>
        )}
      </Picker>
      {this.state.sides.map((side, i)=>{
        return <MatchupSide ref={(ref)=>{this['side'+ (i+1)] = ref}} key={i} side={side.side} />
      })}
      <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={()=>{this.addSide()}}><Icon name='plus-circle' size={40} color={Colors.brand}/></TouchableOpacity>
      <Text style={{marginTop: 10}}>Add Side</Text>
      </View>
      <Text>Make Public </Text>
      <Switch
      onValueChange={(value) => this.setState({isPublic: value})}
      value={this.state.isPublic}>
      </Switch>
      {this.state.missingData? <Text>Make Sure You Filled in this Form Correctly</Text>:null}
      <FullButton text='Create' onPress={()=>{this.getData()}} />
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchupCreateScreen)
