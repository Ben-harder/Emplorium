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
    ImageBackground,
} from "react-native";
import { StackNavigator } from "react-navigation";
import { WebBrowser } from "expo";
import { connect } from "react-redux";
import axios from "axios";
import api from "../constants/Url";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

import { MonoText } from "../components/StyledText";

const s = require('../constants/style');

class JobScreen extends React.Component
{
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            jobType: "",
            author: "",
            description: "",
            wage: 0,
            address: "",
            jobID: ""
        }
    }

    componentDidMount() {
        const { user, navigation } = this.props;

        this.setState({
            jobType: navigation.getParam("jobType", "NO JOB TYPE"),
            author: navigation.getParam("author", "NO AUTHOR"),
            description: navigation.getParam("description", "NO DESCRIPTION"),
            wage: navigation.getParam("wage", "NO WAGE"),
            address: navigation.getParam("address", "NO ADDRESS"),
            jobID: navigation.getParam("jobID", "NO JOBID")
        });
        console.log(user);
        axios.post(`${api}/user/update-job-preference`, {
            jobPrefID: user.data.jobPref,
            jobType: navigation.getParam("jobType", "NO JOB TYPE")
        }).catch((err) => {
            console.log(err);
            alert(err.response.data.errorMessage);
        });
    }

    render()
    {
        return (
            <View style={s.container}>
                <ImageBackground source={require('../assets/images/min_art1.png')} style={{width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}  resizeMode='cover'> 
                    <View style={[s.contentContainer,]}>
                        <Text style={s.headerText}>Take This Job?</Text>
                        <View style={s.jobItem}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                <Text style={s.jobTypeText}>{this.state.jobType}</Text>
                                <Text style={[{fontSize: Font.titleSize,}]}>${this.state.wage}</Text>
                            </View>
                            <Text style={s.addressText}>at {this.state.address}</Text>
                            <Text style={{fontSize: Font.smallSize}}>
                                    <Text style={{fontWeight: 'bold'}}>Posted by: </Text><Text>{this.state.author}</Text>
                            </Text>
                            <View>
                                <Text style={[s.jobText, {fontWeight: 'bold', marginTop: 30}]}>Description: </Text>
                                <View style={s.jobDescription}>
                                    <Text>{this.state.description}</Text>
                                </View>                     
                            </View>                    
                        </View>

                        <TouchableOpacity onPress={() => this.applyForJob()} style={s.textLink}>
                            <Text style={s.textLinkText}>Apply for this job</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Main")} style={s.textLink}>
                            <Text style={s.textLinkTextBack}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        );
    }

}

function mapStateToProps(state) {
	const props = {
		user: state.user,
	};
	return props;
}

export default connect(mapStateToProps)(JobScreen);