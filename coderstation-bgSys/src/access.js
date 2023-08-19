export default (initialState) => {
  if (initialState) {
    return {
      SuperAdmin: initialState.adminInfo.permission === 1,
      NormalAdmin:
        initialState.adminInfo.permission === 1 ||
        initialState.adminInfo.permission === 2,
    };
  } else {
    return {
      SuperAdmin: false,
      NormalAdmin: false,
    };
  }
};
