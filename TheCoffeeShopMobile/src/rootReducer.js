import {combineReducers} from 'redux';
import cartReducer from './components/productTag/reducers/index';
import branchReducer from './screens/Home/reducers';
const rootReducer = combineReducers({
  cart: cartReducer,
  branch: branchReducer,
});

export default rootReducer;
