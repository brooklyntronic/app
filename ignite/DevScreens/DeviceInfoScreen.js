// An All Components Screen is a great way to dev and quick-test components
import React from 'react'
import { View, ScrollView, Text, Image, NetInfo, TouchableOpacity } from 'react-native'
import { Metrics, Images } from './DevTheme'
import styles from './Styles/DeviceInfoScreenStyles'

// const HARDWARE_DATA = [
//   {title: 'Device Manufacturer', info: DeviceInfo.getManufacturer()},
//   {title: 'Device Name', info: DeviceInfo.getDeviceName()},
//   {title: 'Device Model', info: DeviceInfo.getModel()},
//   {title: 'Device Unique ID', info: DeviceInfo.getUniqueID()},
//   {title: 'Device Locale', info: DeviceInfo.getDeviceLocale()},
//   {title: 'Device Country', info: DeviceInfo.getDeviceCountry()},
//   {title: 'User Agent', info: DeviceInfo.getUserAgent()},
//   {title: 'Screen Width', info: Metrics.screenWidth},
//   {title: 'Screen Height', info: Metrics.screenHeight}
// ]

// const OS_DATA = [
//   {title: 'Device System Name', info: DeviceInfo.getSystemName()},
//   {title: 'Device ID', info: DeviceInfo.getDeviceId()},
//   {title: 'Device Version', info: DeviceInfo.getSystemVersion()}
// ]

// const APP_DATA = [
//   {title: 'Bundle Id', info: DeviceInfo.getBundleId()},
//   {title: 'Build Number', info: DeviceInfo.getBuildNumber()},
//   {title: 'App Version', info: DeviceInfo.getVersion()},
//   {title: 'App Version (Readable)', info: DeviceInfo.getReadableVersion()}
// ]

export default class DeviceInfoScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isConnected: false,
      connectionInfo: null,
      connectionInfoHistory: []
    }
  }

}
