import Image from "next/image";
import { Inter } from "@next/font/google";
import useEth from "@/contexts/EthContext/useEth";
import { useEffect } from "react";


export default function Home() {
  const result = useEth();

  const getAllCars = async ()=> {
    console.log(result.state);
    
   /*  const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value); */
  }

  useEffect(() => {
    getAllCars()
  })
  
  return (
    <main>
      <span>Test123</span>
    </main>
  );
}
