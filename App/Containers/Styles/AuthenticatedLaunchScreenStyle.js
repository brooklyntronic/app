import { StyleSheet } from 'react-native'
import { Metrics, Colors, Fonts, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingTop: Metrics.section,
    backgroundColor: Colors.brand

  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1
  },
  centered: {
    alignItems: 'center'
  },
  // topLeftButton: {
  //   borderColor: Colors.border,
  //   borderTopWidth: 1,
  //   borderRightWidth: 1,
  //   borderBottomWidth: 1
  // },
  // topRightButton: {
  //   borderColor: Colors.border,
  //   borderRightWidth: 1,
  //   borderTopWidth: 1,
  //   borderBottomWidth: 1
  // },
  // middleLeftButton: {
  //   borderColor: Colors.border,
  //   borderBottomWidth: 1
  // },
  // middleRightButton: {
  //   borderColor: Colors.border,
  //   borderLeftWidth: 1,
  //   borderBottomWidth: 1
  // },
  // bottomLeftButton: {
  //   borderColor: Colors.border,
  //   borderLeftWidth: 1
  // },
  // bottomRightButton: {
  //   borderColor: Colors.border,
  //   borderLeftWidth: 1,
  // },
  sectionText: {
    textAlign: 'center',
    fontFamily: Fonts.base,
    fontSize: 14,
    marginHorizontal: Metrics.baseMargin,
    lineHeight: 30,
    marginVertical: Metrics.doubleBaseMargin,
    color: Colors.text
  },
  signout:{
    marginVertical: 10,
    backgroundColor: Colors.snow,
          paddingHorizontal: 5,
          zIndex: 10
  },
  signoutText: {
    fontWeight: 'bold',
    color: Colors.brand
  }
})
