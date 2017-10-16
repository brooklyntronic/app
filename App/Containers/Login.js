import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, Image, View } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import PrimaryNav from '../Navigation/AppNavigation'
import LoginForm from '../Components/LoginForm'
import Icon from 'react-native-vector-icons/FontAwesome';
import SocialLogins from '../Components/SocialLogins'
// Styles
import styles from './Styles/LoginStyle'
import { Images } from '../Themes'
class Login extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => this.props.navigation.goBack(null)} style={{
          position: 'absolute',
          paddingTop: 30,
          paddingHorizontal: 5,
          zIndex: 10
        }}>
          <Icon name="rocket" size={30} color="#900" />
        </TouchableOpacity>
        <View style={styles.container}>
        <View style={styles.content}>
        <View style={styles.padding}>
        <LoginForm/>
        </View>
        <View>
          <View style={styles.container, styles.centered}>
          <Text style={styles.heading}>Login With Social Account</Text>
          </View>
          <SocialLogins/>
        </View>
        </View>
        </View>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
