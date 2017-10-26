import React, { PropTypes } from 'react'
import { TouchableOpacity, Text, Image} from 'react-native'
import styles from './Styles/ButtonBoxStyle'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomIcon from '../Themes/CustomIcons'
export default class ButtonBox extends React.Component {
  static propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    text: PropTypes.string,
    customIcon: PropTypes.string,
    icon: PropTypes.string,
    iconSize: PropTypes.number
  }

  render () {
    return (
      <TouchableOpacity style={[styles.container, this.props.style]} onPress={this.props.onPress}>
        {this.props.image ? <Image resizeMode='contain' source={this.props.image} style={styles.image} />:null}
        {this.props.icon ? <Icon name={this.props.icon}  style={styles.icon} size={this.props.iconSize}/>:null}
        {this.props.customIcon?<CustomIcon name={this.props.customIcon} style={styles.icon} size={this.props.iconSize}/>:null}
        <Text style={styles.label}>{this.props.text.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }
}
