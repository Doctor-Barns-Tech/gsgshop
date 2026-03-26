export default function HowItWorks() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gsg-black mb-4">How It Works</h1>
          <p className="text-xl text-gray-600">Your personal shopper experience, simplified.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
          <div className="space-y-12">
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-gsg-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">1</div>
              <div>
                <h3 className="text-2xl font-bold text-gsg-black mb-3">Create Your List</h3>
                <p className="text-gray-600 leading-relaxed">
                  Navigate to the <a href="/shopper/shopping-list" className="text-gsg-purple font-bold hover:underline">Shopping List</a> page. Add the items you need, specifying the brand, quantity, and your estimated price. For produce, you can even specify the source (Local Market, Imported, or Controlled Environment).
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-gsg-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">2</div>
              <div>
                <h3 className="text-2xl font-bold text-gsg-black mb-3">We Source at Market Price</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you submit your list, our team reviews it and begins sourcing your items. We guarantee that we buy your items at the exact source market price—no hidden markups on the goods themselves.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-gsg-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">3</div>
              <div>
                <h3 className="text-2xl font-bold text-gsg-black mb-3">Transparent Fees</h3>
                <p className="text-gray-600 leading-relaxed">
                  We charge a flat <strong>5% commission or less</strong> on the subtotal of your items. A delivery fee is calculated based on the distance to your location. In rare cases, a small sourcing fee may apply if items require extensive travel to find, but this will always be agreed upon with you first.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-16 h-16 shrink-0 bg-gsg-purple text-white rounded-full flex items-center justify-center text-2xl font-bold">4</div>
              <div>
                <h3 className="text-2xl font-bold text-gsg-black mb-3">Pay & Schedule Delivery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Once prices are confirmed, you will receive a notification to complete your payment securely online. After payment, your personal shopper will purchase the items and deliver them to your doorstep at your preferred time.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-8 text-center">
          <i className="ri-time-line text-4xl text-gsg-purple mb-4 block"></i>
          <h3 className="text-xl font-bold text-gsg-black mb-2">Important Note</h3>
          <p className="text-purple-800">
            We advise timely placement of your shopping list ahead of your preferred delivery time to ensure we can source the freshest and best quality items for you.
          </p>
        </div>
      </div>
    </div>
  );
}
