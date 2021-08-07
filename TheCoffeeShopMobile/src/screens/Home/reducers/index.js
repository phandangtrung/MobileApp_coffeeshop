import * as actionType from '../actions/actionType';

const initialState = {
  branchID: '',
};

const branchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CHOOSE_BRANCH:
      console.log('>>branch _id', action.payload);
      return {branchID: action.payload};

    default:
      return state;
  }
};

export default branchReducer;
