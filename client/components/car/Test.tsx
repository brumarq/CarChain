import { SetStateAction, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Test() {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");


  const read = async () => {
    //const value = await contract.methods.read().call({ from: accounts[0] });
    console.log(contract);
    
  };

  return (
    <div className="btns">

      <button onClick={read}>
        read()
      </button>

    </div>
  );
}

export default Test;