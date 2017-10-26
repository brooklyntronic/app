import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import icoConfig from './selection.json'
const Icon = createIconSetFromIcoMoon(icoConfig);

export default () =>  <Icon name="logo_circle" size={50} color="#bf1313" />;