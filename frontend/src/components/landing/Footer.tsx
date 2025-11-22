export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="font-bold mb-4">Auriya</h3>
            <p className="text-sm text-gray-600">
              Decentralized creator monetization on Sui. Own your audience, keep 97% revenue.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="/creators" className="hover:text-black transition">Discover Creators</a></li>
              <li><a href="/dashboard/setup" className="hover:text-black transition">Launch Page</a></li>
              <li><a href="https://github.com/0xshikhar/auriya#readme" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Technology</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Sui Blockchain</a></li>
              <li><a href="https://walrus.site" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Walrus Storage</a></li>
              <li><a href="https://docs.mystenlabs.com/concepts/cryptography/zklogin" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">zkLogin Auth</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="https://github.com/0xshikhar/auriya" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">GitHub</a></li>
              <li><a href="/pricing" className="hover:text-black transition">Pricing</a></li>
              <li><a href="https://discord.gg/sui" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="https://twitter.com/0xshikhar" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Twitter</a></li>
              <li><a href="https://github.com/0xshikhar" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; 2025 Auriya. Built on Sui. Open source.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://github.com/0xshikhar/auriya/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">MIT License</a>
            <a href="https://github.com/0xshikhar/auriya" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">View Source</a>
            <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Powered by Sui</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
