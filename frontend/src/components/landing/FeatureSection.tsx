export default function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-4">Built on Sui</h3>
            <p className="text-gray-700 leading-relaxed">
              Lightning-fast transactions, low fees, and programmable NFTs. The perfect blockchain for creator economies.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4">Walrus storage</h3>
            <p className="text-gray-700 leading-relaxed">
              Decentralized blob storage for all your media. Videos, images, files—stored permanently and censorship-resistant.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4">No deplatforming</h3>
            <p className="text-gray-700 leading-relaxed">
              Your audience, your content, your revenue. No platform can ban you or freeze your funds. True ownership.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 border-t pt-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">97%</div>
            <p className="text-gray-600">Revenue to creators</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">Instant</div>
            <p className="text-gray-600">Payments in SUI</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">Zero</div>
            <p className="text-gray-600">Deplatforming risk</p>
          </div>
        </div>
      </div>
    </section>
  )
}
