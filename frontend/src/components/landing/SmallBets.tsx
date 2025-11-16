export default function SmallBets() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start small.<br />
            <span className="text-gray-500">Scale decentralized.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-lg font-semibold mb-4">Instead of platform dependency...</p>
            <p className="text-5xl font-bold text-gray-200">→</p>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">...own your creator business!</p>
            <p className="text-center text-gray-600">
              Launch your subscription page in minutes. NFT memberships, Walrus storage, instant SUI payments. No middlemen.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 py-12 border-t border-b border-gray-200">
          <div>
            <p className="text-lg font-semibold mb-4">Instead of monthly fees...</p>
            <p className="text-5xl font-bold text-gray-200">→</p>
          </div>
          <div>
            <p className="text-lg font-semibold mb-4">...get paid instantly onchain!</p>
            <p className="text-gray-600">
              95% revenue share. No chargebacks. No payment delays.<br />
              Your money, your wallet, your control.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
