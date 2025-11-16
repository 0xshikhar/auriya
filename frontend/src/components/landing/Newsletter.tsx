'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Subscribe to get tips and tactics to grow the way you want.
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-900 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}
