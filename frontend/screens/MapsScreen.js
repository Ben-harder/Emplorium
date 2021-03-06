import React from "react";
import
{
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    AsyncStorage,
    FlatList,
} from "react-native";
import { StackNavigator } from "react-navigation";
import { WebBrowser, MapView } from "expo";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import IOSIcon from "react-native-vector-icons/Ionicons";

// components
import Loading from "../components/Loading";

const s = require('../constants/style');

class MapScreen extends React.Component
{
  static navigationOptions = ({ navigation }) => {
      return {
          headerLeft:(
              <TouchableOpacity onPress={() => navigation.navigate(navigation.getParam("source", "Main"))}>
                  <IOSIcon name="ios-arrow-back" size={25} style={{color: Colors.buttonText, paddingLeft: 15,}}/>
              </TouchableOpacity>
          ),
          title: navigation.getParam("address", ""),
          headerTintColor: Colors.buttonText,
      };
  };

  constructor(props)
  {
      super(props);
      this.state = {
          loading: true
      }
  }

  render()
  {
      // if (this.state.loading) return (<Loading />);
      const longitude = this.props.navigation.getParam("longitude", 0);
      const latitude = this.props.navigation.getParam("latitude", 0);

      return (
          <MapView
              style={{ flex: 1 }}
              provider="google"
              region={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                  latitudeDelta: 0.0100,
                  longitudeDelta: 0.0060
              }}
          >
            <MapView.Marker
      
              coordinate={{
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
              }}
              title={this.props.navigation.getParam("address", "")}
              description={this.props.navigation.getParam("description", "")}
            />
          </MapView>
      );
  }
}

export default MapScreen;
