"use client";

import { Inter } from "@next/font/google";
import useEth from "@/contexts/EthContext/useEth";



const products1 = [
  {
    id: 1,
    name: "Focus Paper Refill",
    href: "#",
    price: "$13",
    description: "3 sizes available",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-01.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 2,
    name: "Focus Card Holder",
    href: "#",
    price: "$64",
    description: "Walnut",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-02.jpg",
    imageAlt: "Paper card sitting upright in walnut card holder on desk.",
  },
  {
    id: 3,
    name: "Focus Carry Pouch",
    href: "#",
    price: "$32",
    description: "Heather Gray",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-03.jpg",
    imageAlt:
      "Textured gray felt pouch for paper cards with snap button flap and elastic pen holder loop.",
  },
  // More products...
];
const products2 = [
  {
    id: 7,
    name: "Electric Kettle",
    href: "#",
    price: "$149",
    description: "Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-07.jpg",
    imageAlt:
      "Close up of long kettle spout pouring boiling water into pour-over coffee mug with frothy coffee.",
  },
  {
    id: 8,
    name: "Leather Workspace Pad",
    href: "#",
    price: "$165",
    description: "Black",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-08.jpg",
    imageAlt:
      "Extra large black leather workspace pad on desk with computer, wooden shelf, desk organizer, and computer peripherals.",
  },
  {
    id: 9,
    name: "Leather Long Wallet",
    href: "#",
    price: "$118",
    description: "Natural",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-01-image-card-09.jpg",
    imageAlt:
      "Leather long wallet held open with hand-stitched card dividers, full-length bill pocket, and simple tab closure.",
  },
  // More products...
];


import { EthProvider } from "@/contexts/EthContext";
import { useEffect } from "react";

export default function Home() {
  const result:any = useEth();
  const {contract, accounts} = result.state

  const createCar = async() => {
    await contract.methods.createCar("gello", "gello","gello","gello","gello",1234567, 3000, true).send({ from: accounts[0] })
  }

  const getAllCars = async ()=> {
    const value = await contract.methods.getCarsForSale().call({ from: accounts[0] });
    console.log(value);
    
    
   /*  const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value); */
  }

  useEffect(() => {
    console.log(result);
    
    //createCar()
    getAllCars()
  })

  return (
    <>
      <div className="bg-gray-50">
          <main>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                  Car Chain
                </h1>
                <p className="mx-auto mt-4 max-w-3xl text-base text-gray-500">
                  Buy your car securely.
                </p>
              </div>

              {/* Product grid */}
              <section aria-labelledby="products-heading" className="mt-8">
                <h2 id="products-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products1.map((product) => (
                    <a key={product.id} href={product.href} className="group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm italic text-gray-500">
                        {product.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
              <section
                aria-labelledby="more-products-heading"
                className="mt-16 pb-24"
              >
                <h2 id="more-products-heading" className="sr-only">
                  More products
                </h2>

                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products2.map((product) => (
                    <a key={product.id} href={product.href} className="group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg sm:aspect-w-2 sm:aspect-h-3">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center group-hover:opacity-75"
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                        <h3>{product.name}</h3>
                        <p>{product.price}</p>
                      </div>
                      <p className="mt-1 text-sm italic text-gray-500">
                        {product.description}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </>
  );
}
