export default function ShopperTerms() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gsg-black mb-8">Terms & Conditions</h1>
        <div className="prose prose-purple max-w-none text-gray-600">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">1. Service Overview</h2>
          <p>My Personal Shopper by GSG provides a service where we source and purchase items on your behalf based on a list you provide.</p>
          
          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">2. Pricing and Fees</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Market Price:</strong> We purchase items at the actual market price.</li>
            <li><strong>Commission:</strong> We charge a flat 5% commission or less on the total cost of the items.</li>
            <li><strong>Delivery Fee:</strong> Delivery fees are calculated based on the distance to your location.</li>
            <li><strong>Sourcing Fee:</strong> In rare cases where items are difficult to find, a sourcing fee may apply. This will be communicated and agreed upon before purchase.</li>
          </ul>

          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">3. Estimates vs. Final Prices</h2>
          <p>The prices you provide on your shopping list are estimates. Final prices will be confirmed based on actual market rates at the time of purchase. If there is a significant price difference, we will contact you for approval before proceeding.</p>

          <h2 className="text-xl font-bold text-gsg-black mt-8 mb-4">4. Payment</h2>
          <p>Payment must be completed before we begin shopping, unless otherwise agreed. If the final cost is lower than the estimate paid, the difference will be refunded or credited to your account. If the final cost is higher, a top-up payment will be required.</p>
        </div>
      </div>
    </div>
  );
}
