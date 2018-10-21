import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage,
  TouchableOpacity,
  Text
} from 'react-native';
import PhoneInput from "react-native-phone-input";
import api from "../constants/Url";
import axios from 'axios';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: "",
      type: "",
      value: ""
    };

    this.updateInfo = this.updateInfo.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
    this.attemptSignup = this.attemptSignup.bind(this);
  }

  updateInfo() {
    this.setState({
      valid: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      value: this.phone.getValue()
    });
  }

  renderInfo() {
    if (this.state.value) {
      return (
        <View style={styles.info}>
          <Text>
            Is Valid:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {this.state.valid.toString()}
            </Text>
          </Text>
          <Text>
            Type: <Text style={{ fontWeight: "bold" }}>{this.state.type}</Text>
          </Text>
          <Text>
            Value:{" "}
            <Text style={{ fontWeight: "bold" }}>{this.state.value}</Text>
          </Text>
        </View>
      );
    }
  }

  attemptSignup() {
    if (this.phone.isValidNumber()) {
      console.log(this.phone.getValue());
      console.log(api);
      axios.get(`${api}/test`);
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text>Enter your phone number:</Text>
        <PhoneInput
            ref={ref => {
              this.phone = ref;
            }}
            initialCountry='ca'
          />
        <TouchableOpacity onPress={this.attemptSignup} style={styles.textLink}>
          <Text style={styles.textLinkText}>Sign Up</Text>
        </TouchableOpacity>
        <Text>or</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')} style={styles.textLink}>
          <Text style={styles.textLinkText}>Click Here to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  textLink: {
    paddingVertical: 15,
  },
  textLinkText: {
    fontSize: 18,
    color: '#2e78b7',
  },
});

export default SignUpScreen;