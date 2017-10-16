import React, { PropTypes } from 'react'
import { TouchableOpacity, Text, Image} from 'react-native'
import styles from './Styles/ButtonBoxStyle'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class ButtonBox extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    text: PropTypes.string,
    icon: PropTypes.string,
    iconSize: PropTypes.number
  }

  render () {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.onPress}>
        {this.props.image ? <Image resizeMode='contain' source={this.props.image} style={styles.image} />:
        <Icon name={this.props.icon}  style={styles.icon} size={this.props.iconSize}/>}
        <Text style={styles.label}>{this.props.text.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }
}
