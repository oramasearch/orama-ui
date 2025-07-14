'use client'
import React from 'react'

export const HeroShowcase = () => {
  return (
    <section className='relative py-20 flex items-center justify-center px-4 overflow-hidden'>
      <div className='relative z-10 text-center max-w-4xl mx-auto'>
        <h1 className='text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6 leading-tight'>
          Component
          <br />
          <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
            Showcase
          </span>
        </h1>

        <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed'>
          Easily add conversational AI, smart suggestions, and more.
        </p>
      </div>
    </section>
  )
}
