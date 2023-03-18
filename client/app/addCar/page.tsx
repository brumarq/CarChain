"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormik } from "formik";
import { useEth } from "@/contexts/EthContext";
import { useToast } from "@/hooks/useToast"
import { Toaster } from "@/components/ui/toaster";

import { create } from 'ipfs-http-client'


export default function AddCar() {
  const { toast } = useToast()
  const result: any = useEth();
  const { contract, accounts, web3 } = result.state;

  const formik = useFormik({
    initialValues: {
      brand: "",
      type: "",
      color: "",
      licensePlate: "",
      chassisNumber: "",
      mileage: 0,
      price: 0,
      onSale: false,
      image: "",
    },
    onSubmit: async (values) => {
      const client = create({ url: "http://127.0.0.1:5002/api/v0" })
      const carPrice = web3.utils.toWei(values.price.toString(), 'ether');

      await client.add(values.image).then(async (cid)=>{
        await contract.methods
        .createCar(
          values.licensePlate,
          values.chassisNumber,
          values.brand,
          values.type,
          values.color,
          values.mileage,
          carPrice,
          values.onSale,
          cid.path
        )
        .send({ from: accounts[0] }).then(()=>{
          toast({
            title: "Your car has been added.",
            description: "If your car is on sale, you should see it on the listing.",
          })
        });
      })
    },
  });

  return (
    <div className="dark:bg-slate-900 h-100">
      <Toaster></Toaster>
      <main>
        <div className="py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight ">Add a new car</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base ">
            You can add a new car to sell!
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-3xl lg:px-8">
          <form
            className="space-y-8 divide-y divide-gray-200"
            onSubmit={formik.handleSubmit}
          >
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="pt-8">
                <div>
                  <h3 className="text-base font-semibold leading-6">
                    General car information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Make sure to fill these fields properly
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6"
                    >
                      Brand
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="brand"
                        id="brand"
                        autoComplete="brand"
                        onChange={formik.handleChange}
                        value={formik.values.brand}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="last-name"
                      className="block text-sm font-medium leading-6 "
                    >
                      Type
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="type"
                        id="type"
                        onChange={formik.handleChange}
                        value={formik.values.type}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 "
                    >
                      Color
                    </Label>
                    <div className="mt-2">
                      <Input
                        id="color"
                        name="color"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.color}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="street-address"
                      className="block text-sm font-medium leading-6 "
                    >
                      License plate
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="licensePlate"
                        id="licensePlate"
                        onChange={formik.handleChange}
                        value={formik.values.licensePlate}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <Label
                      htmlFor="city"
                      className="block text-sm font-medium leading-6 "
                    >
                      Chassis number
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="text"
                        name="chassisNumber"
                        id="chassisNumber"
                        onChange={formik.handleChange}
                        value={formik.values.chassisNumber}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="region"
                      className="block text-sm font-medium leading-6 "
                    >
                      Mileage
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="number"
                        name="mileage"
                        id="mileage"
                        onChange={formik.handleChange}
                        value={formik.values.mileage}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <Label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 "
                    >
                      Price
                    </Label>
                    <div className="mt-2">
                      <Input
                        type="number"
                        name="price"
                        id="price"
                        onChange={formik.handleChange}
                        value={formik.values.price}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          type="checkbox"
                          name="onSale"
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="ml-3">
                        <Label
                          htmlFor="comments"
                          className="text-sm font-medium leading-6 "
                        >
                          On sale
                        </Label>
                        <p className="text-sm text-gray-500">
                          Checking this box, your car will be shown in the
                          listing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <Label
                      htmlFor="postal-code"
                      className="block text-sm font-medium leading-6 "
                    >
                      Image
                    </Label>
                    <div className="mt-2">
                      <div className="flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className=" text-sm text-gray-600">
                            <Label
                              htmlFor="file-upload"
                              className="bg-slate-200 rounded-md p-0.5"
                            >
                              <span>Upload a file</span>
                              <Input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e: any) =>
                                  formik.setFieldValue('image', e.currentTarget.files[0])
                                }
                              />
                            </Label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 pb-10">
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="py-2 px-3 text-sm font-semibold  "
                >
                  Cancel
                </Button>
                <Button type="submit" className="ml-3 rounded-md ">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
