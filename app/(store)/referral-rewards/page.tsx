import Link from 'next/link';

export default function ReferralRewardsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gsg-purple-light/20 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gsg-black mb-4">Referral Rewards</h1>
          <p className="text-gray-600">
            Invite friends to GSG Convenience Goods & More and earn rewards when they shop.
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-card p-8 text-center">
          <p className="text-gray-600 mb-6">
            Referral program details and your unique link will be available here. Check back soon or contact support.
          </p>
          <Link
            href="/account"
            className="inline-block bg-gsg-purple hover:bg-gsg-purple-dark text-white px-6 py-3 rounded-pill font-medium"
          >
            Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
