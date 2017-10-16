import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  container: {
    width: Metrics.screenWidth / 2,
    aspectRatio: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.snow
  },
  image: {
    width: Metrics.icons.xl,
    height: Metrics.icons.xl,
    margin: Metrics.baseMargin
  },
  icon : {
    width: Metrics.icons.xl,
    height: Metrics.icons.xl,
    margin: Metrics.baseMargin,
    color: Colors.brand
  },
  label: {
    ...Fonts.style.h4,
    fontSize: 14,
    color: Colors.brand,
    fontWeight: 'bold'
  }
})
