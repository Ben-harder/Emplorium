import { StyleSheet, Dimensions } from 'react-native';
const window = Dimensions.get('window');
import colors from './Colors';

export const IMAGE_HEIGHT = window.width / 2;
export const IMAGE_HEIGHT_SMALL = window.width /7;

export default StyleSheet.create({
  container: {
    backgroundColor: "#E1E2E1",
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: "#E1E2E1",
    marginHorizontal: 10,
    marginVertical: 5,
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    width: window.width - 30,
  },
  logo: {
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
    marginBottom: 20,
    padding:10,
    marginTop:20
  },
  register:{
    marginBottom:20, 
    width:window.width -100,
    alignItems:'center',
    justifyContent:'center',
    height:50,
    backgroundColor: '#ffae',}
});