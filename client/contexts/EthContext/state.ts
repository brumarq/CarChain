const actions = {
    init: "INIT"
  };
  
  const initialState = {
    artifact: null,
    web3: null,
    accounts: null,
    networkID: null,
    contract: null
  };
  
  const reducer = (state: any, action: { type: any; data: any; }) => {
    const { type, data } = action;
    switch (type) {
      case actions.init:
        return { ...state, ...data };
      default:
        throw new Error("Undefined reducer action type");
    }
  };
  
  export { actions, initialState, reducer };