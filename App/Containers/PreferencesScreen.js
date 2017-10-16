import React, { Component } from 'react'
import { ScrollView, Text, AsyncStorage, View, ActivityIndicator, Image,Picker, TouchableOpacity, FlatList} from 'react-native'
import { connect } from 'react-redux'
import {Images} from '../Themes/'
import BackArrow from '../Components/BackArrow'
import FullButton from '../Components/FullButton'
import PageHeader from '../Components/PageHeader'
import { List, ListItem } from 'react-native-elements'
import Utilities from '../Services/Utilities'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PreferencesScreenStyle'


class PreferencesScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {preferences: null, fetching: true, editSwitch: false}
  }
  componentWillMount (){
    return this.getPreferences()
  }
  showEdit(property){
    this.props.navigation.navigate('PreferenceScreen', {property})
  }
  showMap(property){
    this.props.navigation.navigate('MapPreferenceScreen', {property})
  }
  getPreferences (){
    fetch(Utilities.baseUrl + 'getPreferences', {credentials: 'include'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({preferences: responseJson, fetching: false});
    }).done()
  }
  goToSignIn () {
    this.props.navigation.navigate('SignupScreen')
  }
  
  render () {
    const self = this
    if (this.state.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        )
    }
    return (
      <ScrollView style style={styles.mainScroll}>
      <BackArrow onPress={() => this.props.navigation.navigate('AuthenticatedLaunchScreen')}/>
      <View style={styles.container}>
      <PageHeader text='Match Preferences'/>
       <List>
       <ListItem onPress={()=>self.showMap(self.state.preferences.location)}  title='Location'
            subtitle={
          <View style={styles.subtitleView}>
            <Text style={styles.attr}>{this.state.preferences.location.value}</Text>
          </View>
        }></ListItem>
      <FlatList
        data={this.state.preferences.choicePreferences}
        renderItem={( {item }, i) => (
          <ListItem
            onPress={()=>self.showEdit(item)}
            title={`${item.label.toString()}`}
            subtitle={
          <View style={styles.subtitleView}>
            <Text style={styles.attr}>{item.options.find((option)=>{return option.value === item.value}).label}</Text>
          </View>
        }
          />
        )}
        keyExtractor={item => item.label}
      />
    </List>
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

export default connect(mapStateToProps, mapDispatchToProps)(PreferencesScreen)
