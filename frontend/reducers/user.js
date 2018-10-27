import * as types from "../actions/types";

const initialState = { data: {} };

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case types.USER_DATA:
		const newState = Object.assign({}, state);
		// aliases should be phansed out ASAP
		if (action.payload._id) newState.data.ID = action.payload._id;
		if (action.payload.first_name) newState.data.firstName = action.payload.first_name;
		if (action.payload.last_name) newState.data.lastName = action.payload.last_name;
		if (action.payload.phone_number) newState.data.phoneNumber = action.payload.phone_number;
		if (action.payload.is_employer) newState.data.isEmployer = action.payload.is_employer;
		if (action.payload.is_verified) newState.data.isVerified = action.payload.is_verified;
		if (action.payload.is_working) newState.data.isWorking = action.payload.is_working;
    return newState;
    
	case types.CLEAR_USER_DATA:
    return initialState;

	default:
		return state;
	}
};

export default reducer;
