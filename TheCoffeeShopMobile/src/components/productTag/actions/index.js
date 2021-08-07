import * as actionType from './actionType';

export const buyProduct = (product) => {
  return {
    type: actionType.BUY_PRODUCT,
    payload: product,
  };
};

export const deleteProduct = (product) => {
  return {
    type: actionType.DELETE_PRODUCT,
    payload: product,
  };
};
export const increaseProduct = (product) => {
  return {
    type: actionType.INCREASE_PRODUCT,
    payload: product,
  };
};
export const decreaseProduct = (product) => {
  return {
    type: actionType.DECREASE_PRODUCT,
    payload: product,
  };
};
export const delallProduct = () => {
  return {
    type: actionType.DELALL_PRODUCT,
  };
};
