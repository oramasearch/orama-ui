"use client";
import React from "react";
import { Star, ArrowDown, ExternalLink } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  const scrollToShowcase = () => {
    document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-gray-700 mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Headless React Components
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-6 leading-tight">
          Build Beautiful
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Search Experiences
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Unstyled, accessible, and composable React components that let you
          build
          <span className="font-semibold text-purple-700"> exactly</span> what
          you envision
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={scrollToShowcase}
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Explore Components
            <ArrowDown className="inline-block ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>

          <Link
            href="/showcase"
            className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-purple-400 hover:text-purple-700 transition-all duration-300 flex items-center gap-2"
          >
            View Examples
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Preview animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-gray-200 to-purple-200 rounded w-3/4 animate-pulse delay-100"></div>
              <div className="h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
