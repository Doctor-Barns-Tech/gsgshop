export default function ShopperFAQs() {
  const faqs = [
    {
      q: "How does the Personal Shopper service work?",
      a: "Simply create a shopping list on our website with the items you need and your estimated prices. We will review it, source the items at market price, and deliver them to your door. You pay a 5% commission on the subtotal."
    },
    {
      q: "What is the commission fee?",
      a: "We charge a flat 5% commission on the total cost of the items we purchase for you."
    },
    {
      q: "How is the delivery fee calculated?",
      a: "The delivery fee is calculated based on the distance from the market/store to your delivery address."
    },
    {
      q: "Are there any hidden fees?",
      a: "No. You pay the exact market price for the goods, plus our 5% commission, and the delivery fee. In rare cases, a sourcing fee may apply for hard-to-find items, but we will always ask for your approval first."
    },
    {
      q: "What if the actual market price is higher than my estimate?",
      a: "If the actual price is significantly higher, we will contact you for approval before purchasing. If it's a minor difference, we may proceed and request a top-up payment."
    },
    {
      q: "What if the actual market price is lower than my estimate?",
      a: "If you have prepaid based on an estimate and the actual cost is lower, we will refund the difference or credit it to your account for future use."
    },
    {
      q: "Can I specify where you buy my produce?",
      a: "Yes! When adding vegetables, fruits, or herbs to your list, you can specify if you prefer them from the Local Market, Imported, or from a Controlled/Certified Environment."
    },
    {
      q: "Do you buy prescribed medicine?",
      a: "Yes, we can source prescribed medicine. You will need to provide a clear picture or copy of the valid prescription."
    },
    {
      q: "What happens if an item is out of stock?",
      a: "If an item is out of stock, we will contact you to suggest suitable substitutions. If you do not want a substitute, we will remove the item from your list and adjust the total."
    },
    {
      q: "How do I pay?",
      a: "Once your list is reviewed and prices are confirmed, we will send you a payment link. You can pay securely online using Mobile Money or a card."
    },
    {
      q: "Can I schedule my delivery?",
      a: "Yes, you can specify your preferred delivery time when submitting your list. We advise submitting your list well in advance to ensure timely delivery."
    },
    {
      q: "How can I track my request?",
      a: "You can track the status of your request on our Track page using your Request ID or the phone number you provided."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gsg-black mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Everything you need to know about our service.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-gsg-black mb-3">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
