import Link from 'next/link';

export default function ShopperHome() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gsg-purple text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            List Them — We Shop For You...
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto">
            Quality/Fresh/Yummy For You AT THE SAME SOURCE PRICE. Time & Money Saver For Value.
          </p>
          <Link 
            href="/shopping-list" 
            className="inline-block bg-white text-gsg-purple px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create Shopping List
          </Link>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gsg-black">We Shop For You...</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              'Health & Wellness', 'Bakery', 'Frozen Foods', 'Meat, Fish & Poultry',
              'Dairy & Eggs', 'Fresh Produce', 'Ghana Dishes Ingredient', 'Cooked Popular Rice Dishes',
              'Over The Counter Medicine', 'Prescribed Medicine', 'Stew Ingredient', 'Soup Ingredient',
              'Jollof Ingredient', 'Local Market Vegetable, Fruit & Herb', 'Imported Vegetable, Fruit & Herb',
              'Controlled/Certified Environment Vegetable, Fruit & Herb'
            ].map((category, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow flex items-center justify-center min-h-[120px]">
                <span className="font-medium text-gray-800">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gsg-black mb-4">How It Works</h2>
            <p className="text-gray-600">Simple, transparent, and convenient.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gsg-purple/10 text-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-3">Create Your List</h3>
              <p className="text-gray-600">Add items, specify quantities, and provide your estimated prices.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gsg-purple/10 text-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-3">We Source & Confirm</h3>
              <p className="text-gray-600">We find your items at market price. We charge a flat 5% commission.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gsg-purple/10 text-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-3">Pay & Receive</h3>
              <p className="text-gray-600">Pay securely online and get your items delivered to your doorstep.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/how-it-works" className="text-gsg-purple font-bold hover:underline">
              Read full details & pricing &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
