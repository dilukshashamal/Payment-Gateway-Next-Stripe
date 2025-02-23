//components/CheckoutPage.js

"use client";

import React, { useEffect, useRef, useState } from "react";
import getStripe from "../utils/get-stripe";
import convertToSubcurrency from "../lib/convertToSubcurrency";

const CheckoutPage = ({ amount }) => {
  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs for mounting Payment Element and storing Elements instance
  const paymentElementRef = useRef(null);
  const paymentElementInstanceRef = useRef(null);
  const elementsRef = useRef(null);

  // Load Stripe instance
  useEffect(() => {
    const loadStripeInstance = async () => {
      const stripeInstance = await getStripe();
      setStripe(stripeInstance);
    };
    loadStripeInstance();
  }, []);

  // Fetch the Payment Intent client secret from your API
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  // Once both stripe and clientSecret are available, create and mount the Payment Element
  useEffect(() => {
    if (stripe && clientSecret && paymentElementRef.current) {
      // Create a new Elements instance with the client secret and store it
      const elements = stripe.elements({ clientSecret });
      elementsRef.current = elements;

      // Create the Payment Element and mount it
      const paymentElement = elements.create("payment");
      paymentElement.mount(paymentElementRef.current);
      paymentElementInstanceRef.current = paymentElement;
    }
  }, [stripe, clientSecret]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !clientSecret || !elementsRef.current) return;
    setLoading(true);
    setErrorMessage("");

    // Confirm the payment using the Payment Element
    const { error } = await stripe.confirmPayment({
      elements: elementsRef.current, // Pass the Elements instance here
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${amount}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment confirmation failed.");
    }
    setLoading(false);
  };

  // While loading Stripe or clientSecret, show a loading indicator
  if (!stripe || !clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
      {/* Payment Element container */}
      <div
        ref={paymentElementRef}
        id="payment-element"
        className="my-4 border p-4 rounded-md"
      ></div>
      {errorMessage && (
        <div className="text-red-500 mb-4">{errorMessage}</div>
      )}
      <button
        disabled={loading}
        className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${amount}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;
