import * as actionType from './actionType';

export const chooseBranch = (branchID) => {
  return {
    type: actionType.CHOOSE_BRANCH,
    payload: branchID,
  };
};
