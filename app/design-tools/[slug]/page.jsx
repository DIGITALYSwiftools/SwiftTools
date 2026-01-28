"use client";

import { useState, use, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { designTool } from "../../lib/tools";
import { runDesignTool } from "../../lib/api";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  Shirt, 
  Coffee, 
  CreditCard,
  Image as ImageIcon
} from "lucide-react";

export default function DesignToolPage({ params }) {
  const { slug } = use(params);
  const detail = designTool[slug];

  const isColorTool = slug === "color-palette-generator";
  const isMockupTool = slug === "mockup-generator";

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  
  // Mockup-specific state
  const [mockups, setMockups] = useState([]);
  const [selectedMockup, setSelectedMockup] = useState("iphone15");
  const [rotation, setRotation] = useState(0);
  const [shadowIntensity, setShadowIntensity] = useState(0.3);
  const [showReflection, setShowReflection] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#f5f5f7");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load mockups when on mockup generator page
  useEffect(() => {
    if (isMockupTool) {
      fetchMockups();
    }
  }, [isMockupTool]);

  const fetchMockups = async () => {
    try {
      const response = await fetch('/api/design/mockup');
      const data = await response.json();
      if (data.success) {
        setMockups(data.mockups);
      }
    } catch (err) {
      console.error('Failed to load mockups:', err);
    }
  };

  if (!detail) {
    return <div className="text-center mt-40">Tool not found</div>;
  }

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setError("");
    setResult(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGenerate = async () => {
    if ((isColorTool || isMockupTool) && !image) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let data;
      
      if (isMockupTool) {
        // For mockup generator, use FormData with additional parameters
        const formData = new FormData();
        formData.append('file', image);
        formData.append('mockupId', selectedMockup);
        formData.append('rotation', rotation.toString());
        formData.append('shadowIntensity', shadowIntensity.toString());
        formData.append('showReflection', showReflection.toString());
        formData.append('backgroundColor', backgroundColor);
        
        const response = await fetch('/api/design/mockup', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate mockup');
        }
        
        data = await response.blob();
      } else {
        // For other tools (color palette), use the existing API
        data = await runDesignTool({ slug, file: image });
      }

      // If data is Blob, download it
      if (data instanceof Blob) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = isMockupTool ? `mockup_${selectedMockup}.jpg` : "palette.jpg";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }, 100);
      } else {
        // For JSON response (palette colors)
        setResult(data);
      }
    } catch (err) {
      setError(err.message || `Failed to generate ${detail.title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  // Mockup icon mapping
  const getMockupIcon = (mockupType) => {
    switch(mockupType) {
      case 'phone': return <Smartphone className="w-5 h-5" />;
      case 'laptop': return <Laptop className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      case 'display': return <Monitor className="w-5 h-5" />;
      case 'apparel': 
        return mockups.find(m => m.id === selectedMockup)?.name === 'Coffee Mug' 
          ? <Coffee className="w-5 h-5" /> 
          : <Shirt className="w-5 h-5" />;
      case 'print': return <CreditCard className="w-5 h-5" />;
      default: return <ImageIcon className="w-5 h-5" />;
    }
  };

  // Color presets
  const colorPresets = [
    { name: 'Light Gray', color: '#f5f5f7' },
    { name: 'White', color: '#ffffff' },
    { name: 'Dark', color: '#1f2937' },
    { name: 'Soft Gray', color: '#f0f0f0' },
    { name: 'Light Blue', color: '#f0f9ff' },
    { name: 'Light Pink', color: '#fdf2f8' },
    { name: 'Light Green', color: '#f0fdf4' },
    { name: 'Light Yellow', color: '#fefce8' }
  ];

  /* ================= UI ================= */

  return (
   <>
    <div className="text-black w-screen bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
      <div className="mx-auto max-w-md px-3 py-4">
        <Navbar />
        {/* Header */}
        <div className="text-center mb-3 mt-24">
          <h1 className="text-xl md:text-2xl font-bold mb-1">
            {detail.title}
          </h1>
          <p className="text-xs md:text-sm text-gray-600">
            {detail.description}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-xl p-4 shadow-sm bg-white space-y-4">

          {/* Upload Section */}
          <label className="flex flex-col items-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-2 text-center hover:bg-gray-100 transition-colors">
            {!preview ? (
              <>
                <div className="w-20 h-20  flex items-center justify-center  rounded-full">
                  <img src="/cloud-logo.png"/>
                </div>
                <span className="font-semibold text-base">
                  {isMockupTool ? "Upload Your Design" : "Upload Image"}
                </span>
                <span className="text-gray-500 text-sm">
                  JPG, PNG, WEBP • Max 10MB
                </span>
                <span className="text-gray-400 text-xs">
                  Click or drag & drop
                </span>
              </>
            ) : (
              <>
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-20 object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/10 rounded-lg" />
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  Design Ready
                </span>
                <span className="text-xs text-gray-500">
                  Click to change image
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>

          {/* Mockup-specific controls */}
          {isMockupTool && preview && (
            <>
              {/* Mockup Template Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">Mockup Template</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {mockups.find(m => m.id === selectedMockup)?.name || "Select"}
                  </span>
                </div>
                
                {/* Device Categories */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'phone', label: 'Phone', icon: <Smartphone className="w-4 h-4" /> },
                    { type: 'laptop', label: 'Laptop', icon: <Laptop className="w-4 h-4" /> },
                    { type: 'tablet', label: 'Tablet', icon: <Tablet className="w-4 h-4" /> },
                    { type: 'apparel', label: 'Apparel', icon: <Shirt className="w-4 h-4" /> }
                  ].map(({ type, label, icon }) => {
                    const mockupOfType = mockups.find(m => m.type === type);
                    if (!mockupOfType) return null;
                    
                    const isActive = mockups.find(m => m.id === selectedMockup)?.type === type;
                    
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedMockup(mockupOfType.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                          isActive 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className={`${isActive ? 'text-white' : 'text-gray-600'}`}>
                          {icon}
                        </div>
                        <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-700'}`}>
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Mockup Variants */}
                <div className="grid grid-cols-2 gap-2">
                  {mockups
                    .filter(mockup => mockup.type === mockups.find(m => m.id === selectedMockup)?.type)
                    .slice(0, 4)
                    .map((mockup) => (
                      <button
                        key={mockup.id}
                        onClick={() => setSelectedMockup(mockup.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          selectedMockup === mockup.id 
                            ? 'border-black bg-black text-white shadow-sm' 
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          selectedMockup === mockup.id ? 'bg-white/20' : 'bg-gray-100'
                        }`}>
                          {getMockupIcon(mockup.type)}
                        </div>
                        <div className="text-left">
                          <div className={`text-sm font-medium ${
                            selectedMockup === mockup.id ? 'text-white' : 'text-gray-800'
                          }`}>
                            {mockup.name}
                          </div>
                          <div className={`text-xs ${
                            selectedMockup === mockup.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {mockup.category}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Settings Panel */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-800">Customize Mockup</h3>
                
                {/* Rotation & Shadow */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-700">Rotation</span>
                      <span className="text-xs font-medium">{rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={rotation}
                      onChange={(e) => setRotation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-700">Shadow</span>
                      <span className="text-xs font-medium">{Math.round(shadowIntensity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowIntensity * 100}
                      onChange={(e) => setShadowIntensity(parseInt(e.target.value) / 100)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-800">Screen Reflection</span>
                    <p className="text-xs text-gray-500">Adds realistic screen glow</p>
                  </div>
                  <button
                    onClick={() => setShowReflection(!showReflection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      showReflection ? 'bg-black' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showReflection ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {/* Background Color Picker */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-800">Background Color</span>
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="text-xs text-gray-600 hover:text-gray-800"
                    >
                      {showColorPicker ? 'Hide' : 'Custom'}
                    </button>
                  </div>
                  
                  {/* Color Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.color}
                        onClick={() => setBackgroundColor(preset.color)}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg border-2 ${
                            backgroundColor === preset.color 
                              ? 'border-black ring-2 ring-offset-1 ring-black/20' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="text-[10px] text-gray-600">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Color Picker */}
                  {showColorPicker && (
                    <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-700">Custom Color</span>
                        <span className="text-xs font-mono bg-white px-2 py-1 rounded">
                          {backgroundColor.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg border"
                          style={{ backgroundColor: backgroundColor }}
                        />
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-12 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                          placeholder="#RRGGBB"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || (isMockupTool && !preview)}
            className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
              loading || (isMockupTool && !preview)
                ? 'bg-black text-white hover:bg-gray-800 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 cursor-pointer active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                {isMockupTool ? "Creating Mockup..." : "Generating..."}
              </span>
            ) : (
              isMockupTool ? "Generate Mockup" : "Generate Color Palette"
            )}
          </button>

          {/* Color Palette Result */}
          {result?.palette && (
            <div className="p-4 border rounded-xl bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Color Palette</h3>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {result.palette.length} colors
                </span>
              </div>
              
           <div className="flex gap-2 mb-3 overflow-x-auto pb-2 flex-row">
  {result.palette.map((color, i) => (
    <div
      key={i}
      className="relative group " // Added "group" class here
    >
      <div
        className="w-12 h-12 rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform"
        style={{ backgroundColor: color }}
        title={color}
      />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {color}
      </div>
    </div>
  ))}
</div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(result.palette.join(', '))}
                  className="flex-1 text-xs text-gray-700 hover:text-gray-900 hover:bg-white py-2 rounded-lg transition-colors"
                >
                  Copy Colors
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(result.palette.join('\n'))}
                  className="flex-1 text-xs text-gray-700 hover:text-gray-900 hover:bg-white py-2 rounded-lg transition-colors"
                >
                  Copy List
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
      <Footer />
   </>
  );
}