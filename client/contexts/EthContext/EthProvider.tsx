"use client"

import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

/**
 * EthProvider is a React component that wraps around the application and provides access to
 * the Ethereum network and its contracts via the EthContext.
 * @param children - The child components of the EthProvider.
 */

function EthProvider({ children }: { children: React.ReactElement }) {
  // Handle changes to the global state of the application
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * init is a function that initializes the web3 provider and contract instances for the
   * current network.
   */
  const init = useCallback(async (artifact: { networks?: any; abi?: any }) => {
    if (artifact) {
      const web3 = new Web3(Web3.givenProvider || "localhost:8545");
      
      // Request accounts from the user's wallet and retrieve the ID of the current network.
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = artifact;
      let address, contract;
      try {
        // Get the address of the contract on the current network, and create a new contract instance
        // using the address and the ABI of the contract.
        address = artifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
      } catch (err) {
        console.error(err);
      }
      
      // Dispatch an action to update the context state with the Ethereum information.
      dispatch({
        type: actions.init,
        data: { artifact, web3, accounts, networkID, contract },
      });
    }
  }, []);

  // Use the `useEffect` hook to initialize the Ethereum environment when the component mounts.
  useEffect(() => {
    const tryInit = async () => {
      try {
        // Load the contract artifact from the file system and initialize the Ethereum environment.
        const artifact = require("./../../../build/contracts/CarSale.json");
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  // Use the `useEffect` hook to update the Ethereum environment when the network or user account changes.
  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    // Register event listeners for the Ethereum events, and remove them when the component unmounts.
    events.forEach((e) => (window as any).ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => (window as any).ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
