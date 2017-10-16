import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, View, Linking,Platform, TextInput, Switch, AsyncStorage, ActivityIndicator } from 'react-native'
import Image from 'react-native-image-progress'
import { connect } from 'react-redux'
import t from 'tcomb-form-native'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import UserActions  from '../Redux/UserRedux'
import Types from '../Redux/Types'
import FullButton from '../Components/FullButton'
import BackArrow from '../Components/BackArrow'
// Styles
import styles from './Styles/SignupScreenStyle'
import { Images } from '../Themes'
import Utilities from '../Services/Utilities'

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
      error: 'Insert a valid email'
    },
    password: {
     secureTextEntry: true,
     error: 'Please enter your password'
   }
 }
};
class SignupScreen extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state ={
  //     user: null,
  //     fetching: null,
  //     error: null,
  //     username: null,
  //     password: null,
  //     falseSwitchIsOn: false,
  //     switchText: <Text>Use Phone</Text>
  //   }
  // }
  componentWillMount () {
    let self = this
    this.props.checkLoggedIn()
  }
  componentDidMount() {
    if (this.props.user.loggedIn){
      this.props.navigation.navigate('AuthenticatedLaunchScreen')
    }
  }
  userSignIn () {
    var value = this.refs.form.getValue();
    
    
    if (value){
    this.setState({fetching:true})
    const username = value.email.toString().toLowerCase();
    const pass = value.password.toString();
    const urlString = Utilities.baseUrl + `users/session?password=${pass}&email=${username}`
      fetch( urlString, {
        method: 'POST'
      }).then(async(response) => {
        response.json().then(async (data) => {
          this.setState({fetching:false})
          if (data.status === 500) {
            window.alert('Wrong Credentials, try again')
            return;
          }
          AsyncStorage.multiSet([['@MySuperStore:userID', data._id], ['@MySuperStore:sideVotes', JSON.stringify(data.sideVotes)],['@MySuperStore:matches', JSON.stringify(data.friends)], ['@MySuperStore:name', data.name]]).then(()=>{
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
     if (this.props.user.fetching) {
      return (
        <View style={styles.mainContainer}>
        <View style={styles.content}>
        <ActivityIndicator />
        </View>
        </View>
        );
    }
    if (this.props.user.falseSwitchIsOn){
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
    <ScrollView contentContainerStyle={styles.mainScroll}>
    <View style={styles.container}>
    <View style={styles.centered}>
    <Image source={Images.logo} style={styles.logo} />
    </View>
    <View style={styles.switchContainer}>
    <Switch
    onValueChange={(value) => this.setState({falseSwitchIsOn: value, switchText: !value? <Text>Use Email</Text>:<Text>Use Phone</Text>})}
    style={{marginBottom: 30}}
    value={this.props.user.emailSwitchIsOn}>
    </Switch>
    </View>
    <View  style={styles.formContainer}>
    <View>
    {loginForm}
    <FullButton text="Sign In" onPress={this.submit.bind(this)}/>
    </View>
    </View>
    </View>
    </ScrollView>
    )
 }
}

const mapStateToProps = (state) => {
  return {
    user: state.user    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkLoggedIn: () => dispatch(UserActions.checkLoggedIn())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen)
