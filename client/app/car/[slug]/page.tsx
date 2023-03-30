"use client";

import { Toaster } from "@/components/ui/toaster";
import { useEth } from "@/contexts/EthContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Car {
  carId: number;
  licensePlate: string;
  chassisNumber: string;
  brand: string;
  carType: string;
  color: string;
  mileage: number;
  owner: string;
  price: number;
  isForSale: boolean;
  picture: string[];
}

interface MileageHistory {
  mileage: number;
  changer: string;
  timestamp: number;
}

export default function Car({ params }: { params: { slug: string } }) {
  const { toast } = useToast();
  const result: any = useEth();
  const { contract, accounts, web3 } = result.state;
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState<Car>();
  const [mileageHistory, setMileageHistory] = useState<MileageHistory[]>();
  const [edit, setEdit] = useState(false);
  const [ownerBool, setOwnerBool] = useState(false);
  const [selectedMiles, setSelectedMiles] = useState<string>();
  const [selectedOnSale, setSelectedOnSale] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<string>();
  const [carFound, setCarFound] = useState<boolean>(true);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const getCar = async () => {
    if (contract) {
      let carNotFound = false;
      
      const value = await contract.methods
        .getCarData(params.slug)
        .call({ from: accounts[0] })
        .catch(() => {
          toast({
            title: "Access denied",
          });
          setLoading(false);
          setCarFound(false);
          carNotFound = true
          return;
        });

      if (!carNotFound) {
        const history = await contract.methods
          .getMileageHistory(params.slug)
          .call({ from: accounts[0] });

        setCar({
          carId: value.carId,
          licensePlate: value.licensePlate,
          chassisNumber: value.chassisNumber,
          brand: value.brand,
          carType: value.carType,
          color: value.color,
          mileage: value.mileage,
          owner: value.owner,
          price: web3.utils.fromWei(value.price, "ether"),
          isForSale: value.isForSale,
          picture: value.picture,
        });

        setSelectedMiles(value.mileage);
        setSelectedPrice(web3.utils.fromWei(value.price, "ether"));
        setSelectedOnSale(value.isForSale);
        setMileageHistory(history);

        if (accounts[0] == value.owner) {
          setOwnerBool(true);
        }
        setCarFound(true);
        setLoading(false);
      }
    }
  };

  const purchaseCar = async () => {
    const paymentAmount = web3.utils.toWei(car?.price.toString(), "ether");

    contract.methods
      .buyCar(car?.carId)
      .send({ value: paymentAmount, from: accounts[0], to: car?.owner })
      .on("receipt", (receipt: any) => {
        toast({
          title: "Car has been purchased!",
          description: "You can find the car in your catalogue!",
        });
      })
      .catch((error: any) => {
        toast({
          title: "Transaction rejected!",
          description:
            "This transaction has been rejected, no action took place.",
        });
      });
  };

  const updateCar = async () => {
    const paymentAmount = web3.utils.toWei(selectedPrice, "ether");

    contract.methods
      .updateCar(selectedMiles, paymentAmount, selectedOnSale, car?.carId)
      .send({ from: accounts[0] })
      .on("receipt", (receipt: any) => {
        toast({
          title: "Your car has been updated.",
          description: "You should see the new values on screen.",
        });

        setEdit(false);
        getCar();
      })
      .on("error", (error: any) => {
        toast({
          title: "Something went wrong with the update",
          description:
            "Nothing has changed, something went wrong with the update.",
        });
      });
  };

  useEffect(() => {
    if (loading) {
      getCar();
    }
  });

  return (
    <div className="dark:bg-slate-900 h-full">
      <Toaster></Toaster>
      <main>
        <div className="py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight ">
            Car information
          </h1>

          <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Product */}
            {!carFound ? (
              <Button className="mb-5 p-0 ">
                <Link className="p-5" href={"/"}>
                  {"< Back"}
                </Link>
              </Button>
            ) : (
              <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
                {/* Product image */}

                <div className="lg:col-span-4 lg:row-end-1">
                  <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg text-left">
                    <Button className="mb-5 p-0 ">
                      <Link className="p-5" href={"/"}>
                        {"< Back"}
                      </Link>
                    </Button>
                    <Tab.Group as="div" className="flex flex-col-reverse">
                      {/* Image selector */}
                      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                        <Tab.List className="grid grid-cols-4 gap-6 p-2">
                          {car?.picture.map((image) => (
                            <Tab
                              key={"carSelector-" + image}
                              className="relative flex h-24 cursor-pointer items-center justify-center rounded-md text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                            >
                              {({ selected }: any) => (
                                <>
                                  <span className="absolute inset-0 overflow-hidden rounded-md">
                                    <Image
                                      src={`https://ipfs.io/ipfs/${image}`}
                                      alt={"Image of a car"}
                                      className="h-full w-full object-cover object-center"
                                      height={1000}
                                      width={1000}
                                    />
                                  </span>
                                  <span
                                    className={classNames(
                                      selected
                                        ? "ring-indigo-500"
                                        : "ring-transparent",
                                      "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                                    )}
                                    aria-hidden="true"
                                  />
                                </>
                              )}
                            </Tab>
                          ))}
                        </Tab.List>
                      </div>

                      <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
                        {car?.picture.map((image) => (
                          <Tab.Panel key={"selectedImage-" + image}>
                            <Image
                              src={`https://ipfs.io/ipfs/${image}`}
                              alt={"Image of a car"}
                              className="h-96 w-full object-cover object-center sm:rounded-lg"
                              height={1000}
                              width={1000}
                            />
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>

                {/* Product details */}
                <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
                  <div className="flex flex-col-reverse">
                    <div className="mt-4">
                      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {car?.brand} {car?.carType}
                      </h1>
                      <div className="prose prose-sm mt-4 text-gray-300 text-start">
                        <ul role="list">
                          <li>
                            <strong>License plate:</strong> {car?.licensePlate}
                          </li>
                          <li>
                            <strong>Chassis number:</strong>{" "}
                            {car?.chassisNumber}
                          </li>
                          <li>
                            <strong>Color:</strong> {car?.color}
                          </li>
                          <li>
                            <strong>Owner:</strong> {car?.owner}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <hr className="my-6 text-gray-400" />
                  <div className="flex flex-col-reverse">
                    <div className="prose prose-sm text-gray-300 text-start">
                      <ul role="list">
                        <li>
                          <div className="flex w-full max-w-sm items-center space-x-2">
                            <strong>Miles: </strong>
                            {!edit ? (
                              <span>{car?.mileage} miles</span>
                            ) : (
                              <Input
                                type="text"
                                value={selectedMiles}
                                onChange={(e) =>
                                  setSelectedMiles(e.target.value)
                                }
                                className="w-full"
                              />
                            )}
                          </div>
                        </li>
                        <li>
                          {edit && (
                            <div className="flex items-center mt-5 space-x-2">
                              <Checkbox
                                id="terms"
                                defaultChecked={selectedOnSale}
                                onCheckedChange={(e: any) =>
                                  setSelectedOnSale(!selectedOnSale)
                                }
                              />
                              <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                On sale
                              </label>
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <hr className="my-6 text-gray-400" />
                  <div>
                    <h1 className="text-xl font-bold sm:text-xl text-start">
                      Miles change history
                    </h1>
                    <ul role="list" className="divide-y divide-gray-200">
                      {mileageHistory?.map((mileageChange, index) => (
                        <li key={index} className="py-4">
                          <div className="flex space-x-3">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium ">
                                  {new Date(
                                    mileageChange.timestamp * 1000
                                  ).toLocaleDateString("nl-NL", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </h3>
                                <p className="text-xs text-gray-400">
                                  {mileageChange.changer}
                                </p>
                              </div>
                              <p className="text-sm text-gray-400 text-start">
                                Set mileage to {mileageChange.mileage}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 grid gap-x-6 gap-y-4">
                    {!edit ? (
                      <>
                        <button
                          type="button"
                          className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-gray-50"
                          onClick={() => {
                            purchaseCar();
                          }}
                        >
                          Pay {car?.price} ETH
                        </button>
                        {ownerBool && (
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-500 py-3 px-8 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-gray-50"
                            onClick={() => {
                              setEdit(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                          <strong>Price: </strong>
                          <Input
                            type="text"
                            value={selectedPrice}
                            onChange={(e) => setSelectedPrice(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-600 py-3 px-8 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            onClick={() => {
                              setEdit(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-700 py-3 px-8 text-base font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            onClick={() => {
                              updateCar();
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
