// app/payment-success/page.js

export default async function PaymentSuccess({ searchParams }) {
  // Await the promise before destructuring the search parameters
  const params = await searchParams;
  const { amount } = params;

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <h1 className="text-4xl font-extrabold mb-2">Payment Successful</h1>
      <h2 className="text-2xl">Amount: ${amount}</h2>
    </main>
  );
}
