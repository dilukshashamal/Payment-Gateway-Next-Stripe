"use client";

import CheckoutPage from "../components/CheckoutPage";

export default function Home() {
  const amount = 49.99;
  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">BookMePro</h1>
        <h2 className="text-2xl">
          Starter <span className="font-bold"> ${amount}</span>
        </h2>
      </div>
      <CheckoutPage amount={amount} />
    </main>
  );
}
