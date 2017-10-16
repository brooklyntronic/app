import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  content:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
    },
  centered: {
    alignItems: 'center'
  },
  logoHolder: {
    backgroundColor: Colors.snow,
    padding: 20,
    marginTop: 20
  },
  padding: {
    padding: 20
  }
})
