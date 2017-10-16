import React, { Component } from 'react'
import { ScrollView, Text, View, Image, TextInput } from 'react-native'
import { connect } from 'react-redux'
import BackArrow from '../Components/BackArrow'
import PageHeader from '../Components/PageHeader'
import { Images } from '../Themes/'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MatchupCreateScreenStyle'

class MatchupCreateScreen extends Component {
  // constructor (props) {
  //   super(props)
  //   this.state = {}
  // }

  render () {
    return (
      <ScrollView style={styles.mainScroll}>
        <View style={styles.container}>
          <BackArrow onPress={() => this.props.navigation.navigate('MatchupListScreen')}/>
          <PageHeader text='Create Matchup'/>
          
          <View  style={styles.formContainer}>
          <TextInput
          style={{height: 40}}
          placeholder="Title"
          onChangeText={(text) => this.setState({text})}
        />
          <Text>MatchupCreateScreen Container</Text>
          </View>
          <View style={styles.mainContainer}>
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchupCreateScreen)
