import React from "react";
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage,
  TouchableOpacity,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  ImageBackground,
  Image,
} from "react-native";
import PhoneInput from "react-native-phone-input";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import api from "../constants/Url";
import axios from "axios";
import phoneNumber from "react-native-phone-input/lib/phoneNumber";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import styles from '../constants/KeyboardStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const logo = require('../assets/images/emplorium-light.gif');

// components
import Loading from "../components/Loading";

// actions
import * as actions from "../actions/";

var s = require('../constants/style');

class SignInScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      loading: false
    };

    this.attemptSignIn = this
      .attemptSignIn
      .bind(this);
  }

  attemptSignIn() {
    const phoneNumber = this.phone.getValue();
    
    if (phoneNumber && this.state.password) {
      this.setState({ loading: true });
      axios.get(`${api}/auth/sign-in`, {
        params: {
          phoneNumber: phoneNumber,
          password: this.state.password
        }
      }).then(async(res) => {
        this.setState({ loading: false });
          await AsyncStorage.setItem("userToken", "abc");
          this.props.actions.userData(res.data);
          this.props.navigation.navigate("App");
        }).catch((err) => {
          this.setState({ loading: false });
          console.log(err);
          alert(err.response.data.errorMessage);
        });
    } else {
      alert("Please fill all the fields");
    }
  }

  render() {
    if (this.state.loading) return <Loading />;

    return (
      // <KeyboardAvoidingView keyboardVerticalOffset={100} style={styles.container} behavior="padding">
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#E1E2E1' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[s.container]}>
            <Image source={logo} style={s.logo} resizeMode={'contain'}/>
            <View style={s.authContainer}>
              <View>
                <Text
                  style={[
                  s.regTextBold, {
                    marginTop: 15,
                    marginBottom: 5
                  }
                ]}>Enter your phone number to sign in:</Text>
                <PhoneInput
                  style={{
                  backgroundColor: '#F5F5F6',
                  padding: 20,
                  borderRadius: 10,
                  marginVertical: 5
                }}
                  ref={ref => {
                  this.phone = ref;
                }}
                  initialCountry="ca"/>
              </View>
              <View>
                <Text
                  style={[
                  s.regTextBold, {
                    marginTop: 15,
                    marginBottom: 5
                  }
                ]}>Enter your password:</Text>
                <TextInput
                  style={s.textInput}
                  onChangeText={(text) => this.setState({password: text})}
                  value={this.state.password}
                  secureTextEntry={true}
                  underlineColorAndroid='transparent'
                  returnKeyType='done'/>
              </View>

              <TouchableOpacity
                onPress={this.attemptSignIn}
                style={[
                s.textLink, {
                  paddingTop: 40
                }
              ]}>
                <Text style={s.textLinkText}>Sign In</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("SignUp")}>
                <Text style={[s.textLinkTextAlt, {marginBottom:60}
                ]}>Or click Here to Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    );
  }
}

function mapStateToProps(state) {
  const props = {
    user: state.user
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);
