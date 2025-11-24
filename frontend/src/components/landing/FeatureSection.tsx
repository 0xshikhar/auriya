export default function FeatureSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Powered by Sui Stack</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Deep integration with Sui&apos;s cutting-edge infrastructure for the ultimate creator experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🐋</div>
            <h3 className="text-2xl font-bold mb-4">Walrus Storage</h3>
            <p className="text-gray-700 leading-relaxed">
              All content stored on decentralized Walrus network. Videos, images, avatars—<span className="font-semibold">permanent, censorship-resistant, and verifiable</span>. Your content lives forever.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold mb-4">Mysten Seal</h3>
            <p className="text-gray-700 leading-relaxed">
              Premium content encrypted with Seal. <span className="font-semibold">NFT-gated decryption</span> ensures only your subscribers can access tier-exclusive content. Privacy-first security.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-pink-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold mb-4">zkLogin Auth</h3>
            <p className="text-gray-700 leading-relaxed">
              Sign in with Google—<span className="font-semibold">no wallet, no seed phrases</span>. Web2 UX meets Web3 security. Onboard fans in seconds, not hours.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-4">Sui Blockchain</h3>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">10,000+ TPS, 3-5 second finality</span>, $0.001-0.01 fees. Lightning-fast transactions, programmable NFTs. The perfect blockchain for creators.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-yellow-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold mb-4">NFT Subscriptions</h3>
            <p className="text-gray-700 leading-relaxed">
              Subscriptions as <span className="font-semibold">transferable NFTs</span>. Fans can gift, trade, or sell memberships. Secondary markets create liquidity for access rights.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-red-300 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-4">Zero Censorship</h3>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">No platform can ban you</span>. Content on Walrus, revenue on-chain, audience owned by you. True creator sovereignty.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 border-t-2 border-gray-200 pt-12">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">97%</div>
            <p className="text-gray-700 font-semibold">Revenue to Creators</p>
            <p className="text-sm text-gray-500 mt-1">vs 80% on Patreon</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Instant</div>
            <p className="text-gray-700 font-semibold">Payments in SUI</p>
            <p className="text-sm text-gray-500 mt-1">vs 7-14 days delay</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Forever</div>
            <p className="text-gray-700 font-semibold">Content Permanence</p>
            <p className="text-sm text-gray-500 mt-1">Stored on Walrus</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">Zero</div>
            <p className="text-gray-700 font-semibold">Deplatforming Risk</p>
            <p className="text-sm text-gray-500 mt-1">Truly unstoppable</p>
          </div>
        </div>
      </div>
    </section>
  )
}
