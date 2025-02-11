import React from "react";
import "./Body.css";

const CDCBody = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-white min-h-screen p-10">
      <div className="max-w-5xl mx-auto">
        {/* Featured Topics */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Featured Topics</h2>
          <div className="flex flex-wrap gap-2">
            {["Wildfires and Air Safety", "Respiratory Illnesses", "Mpox Outbreak", "Orthopoxvirus Outbreak"].map((topic) => (
              <button key={topic} className="px-4 py-2 bg-white border rounded-lg shadow-md hover:bg-gray-100">
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* A to Z Section */}
        {/* <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">A to Z</h2>
          <p className="text-gray-600 mb-2">Find diseases and conditions...</p>
          <div className="flex flex-wrap gap-2">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("" ).map((letter) => (
              <span key={letter} className="px-3 py-1 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                {letter}
              </span>
            ))}
          </div>
        </div> */}

        {/* News Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">News</h2>
          <ul className="space-y-2">
            {["U.S. Government Releases First National One Health Plan", "First Flu-Related Death Reported", "CDC Confirms First Case of H5N1 Bird Flu"].map((news, index) => (
              <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                {news}
              </li>
            ))}
          </ul>
        </div>

        {/* Scientific Journals */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Scientific Journals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["MMWR", "Emerging Infectious Diseases", "PCD Preventing Chronic Disease"].map((journal) => (
              <div key={journal} className="bg-white p-4 border rounded-lg shadow-md">
                <h3 className="font-bold">{journal}</h3>
                <p className="text-gray-600 text-sm">Learn about recent studies...</p>
                <button className="mt-2 text-blue-600 hover:underline">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDCBody;
