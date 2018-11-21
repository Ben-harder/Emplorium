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
import { WebBrowser } from "expo";
import axios from "axios";
import api from "../constants/Url";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

import { MonoText } from "../components/StyledText";

var s = require('../constants/style');

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
                <FlatList
                    style={s.jobList}
                    data={this.state.jobList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={s.jobItem} onPress={() => this.goToJobDetails(item)}>
                            <Text style={s.jobText}><Text style={{fontWeight: 'bold'}}>Job type: </Text><Text>{item.job_title}</Text></Text>
                            <Text style={s.jobText}><Text style={{fontWeight: 'bold'}}>Posted by: </Text><Text>{item.employer.first_name} {item.employer.last_name}</Text></Text>
                            <Text style={s.jobText}><Text style={{fontWeight: 'bold'}}>Address: </Text><Text>{item.address}</Text></Text>
                            <Text style={s.jobText}><Text style={{fontWeight: 'bold'}}>Wage: </Text><Text>${item.wage}</Text></Text>
                            <Text style={s.jobText}><Text style={{fontWeight: 'bold'}}>Description: </Text><Text>{item.description}</Text></Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }

}