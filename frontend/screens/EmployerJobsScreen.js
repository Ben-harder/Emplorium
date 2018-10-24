import React from 'react';
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
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { WebBrowser } from 'expo';
import axios from 'axios';
import api from "../constants/Url";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/';


class EmployerJobsScreen extends React.Component
{
    _isMounted = false;

    static navigationOptions = {
        header: null,
    };

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

    tryFetchJobList()
    {
        // console.log("trying to fetch jobs...");
        axios.get(`${api}/get-employer-jobs`, {
            params: {
                employer: this.props.user.data.ID,
            }
        }).then((response) =>
        {
            // console.log(response.data);
            if (this._isMounted)
                this.setState({ jobList: response.data });
        }).catch((err) =>
        {
            console.log(err);
        });
    }

    goToJobDetails(job)
    {
        this.props.navigation.navigate('Job', {
            jobType: job.jobType,
            address: job.address,
            author: job.author,
            wage: job.wage,
            description: job.description,
            jobID: job.jobID,
        });
    }

    render()
    {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <Text style={styles.headerText}>Your Posted Jobs</Text>

                    <FlatList
                        style={styles.jobList}
                        data={this.state.jobList}
                        renderItem={({ item }) => (
                            <View style={styles.jobItem}>
                                <Text>Job type: {item.job_title}</Text>
                                <Text>Posted by: {item.author}</Text>
                                <Text>Address: {item.address}</Text>
                                <Text>Wage: ${item.wage}</Text>
                                <Text>Description: {item.description}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </ScrollView>
            </View>
        );
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 30,
    },
    headerText: {
        fontSize: 24,
        textAlign: 'center',
    },
    jobList: {
        width: "100%",
        padding: 10,
        flex: 1,
    },
    jobItem: {
        marginTop: 10,
        backgroundColor: "rgba(0,0,0,0.05)",
        padding: 30,
    },
    tabBarInfoContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: -3 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 20,
            },
        }),
        alignItems: 'center',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
    },
});

function mapStateToProps(state) {
	const props = {
		user: state.user,
	};
	return props;
}

function mapDispatchToProps(dispatch) {
	return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployerJobsScreen);