// app/design/gradient-generator/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [gradientImage, setGradientImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeColorStop, setActiveColorStop] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  const colorPickerRef = useRef(null);

  // Initialize on mount
  useEffect(() => {
    generateGradient();
  }, []);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate gradient CSS
  const generateGradientCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.stop - b.stop);
    const stops = sortedStops.map(cs => `${cs.color} ${cs.stop}%`);
    
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
    } else {
      return `radial-gradient(circle, ${stops.join(', ')})`;
    }
  };

  // Create output image
  const createOutputImage = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.stop - b.stop);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 550;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 600, 550);
    
    // Gradient preview bar
    const previewGradient = ctx.createLinearGradient(50, 50, 550, 50);
    sortedStops.forEach(stop => {
      previewGradient.addColorStop(stop.stop / 100, stop.color);
    });
    ctx.fillStyle = previewGradient;
    ctx.fillRect(50, 50, 500, 100);
    
    // Top border for gradient preview
    ctx.fillStyle = '#333';
    ctx.fillRect(50, 50, 500, 2);
    ctx.fillRect(50, 148, 500, 2);
    
    // Hex color at top-left
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(sortedStops[0].color.toUpperCase(), 50, 40);
    
    // RGB values
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const firstColorRgb = hexToRgb(sortedStops[0].color);
    if (firstColorRgb) {
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.fillStyle = '#888888';
      ctx.fillText('R    G    B    A', 50, 190);
      
      ctx.fillStyle = '#ffffff';
      const r = firstColorRgb.r.toString().padStart(3);
      const g = firstColorRgb.g.toString().padStart(3);
      const b = firstColorRgb.b.toString().padStart(3);
      ctx.fillText(`${r}    ${g}    ${b}    100`, 50, 215);
    }
    
    // Gradient type and angle
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(type.charAt(0).toUpperCase() + type.slice(1), 50, 260);
    
    if (type === 'linear') {
      ctx.fillText(angle.toString().padStart(3), 280, 260);
    }
    
    // Color stops header
    ctx.font = 'bold 20px "Courier New", monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('STOPS', 50, 310);
    
    // Color stops list
    sortedStops.forEach((stop, i) => {
      const y = 340 + (i * 30);
      
      // Color hex
      ctx.fillStyle = stop.color;
      ctx.fillText(stop.color.toUpperCase(), 50, y);
      
      // Stop percentage
      ctx.fillStyle = '#ffffff';
      ctx.fillText(stop.stop.toString().padStart(3), 200, y);
      
      // × symbol
      ctx.fillStyle = '#ff5555';
      ctx.fillText('×', 250, y);
    });
    
    // Divider line
    ctx.fillStyle = '#444';
    ctx.fillRect(50, 430, 500, 2);
    
    // CSS Code section
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    
    // Solid color CSS
    ctx.fillStyle = '#4dabf7';
    ctx.fillText('1   background: ' + sortedStops[0].color.toUpperCase() + ';', 50, 470);
    
    // Gradient CSS
    ctx.fillText(`2   background: ${generateGradientCSS()};`, 50, 500);
    
    // "Copy to clipboard" text
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillStyle = '#4dabf7';
    ctx.textAlign = 'center';
    ctx.fillText('Copy to clipboard', 300, 540);
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setGradientImage(dataUrl);
  };

  // Generate gradient
  const generateGradient = () => {
    setLoading(true);
    setError('');
    try {
      setTimeout(() => {
        createOutputImage();
        setLoading(false);
      }, 100);
    } catch (error) {
      setError('Failed to generate gradient');
      setLoading(false);
    }
  };

  // Add color stop
  const addColorStop = () => {
    const newId = Math.max(...colorStops.map(cs => cs.id)) + 1;
    const newStop = Math.min(100, colorStops[colorStops.length - 1].stop + 10);
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    
    setColorStops([...colorStops, { 
      id: newId, 
      color: randomColor.toUpperCase(), 
      stop: newStop 
    }]);
  };

  // Remove color stop
  const removeColorStop = (id) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter(cs => cs.id !== id));
    }
  };

  // Update color stop
  const updateColorStop = (id, field, value) => {
    setColorStops(colorStops.map(cs => {
      if (cs.id === id) {
        if (field === 'color') {
          return { ...cs, color: value.toUpperCase() };
        } else if (field === 'stop') {
          const numValue = parseInt(value) || 0;
          return { ...cs, stop: Math.max(0, Math.min(100, numValue)) };
        }
      }
      return cs;
    }));
  };

  // Open color picker
  const openColorPicker = (stopId, event) => {
    setActiveColorStop(stopId);
    setPickerPosition({
      x: event.clientX - 150,
      y: event.clientY + 10
    });
    setShowColorPicker(true);
  };

  // Handle color pick
  const handleColorPick = (color) => {
    if (activeColorStop) {
      updateColorStop(activeColorStop, 'color', color);
      setTimeout(generateGradient, 100);
    }
    setShowColorPicker(false);
  };

  // Download image
  const downloadImage = () => {
    if (!gradientImage) return;
    
    const link = document.createElement('a');
    link.href = gradientImage;
    link.download = 'gradient.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy CSS with better UX
  const copyToClipboard = async () => {
    const css = `background: ${generateGradientCSS()};`;
    try {
      await navigator.clipboard.writeText(css);
      // Show success message
      const button = document.getElementById('copyButton');
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
      }, 2000);
    } catch (err) {
      alert('Failed to copy to clipboard');
    }
  };

  // Presets
  const presets = [
    {
      name: 'Ocean Breeze',
      type: 'linear',
      angle: 90,
      stops: [
        { color: '#2A7B9B', position: 0 },
        { color: '#57C785', position: 50 },
        { color: '#EDDD53', position: 100 }
      ]
    },
    {
      name: 'Sunset',
      type: 'linear',
      angle: 45,
      stops: [
        { color: '#FF7E5F', position: 0 },
        { color: '#FEB47B', position: 100 }
      ]
    },
    {
      name: 'Radial Glow',
      type: 'radial',
      angle: 0,
      stops: [
        { color: '#667EEA', position: 0 },
        { color: '#764BA2', position: 100 }
      ]
    },
    {
      name: 'Forest',
      type: 'linear',
      angle: 135,
      stops: [
        { color: '#11998E', position: 0 },
        { color: '#38EF7D', position: 100 }
      ]
    }
  ];

  // Handle preset
  const handlePreset = (preset) => {
    setType(preset.type);
    setAngle(preset.angle);
    setColorStops(preset.stops.map((stop, i) => ({
      id: i + 1,
      color: stop.color,
      stop: stop.position
    })));
    setTimeout(generateGradient, 100);
  };

  // Color picker component
  const ColorPicker = () => {
    const [hue, setHue] = useState(200);
    const [saturation, setSaturation] = useState(50);
    const [lightness, setLightness] = useState(50);
    const [selectedColor, setSelectedColor] = useState('#2A7B9B');

    const canvasRef = useRef(null);
    const hueCanvasRef = useRef(null);

    // Convert HSL to hex
    const hslToHex = (h, s, l) => {
      s /= 100;
      l /= 100;
      
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;
      
      let r, g, b;
      
      if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
      } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
      } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
      } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
      } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
      } else {
        [r, g, b] = [c, 0, x];
      }
      
      const rgb = [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
      ];
      
      return `#${rgb.map(c => c.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
    };

    // Update selected color
    useEffect(() => {
      const newColor = hslToHex(hue, saturation, lightness);
      setSelectedColor(newColor);
    }, [hue, saturation, lightness]);

    // Draw color picker
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Draw saturation/lightness grid
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const s = (x / width) * 100;
          const l = 100 - (y / height) * 100;
          const color = hslToHex(hue, s, l);
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw hue slider
      const hueCanvas = hueCanvasRef.current;
      if (hueCanvas) {
        const hueCtx = hueCanvas.getContext('2d');
        const hueWidth = hueCanvas.width;
        const hueHeight = hueCanvas.height;
        
        for (let x = 0; x < hueWidth; x++) {
          const h = (x / hueWidth) * 360;
          const color = hslToHex(h, 100, 50);
          hueCtx.fillStyle = color;
          hueCtx.fillRect(x, 0, 1, hueHeight);
        }
      }
    }, [hue]);

    const handleColorGridClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const s = Math.round((x / canvasRef.current.width) * 100);
      const l = 100 - Math.round((y / canvasRef.current.height) * 100);
      
      setSaturation(s);
      setLightness(l);
    };

    const handleHueClick = (e) => {
      const rect = hueCanvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const h = Math.round((x / hueCanvasRef.current.width) * 360);
      setHue(h);
    };

    const handleApplyColor = () => {
      handleColorPick(selectedColor);
    };

    return (
      <div 
        ref={colorPickerRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-300 p-4"
        style={{
          left: `${pickerPosition.x}px`,
          top: `${pickerPosition.y}px`,
          width: '320px'
        }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Color Picker</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="font-mono text-sm">{selectedColor}</span>
            </div>
          </div>
          
          {/* Main color grid */}
          <div className="relative mb-3">
            <canvas
              ref={canvasRef}
              width={280}
              height={200}
              className="w-full h-40 rounded border border-gray-300 cursor-crosshair"
              onClick={handleColorGridClick}
            />
            {/* Selection indicator */}
            <div 
              className="absolute w-3 h-3 border-2 border-white rounded-full pointer-events-none"
              style={{
                left: `${(saturation / 100) * 280 - 6}px`,
                top: `${((100 - lightness) / 100) * 200 - 6}px`
              }}
            />
          </div>
          
          {/* Hue slider */}
          <div className="relative mb-3">
            <div className="text-xs text-gray-600 mb-1">Hue</div>
            <canvas
              ref={hueCanvasRef}
              width={280}
              height={20}
              className="w-full h-5 rounded border border-gray-300 cursor-pointer"
              onClick={handleHueClick}
            />
            {/* Hue indicator */}
            <div 
              className="absolute w-2 h-6 -ml-1 -mt-0.5 border-2 border-white rounded-sm pointer-events-none"
              style={{
                left: `${(hue / 360) * 280}px`,
                top: '0'
              }}
            />
          </div>
          
          {/* Controls */}
          <div className="grid grid-cols-3 gap-3 text-xs mb-4">
            <div>
              <div className="text-gray-600 mb-1">H</div>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{hue}°</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">S</div>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{saturation}%</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">L</div>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-center">{lightness}%</div>
            </div>
          </div>
          
          {/* Color presets */}
          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-2">Quick Colors</div>
            <div className="grid grid-cols-6 gap-2">
              {['#2A7B9B', '#57C785', '#EDDD53', '#FF7E5F', '#667EEA', '#764BA2', '#11998E', '#38EF7D', '#FF9A9E', '#FAD0C4', '#2193B0', '#6DD5ED'].map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyColor}
              className="flex-1 py-2 bg-black text-white text-sm rounded hover:bg-gray-800"
            >
              Apply Color
            </button>
            <button
              onClick={() => setShowColorPicker(false)}
              className="px-4 py-2 bg-gray-100 text-gray-800 text-sm rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
      <div className="mx-auto max-w-md px-4 py-6">
        <Navbar />

        {/* Header */}
        <div className="text-center mb-6 mt-20">
          <h1 className="text-2xl font-bold mb-2">
            CSS Gradient Generator
          </h1>
          <p className="text-sm text-gray-600">
            Create professional gradients with formatted output
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-4 shadow-sm bg-white space-y-4">
          
          {/* Live Preview */}
          <div className="rounded-lg border border-gray-300 overflow-hidden">
            <div 
              className="h-32 w-full"
              style={{
                background: generateGradientCSS()
              }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Gradient Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gradient Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setType('linear'); setTimeout(generateGradient, 100); }}
                  className={`flex-1 py-2 rounded-lg text-sm ${type === 'linear' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Linear
                </button>
                <button
                  onClick={() => { setType('radial'); setTimeout(generateGradient, 100); }}
                  className={`flex-1 py-2 rounded-lg text-sm ${type === 'radial' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Angle */}
            {type === 'linear' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Angle: {angle}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={angle}
                  onChange={(e) => { setAngle(parseInt(e.target.value)); setTimeout(generateGradient, 100); }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>
            )}

            {/* Color Stops */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Color Stops
                </label>
                <button
                  onClick={addColorStop}
                  className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  + Add Color
                </button>
              </div>
              
              <div className="space-y-2">
                {colorStops.map((stop) => (
                  <div key={stop.id} className="flex items-center gap-2">
                    <button
                      onClick={(e) => openColorPicker(stop.id, e)}
                      className="w-10 h-10 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: stop.color }}
                      title="Click to pick color"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => { updateColorStop(stop.id, 'color', e.target.value); setTimeout(generateGradient, 100); }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                      placeholder="#RRGGBB"
                    />
                    <div className="relative">
                      <input
                        type="number"
                        value={stop.stop}
                        onChange={(e) => { updateColorStop(stop.id, 'stop', e.target.value); setTimeout(generateGradient, 100); }}
                        min="0"
                        max="100"
                        className="w-20 px-3 py-2 border border-gray-300 rounded text-sm text-center"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">%</span>
                    </div>
                    <button
                      onClick={() => { removeColorStop(stop.id); setTimeout(generateGradient, 100); }}
                      disabled={colorStops.length <= 2}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove color stop"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePreset(preset)}
                    className="text-xs p-2 rounded border border-gray-300 hover:border-gray-400 text-left transition-colors"
                    style={{
                      background: preset.type === 'linear' 
                        ? `linear-gradient(${preset.angle}deg, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                        : `radial-gradient(circle, ${preset.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`
                    }}
                  >
                    <div className="backdrop-blur-sm bg-white/80 p-1 rounded">
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-gray-600">
                        {preset.type} • {preset.stops.length} colors
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Generate Button */}
            <button
              onClick={generateGradient}
              disabled={loading}
              className="w-full rounded-lg bg-black text-white py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </span>
              ) : 'Generate Gradient'}
            </button>
          </div>

          {/* Generated Output */}
          {gradientImage && (
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Generated Output</h3>
                <div className="flex gap-2">
                  <button
                    id="copyButton"
                    onClick={copyToClipboard}
                    className="text-xs bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy CSS
                  </button>
                  <button
                    onClick={downloadImage}
                    className="text-xs bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PNG
                  </button>
                </div>
              </div>

              {/* Image Preview */}
              <div className="border border-gray-300 rounded-lg overflow-hidden mb-3">
                <img 
                  src={gradientImage} 
                  alt="Generated Gradient" 
                  className="w-full"
                />
              </div>

              {/* CSS Preview */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">CSS Code</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
                <code className="text-xs text-gray-700 block whitespace-pre-wrap bg-gray-100 p-2 rounded font-mono">
                  {`background: ${generateGradientCSS()};`}
                </code>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!gradientImage && (
            <div className="text-center py-6">
              <div className="h-24 rounded-lg mb-4 mx-auto max-w-xs border border-gray-300" style={{
                background: 'linear-gradient(90deg, #2A7B9B 0%, #57C785 50%, #EDDD53 100%)'
              }} />
              <h3 className="font-semibold mb-2">Create Professional Gradients</h3>
              <p className="text-sm text-gray-600 mb-4">
                Click on color boxes to pick colors, adjust stops, then generate.
              </p>
            </div>
          )}
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && <ColorPicker />}

      </div>
        <Footer />
    </div>
  );
}