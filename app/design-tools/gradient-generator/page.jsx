'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function GradientGenerator() {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  const [colorStops, setColorStops] = useState([
    { id: 1, color: '#2A7B9B', stop: 0 },
    { id: 2, color: '#57C785', stop: 50 },
    { id: 3, color: '#EDDD53', stop: 100 }
  ]);

  const generateGradientCSS = () => {
    const sorted = [...colorStops].sort((a, b) => a.stop - b.stop);
    const stops = sorted.map(s => `${s.color} ${s.stop}%`);
    return type === 'linear'
      ? `linear-gradient(${angle}deg, ${stops.join(', ')})`
      : `radial-gradient(circle, ${stops.join(', ')})`;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5]">
    

      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-xl px-3 sm:px-4 py-4 ">

        {/* Header */}
        <div className="text-center mb-4">
            <Navbar />
          <h1 className="text-lg sm:text-2xl font-bold mt-20">CSS Gradient Generator</h1>
          <p className="text-xs sm:text-sm text-gray-600">Create professional gradients easily</p>
        </div>

        {/* Card */}
        <div className="bg-white  max-w-[320px] sm:max-w-95 md:max-w-105 mx-auto rounded-xl p-3 sm:p-4 shadow-lg space-y-4">


          {/* Live Preview */}
          <div className="rounded-xl overflow-hidden border">
            <div
              className="h-28 sm:h-36 w-full"
              style={{ background: generateGradientCSS() }}
            />
          </div>

          {/* Type Switch */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType('linear')}
              className={`py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                type === 'linear'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => setType('radial')}
              className={`py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
                type === 'radial'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Radial
            </button>
          </div>

          {/* Angle */}
          {type === 'linear' && (
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium">Angle: {angle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(+e.target.value)}
                className="w-full accent-black"
              />
            </div>
          )}

          {/* Color Stops */}
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-medium">Color Stops</p>
            {colorStops.map((stop) => (
              <div
                key={stop.id}
                className="flex flex-wrap sm:flex-nowrap items-center gap-2"
              >
                <div
                  className="w-9 h-9 rounded-lg border"
                  style={{ background: stop.color }}
                />
                <input
                  value={stop.color}
                  className="flex-1 text-xs sm:text-sm border border-black border-dotted rounded-lg px-2 py-1"
                  readOnly
                />
                <div className="relative">
                  <input
                    type="number"
                    value={stop.stop}
                    className="w-14 sm:w-20 text-xs sm:text-sm border rounded-lg px-2 py-1 text-center"
                    readOnly
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">%</span>
                </div>
              </div>
            ))}
          </div>

          {/* CSS Output */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">CSS Output</p>
            <code className="block  sm:text-xs font-mono break-all bg-white  p-2 rounded-lg">
              background: {generateGradientCSS().slice(0,30)}...;
            </code>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => navigator.clipboard.writeText(`background: ${generateGradientCSS()};`)}
            className="w-full bg-black text-white py-2.5 text-sm rounded-lg hover:bg-gray-800 transition"
          >
            Copy CSS
          </button>

        </div>
      </div>

      <Footer />
    </div>
  );
}
