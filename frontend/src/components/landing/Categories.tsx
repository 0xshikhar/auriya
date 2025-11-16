export default function Categories() {
  const categories = [
    'art', 'music', 'writing', 'video', 'photography',
    'education', 'podcasts', 'newsletters', 'courses', 'ebooks',
    'design', 'code', 'fitness', 'cooking', 'gaming',
    'crypto', 'nfts', 'defi', 'web3', 'blockchain',
    'tutorials', 'templates'
  ]

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Any content. Any creator.
        </h2>
        
        <p className="text-center text-gray-600 mb-12">
          From artists to developers, educators to musicians—Auriya works for every creator
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, idx) => (
            <button
              key={idx}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-100 transition"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
