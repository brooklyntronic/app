import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles, Fonts  } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'flex-start',
        paddingTop: 100
    },
    container: {
    paddingBottom: Metrics.baseMargin
  },
  centered: {
    alignItems: 'center',
  },
  padding: {
    padding: 20
  }, 
  heading: {
  	...Fonts.style.h4,
  	marginBottom: 20
  },
  socialContainer:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
  },
button:{
  	height: 75,
  	width: 75
  }
})
