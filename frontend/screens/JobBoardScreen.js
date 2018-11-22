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
import axios from "axios";
import api from "../constants/Url";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

import { MonoText } from "../components/StyledText";

const s = require('../constants/style');

export default class JobBoardScreen extends React.Component
{
    _isMounted = false;

    constructor(props)
    {
        super(props);
        this.state = {
            jobList: [],
        }

        this.tryFetchJobList = this.tryFetchJobList.bind(this);
    }

    componentDidMount()
    {
        this._isMounted = true;
        this.tryFetchJobList();
        this.jobInterval = setInterval(this.tryFetchJobList, 10000);
    }

    componentWillUnmount()
    {
        this._isMounted = false;
        clearInterval(this.jobInterval);
    }

    tryFetchJobList() {
        // console.log("trying to fetch jobs...");
        axios.get(`${api}/get-all-jobs`).then((response) => {
            // console.log(response.data);
            if (this._isMounted)
                this.setState({jobList: response.data});
        }).catch((err) => {
            console.log(err);
        });
    }

    goToJobDetails(job)
    {
        this.props.navigation.navigate("Job", {
            jobType: job.job_title,
            address: job.address,
            author: `${job.employer.first_name} ${job.employer.last_name}`,
            wage: job.wage,
            description: job.description,
            jobID: job._id
        });
    }

    render()
    {
        return (
            <View style={s.container}>
                <ImageBackground source={require('../assets/images/min_art2.png')} style={{width: '100%', height: '100%',}}  resizeMode='cover'> 
                    <View style={{width: '100%', height: '100%', alignItems: 'center'}}>
                        <FlatList
                            style={s.jobList}
                            data={this.state.jobList}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={s.jobItem} onPress={() => this.goToJobDetails(item)}>
                                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                                        <Text style={[s.jobText, {fontSize: Font.titleSize}]}>{item.job_title}</Text>
                                        <Text style={[{fontSize: Font.titleSize,}]}>${item.wage}</Text>
                                    </View>
                                    <Text style={[s.infoText, {fontStyle: 'normal', color: Colors.sNormAlt, textAlign: 'left', borderBottomWidth: 1, borderBottomColor: Colors.sDark, padding: 10,}]}>at {item.address}</Text>
                                    <Text style={{fontSize: Font.smallSize}}>
                                        <Text><Text style={{fontWeight: 'bold'}}>Posted by: </Text><Text>{item.employer.first_name} {item.employer.last_name}</Text></Text>
                                    </Text>
                        
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        </View>
                </ImageBackground>
            </View>
        );
    }

}