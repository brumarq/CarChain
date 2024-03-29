"use client";

import useEth from "@/contexts/EthContext/useEth";
import Image from "next/image";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const result: any = useEth();
  const { contract, accounts, web3 } = result.state;
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);

  const getAllCars = async () => {
    if (contract) {
      const value = await contract.methods
        .getCarsForSale()
        .call({ from: accounts[0] });

      setCars(value);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCars();
  });

  return (
    <>
      <div className="dark:bg-slate-900 min-h-screen">
        <main>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="py-24 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Car Chain</h1>
              <p className="mx-auto mt-4 max-w-3xl text-base">
                Buy your car securely.
              </p>
            </div>

            {/* Product grid */}
            <section aria-labelledby="products-heading" className="mt-8 h-full">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>
              <Button className="mb-5 p-0">
                <Link className="p-5" href={"/addCar"} prefetch={false}>
                  + Add Car
                </Link>
              </Button>
              <Button className="mb-5 p-0 float-right">
                <Link className="p-5" href={"/myCars"} prefetch={false}>
                  My Cars
                </Link>
              </Button>
              {!loading ? (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {cars.map((car: any) => (
                    <Link
                      className="p-5 group"
                      key={"carOnSale-" + car.carId}
                      href={`/car/${car.carId}`}
                    >
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                        <Image
                          src={`https://ipfs.io/ipfs/${car.picture[0]}`}
                          alt="Picture of the author"
                          className="h-80 w-full object-cover object-center group-hover:opacity-75"
                          width={1000}
                          height={1000}
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-base font-medium">
                        <h3>
                          {car.brand} {car.carType}
                        </h3>
                        <p>{web3.utils.fromWei(car.price, "ether")} ETH</p>
                      </div>
                      <p className="mt-1 text-sm italic text-gray-500">
                        {car.color} - {car.mileage} miles
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-300 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
