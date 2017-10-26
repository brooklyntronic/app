import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View, Linking,Platform, TextInput, Switch, AsyncStorage, ActivityIndicator } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import t from 'tcomb-form-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import FullButton from '../Components/FullButton'
import BackArrow from '../Components/BackArrow'
// Styles
import styles from './Styles/SignupScreenStyle'
import { Images } from '../Themes'
import Utilities from '../Services/Utilities'
import UserActions from '../Redux/UserRedux'

let Form = t.form.Form
let PhoneForm = t.form.Form
// here we are: define your domain model
let UserEmail = t.struct({
  email: t.String,              // a required string
  password: t.String,  // an optional string      // a boolean
});
let UserPhone = t.struct({
  phoneNumber: t.Number
})
let options = {
  fields: {
    email: {
      autoCapitalize:'none',
      error: 'Insert a valid email',
      keyboardType: 'email-address'
    },
    password: {
     secureTextEntry: true,
     error: 'Please enter your password'
   }
 }
};
class SignupScreen extends Component {

  constructor(props) {
    super(props);
    this.state ={
      switchText: <Text>Use Phone</Text>,
      falseSwitchIsOn: false
    }
  }
  componentWillMount () {
    let self = this
    self.setState({fetching: true})
    fetch(Utilities.baseUrl + 'users/loggedIn',  {credentials: 'include'})
    .then(function (resp){ if(resp.status===200){self.props.navigation.navigate('AuthenticatedLaunchScreen')} else {self.setState(Object.assign({}, self.state, {fetching: false}));} }).catch((err)=>{window.alert('No Network'); self.setState({fetching: false})}).done()
  }
  userSignIn () {
    var value = this.refs.form.getValue();
    this.setState({fetching: true})
    if (value){
    
    const username = value.email.toString().toLowerCase();
    const pass = value.password.toString();
    this.props.attemptLogin(username, pass);
    const urlString = Utilities.baseUrl + `users/session?password=${pass}&email=${username}`
      fetch( urlString, {
        method: 'POST'
      }).then(async(response) => {
        response.json().then(async (data) => {
          if (data.status === 500) {
            return this.setState({fetching: false}, function(){
              window.alert('Wrong Credentials, try again')
            })
          }
          this.props.userLoggedIn(data);
          AsyncStorage.multiSet([['@MySuperStore:user', JSON.stringify(data)],['@MySuperStore:userID', data._id],['@MySuperStore:avatar', Utilities.getAvatar(data)], ['@MySuperStore:sideVotes', JSON.stringify(data.sideVotes)],['@MySuperStore:matches', JSON.stringify(data.friends)], ['@MySuperStore:name', data.name], ['@MySuperStore:requestsSent', JSON.stringify(data.requestsSent)]]).then(()=>{
            this.props.navigation.navigate('AuthenticatedLaunchScreen')
          })

        });
      }).catch((error) => {
        window.alert('No Network')
        this.setState({fetching:false})
        
      })}
    }
    signout () {
      fetch(Utilities.baseUrl + 'signout').then((response)=> {
        AsyncStorage.multiRemove(['@MySuperStore:sideVotes', '@MySuperStore:userID','@MySuperStore:matches','@MySuperStore:name']).then(()=>{window.alert('logged out')})
        
      })
    }
    submit ()  {
      this.userSignIn()
    }
    render () {
     if (this.state.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    if (this.state.falseSwitchIsOn){
     loginForm =( 
      <Form
      ref="phoneForm"
      type={UserPhone}
      options={options}
      />
      )
     

   } else {
     loginForm =( 
      <Form
      options={options}
      ref="form"
      type={UserEmail}
      />
      )

   }
   return (
    <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} style={styles.mainScroll}>
    <ScrollView style={styles.container}>
    <View style={styles.centered}>
    <Image source={Images.logo} style={styles.logo} />
    </View>
    <View style={styles.switchContainer}>
    {this.state.switchText}
    <Switch
    onValueChange={(value) => this.setState({falseSwitchIsOn: value, switchText: !value? <Text>Use Email</Text>:<Text>Use Phone</Text>})}
    style={{marginBottom: 30}}
    value={this.state.falseSwitchIsOn}>
    </Switch>
    </View>
    <View  style={styles.formContainer}>
    <View>
    {loginForm}
    <FullButton text="Sign In" onPress={this.submit.bind(this)}/>
    </View>
    </View>
    </ScrollView>
    </KeyboardAwareScrollView>
    )
 }
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLoggedIn: (user)=>{
      dispatch(UserActions.loginSuccess(user))
    },
    attemptLogin: (username, password)=>{
      dispatch(UserActions.attempt(username, password))
    }

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
