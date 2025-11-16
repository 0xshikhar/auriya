export default function Testimonials() {
  const testimonials = [
    {
      name: "Steph Smith",
      title: "Sells content tutorials",
      text: "For years, I had a goal to develop 'passive' income streams, but struggled to make that a reality. Last year, I started selling informational products on Auriya and since then have made $10k+ per month building products that I love."
    },
    {
      name: "Daniel Vassallo",
      title: "Sells business insights and expertise",
      text: "I love Auriya because it can&apos;t be any simpler. I upload a file, set a price, and I can start selling on the internet. The money I make from my sales lands directly in my bank account every Friday."
    },
    {
      name: "trendsvc",
      title: "Sells business insights and expertise",
      text: "Originally, I took pre-orders for my Trend Reports on Auriya. But I received... exactly $0. So I changed tactics: I made half of my report free, and the other half paid. Today, 99% of my revenue is recurring."
    }
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Real stories from creators
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gray-50 p-8 rounded-lg">
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div>
                <strong className="text-gray-900">{testimonial.name}</strong>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
