import React from "react";
import
{
    Text,
    TouchableOpacity,
    View,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from "react-native";
import { connect } from "react-redux";
import PhoneInput from "react-native-phone-input";
import api from "../constants/Url";
import axios from "axios";

// styles
const s = require('../constants/style');

class EditProfile extends React.Component
{
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: ""
    };

    this.save = this.save.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;

    this.setState({
      firstName: user.data.firstName,
      lastName: user.data.lastName
    });
  }

  save() {
    const { user } = this.props;

    if (!this.state.firstName || !this.state.lastName || !this.phone.getValue()) {
      alert("Please leave no fields blank!");
    }

    if (this.phone.isValidNumber()) {
      axios.post(`${api}/user/change-info`, {
        userID: user.data.ID,
        phoneNumber: this.phone.getValue(),
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }).then((res) => {
        alert("Successfully updated your info!");
        this.props.navigation.navigate("ProfileDetails");
      }).catch((err) => {
        console.log(err);
        alert(err.response.data.errorMessage);
      });
    } else {
      alert("Please enter a valid phone number!");
    }
  }

  render() {
    const { user, navigation } = this.props;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={s.container}>
          <View style={s.contentContainer}>
            <Text>Phone #:</Text>
            <PhoneInput style={{paddingBottom: 40}}
                ref={ref => {
                  this.phone = ref;
                }}
                initialCountry="ca"
                value={user.data.phoneNumber}
              />
            <Text>First Name:</Text>
            <TextInput
              style={s.textInput}
              onChangeText={(text) => this.setState({firstName: text})}
              value={this.state.firstName}
              returnKeyType='done'
            />
            <Text>Last Name:</Text>
            <TextInput
              style={s.textInput}
              onChangeText={(text) => this.setState({lastName: text})}
              value={this.state.lastName}
              returnKeyType='done'
            />

            <TouchableOpacity onPress={this.save} style={s.textLink}>
              <Text style={s.textLinkText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ProfileDetails")} style={s.textLink}>
              <Text style={s.textLinkText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

function mapStateToProps(state) {
	const props = {
		user: state.user,
	};
	return props;
}

export default connect(mapStateToProps)(EditProfile);