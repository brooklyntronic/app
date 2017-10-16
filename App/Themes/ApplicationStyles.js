import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'
import { Dimensions } from 'react-native'
// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.snow,
      paddingBottom: Metrics.doubleBaseMargin,
      justifyContent:'center',
        alignItems: 'center'
    },
    fullImage: {
      width: Metrics.screenWidth * .8,
      height: Metrics.screenWidth * .8,
      borderRadius: 7
    },
    mapImage: {
      width: Metrics.screenWidth * .8,
      height: Metrics.screenWidth * .8,
      borderRadius: 7,
      marginVertical: Metrics.baseMargin,
      position: 'absolute'
    },
    sliderWrapper: {
      height: Metrics.screenWidth * .8 + 40
    },
    matchupSliderWrapper: {
      height: Metrics.screenWidth * .8 + 70
    },
    mainScroll: {
      backgroundColor: Colors.snow,
      flexGrow: 1
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
      container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  overlayImage: {
    width: Metrics.screenWidth * .8,
      height: Metrics.screenWidth * .8,
      borderRadius: 7,
    alignItems:'center',justifyContent:'flex-end', marginBottom: 20, borderRadius: 10
  },
   overlayText: {
    color: '#fff',
    fontSize: Fonts.size.h5,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  formContainer: {
    padding: 20
  },
    content:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems: 'center'
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
    },
    inputHolder: {
     borderBottomWidth: 1,
     marginBottom: Metrics.doubleBaseMargin,
     width: Metrics.screenWidth * .8
   },
   heading: {
    ...Fonts.style.h5,
    color: Colors.brand,
    marginBottom: Metrics.doubleBaseMargin,
    fontWeight: 'bold'
  },
   logoHeading: {
    ...Fonts.style.h5,
    color: Colors.brand,
    marginTop: 50
  },
    smallLogo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.medium,
    width: Metrics.images.medium,
    resizeMode: 'contain'
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  logoContainer: {flexDirection:'row',justifyContent: 'center', alignItems: 'center', marginBottom: 10},
  sectionText: {
    ...Fonts.style.normal,
    paddingVertical: Metrics.doubleBaseMargin,
    color: Colors.snow,
    marginVertical: Metrics.smallMargin,
    textAlign: 'center'
  },
  subtitle: {
    color: Colors.brand,
    padding: Metrics.smallMargin,
    marginBottom: Metrics.smallMargin,
    marginHorizontal: Metrics.smallMargin
  },
  pageHeading: {
    fontWeight: 'bold',
    margin: Metrics.baseMargin

  },
  title: {
    ...Fonts.style.h5,
    marginBottom: Metrics.baseMargin,
    textAlign: 'center'
  },
  titleText: {
    ...Fonts.style.h5,
    color: Colors.brand
  },
  centered: {
    alignItems: 'center',
  },
   overlay:{
  paddingVertical: 20,
  width: Metrics.screenWidth * .8,
  borderRadius: 5,
    backgroundColor: '#000',
    opacity: .7
  },
  padding: {
    padding: Metrics.doubleBaseMargin
  }
},
darkLabelContainer: {
  padding: Metrics.smallMargin,
  paddingBottom: Metrics.doubleBaseMargin,
  borderBottomColor: Colors.border,
  borderBottomWidth: 1,
  marginBottom: Metrics.baseMargin
},
darkLabel: {
  fontFamily: Fonts.type.bold,
  color: Colors.snow
},
groupContainer: {
  margin: Metrics.smallMargin,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center'
},
sectionTitle: {
  ...Fonts.style.h4,
  color: Colors.coal,
  backgroundColor: Colors.ricePaper,
  padding: Metrics.smallMargin,
  marginTop: Metrics.smallMargin,
  marginHorizontal: Metrics.baseMargin,
  borderWidth: 1,
  borderColor: Colors.ember,
  alignItems: 'center',
  textAlign: 'center'
}
}

export default ApplicationStyles
