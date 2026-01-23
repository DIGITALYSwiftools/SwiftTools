
import {
  ArrowRight,
  ImageIcon,
  FileText,
  Crop,
  Zap,
  Lock,
  Settings,
  Palette,
  Cpu,
  Code,
} from "lucide-react";


/* ========= IMAGE CONVERTERS ========= */
export const tools = {
  "image-converter": {
    title: "Image Converter",
    description: "Convert images between JPG, PNG, and WebP formats.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "image-compressor": {
    title: "Image Compressor",
    description: "Reduce image file size while keeping quality.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "image-resizer": {
    title: "Image Resizer",
    description: "Resize images to exact dimensions.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "bulk-image-resizer": {
    title: "Bulk Image Resizer",
    description: "Resize multiple images at once.",
    uploadLabel: "Select multiple images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "image-cropper": {
    title: "Image Cropper",
    description: "Crop images precisely.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "social-media-image-cropper": {
    title: "Social Media Image Cropper",
    description: "Crop images for Instagram, TikTok, LinkedIn.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "watermark-adder": {
    title: "Watermark Adder",
    description: "Add text or logo watermarks to images.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "exif-metadata-remover": {
    title: "EXIF Metadata Remover",
    description: "Remove hidden metadata from images.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "image-blur-pixelate": {
    title: "Image Blur / Pixelate",
    description: "Blur or pixelate sensitive parts of images.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "favicon-generator": {
    title: "Favicon Generator",
    description: "Generate favicons for websites and apps.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },

};
/* ========= PDF TOOLS ========= */
export const pdfTool = {
  "pdf-compressor": {
    title: "PDF Compressor",
    description: "Reduce PDF file size with smart compression.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "pdf-merger": {
    title: "PDF Merger",
    description: "Merge multiple PDFs into one file.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "pdf-splitter": {
    title: "PDF Splitter",
    description: "Split PDF pages into separate files.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "pdf-to-image": {
    title: "PDF to Image",
    description: "Convert PDF pages into images.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "image-to-pdf": {
    title: "Image to PDF",
    description: "Convert images into a PDF file.",
    uploadLabel: "Select images or drop them here",
    accept: "image/*",
    type: "image",
  },
  "pdf-rotator": {
    title: "PDF Rotator",
    description: "Rotate pages in PDF files.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "pdf-protector": {
    title: "PDF Protector",
    description: "Protect PDF files with password and permissions.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
  "pdf-metadata-remover": {
    title: "PDF Metadata Remover",
    description: "Remove metadata from PDF files.",
    uploadLabel: "Select PDF files or drop them here",
    accept: ".pdf",
    type: "pdf",
  },
}
/* ========= DESIGN TOOLS ========= */
export const designTool = {
  "color-palette-generator": {
    title: "Color Palette Generator",
    description: "Generate beautiful color palettes instantly.",
    uploadLabel: "No file upload required",
    accept: "",
    type: "utility",
  },
  "gradient-generator": {
    title: "Gradient Generator",
    description: "Create stunning CSS gradients.",
    uploadLabel: "No file upload required",
    accept: "",
    type: "utility",
  },
  "mockup-generator": {
    title: "Mockup Generator",
    description: "Showcase designs on real devices.",
    uploadLabel: "No file upload required",
    accept: "",
    type: "utility",
  },
  "social-media-templates": {
    title: "Social Media Templates",
    description: "Ready-to-use post templates.",
    uploadLabel: "No file upload required",
    accept: "",
    type: "utility",
  },
  "font-pairing-tool": {
    title: "Font Pairing Tool",
    description: "Find perfect font combinations.",
    uploadLabel: "No file upload required",
    accept: "",
    type: "utility",
  },
}
/* ========= DEVELOPER TOOLS ========= */
export const devTools = {
  "json-formatter-validator": {
    title: "JSON Formatter & Validator",
    description: "Format and validate JSON data.",
    uploadLabel: "Paste your JSON content",
    accept: "",
    type: "utility",
  },
  "code-minifier": {
    title: "Code Minifier",
    description: "Minify HTML, CSS, and JavaScript code.",
    uploadLabel: "Paste your code",
    accept: "",
    type: "utility",
  },
  "base64-encoder-decoder": {
    title: "Base64 Encoder / Decoder",
    description: "Encode or decode Base64 strings.",
    uploadLabel: "Paste text to encode or decode",
    accept: "",
    type: "utility",
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text.",
    uploadLabel: "No input required",
    accept: "",
    type: "utility",
  },
  "uuid-generator": {
    title: "UUID Generator",
    description: "Generate unique UUIDs instantly.",
    uploadLabel: "No input required",
    accept: "",
    type: "utility",
  },
}
export const CardiconMap = {
 
  "Image Converter": <ImageIcon size={18} className="text-blue-600" />,
  "Image Compressor": <Zap size={18} className="text-blue-600" />,
  "Image Resizer": <Crop size={18} className="text-blue-600" />,
  "Bulk Image Resizer": <Crop size={18} className="text-blue-600" />,
  "Image Cropper": <Crop size={18} className="text-blue-600" />,
  "Social Media Image Cropper": <Crop size={18} className="text-blue-600" />,
  "Watermark Adder": <Settings size={18} className="text-blue-600" />,
  "EXIF Metadata Remover": <Settings size={18} className="text-blue-600" />,
  "Image Blur / Pixelate": <Settings size={18} className="text-blue-600" />,
  "Favicon Generator": <ImageIcon size={18} className="text-blue-600" />,

  "PDF Compressor": <Zap size={18} className="text-red-600" />,
  "PDF Merger": <FileText size={18} className="text-red-600" />,
  "PDF Splitter": <FileText size={18} className="text-red-600" />,
  "PDF to Image": <ImageIcon size={18} className="text-red-600" />,
  "Image to PDF": <FileText size={18} className="text-red-600" />,
  "PDF Rotator": <Settings size={18} className="text-red-600" />,
  "PDF Protector": <Lock size={18} className="text-red-600" />,
  "PDF Metadata Remover": <Settings size={18} className="text-red-600" />,

  "Color Palette Generator": <Palette size={18} className="text-purple-600" />,
  "Gradient Generator": <Palette size={18} className="text-purple-600" />,
  "Mockup Generator": <ImageIcon size={18} className="text-purple-600" />,
  "Social Media Templates": <ImageIcon size={18} className="text-purple-600" />,
  "Font Pairing Tool": <Palette size={18} className="text-purple-600" />,

  "JSON Formatter & Validator": <Code size={18} className="text-green-600" />,
  "Code Minifier": <Code size={18} className="text-green-600" />,
  "Base64 Encoder / Decoder": <Code size={18} className="text-green-600" />,
  "Lorem Ipsum Generator": <Cpu size={18} className="text-green-600" />,
  "UUID Generator": <Cpu size={18} className="text-green-600" />,
};

/* ================= SECTIONS ================= */
export const Cardsections = [
  {
    title: "Image Tools",
    basePath: "images",
    subtitle: "Convert, compress and edit images instantly",
    tools: [
      { name: "Image Converter", slug: "image-converter", desc: "Convert images to different formats" },
      { name: "Image Compressor", slug: "image-compressor", desc: "Reduce image size without quality loss" },
      { name: "Image Resizer", slug: "image-resizer", desc: "Resize images without distortion" },
      { name: "Bulk Image Resizer", slug: "bulk-image-resizer", desc: "Resize multiple images at once" },
      { name: "Image Cropper", slug: "image-cropper", desc: "Crop images freely or by aspect ratio" },
      { name: "Social Media Image Cropper", slug: "social-media-image-cropper", desc: "Ready-made formats for Instagram, TikTok, LinkedIn" },
      { name: "Watermark Adder", slug: "watermark-adder", desc: "Add text or logo watermarks" },
      { name: "EXIF Metadata Remover", slug: "exif-metadata-remover", desc: "Remove hidden image data" },
      { name: "Image Blur / Pixelate", slug: "image-blur-pixelate", desc: "Blur or pixelate sensitive areas" },
      { name: "Favicon Generator", slug: "favicon-generator", desc: "Generate favicons for all devices" },
    ],
  },

  {
    title: "PDF Tools",
    basePath: "pdf",
    subtitle: "Fast & secure PDF utilities",
    tools: [
      { name: "PDF Compressor", slug: "pdf-compressor", desc: "Reduce PDF file size" },
      { name: "PDF Merger", slug: "pdf-merger", desc: "Merge multiple PDFs" },
      { name: "PDF Splitter", slug: "pdf-splitter", desc: "Split PDF pages easily" },
      { name: "PDF to Image", slug: "pdf-to-image", desc: "Convert PDF pages to JPG or PNG" },
      { name: "Image to PDF", slug: "image-to-pdf", desc: "Convert images into a PDF file" },
      { name: "PDF Rotator", slug: "pdf-rotator", desc: "Rotate PDF pages" },
      { name: "PDF Protector", slug: "pdf-protector", desc: "Add password and permissions" },
      { name: "PDF Metadata Remover", slug: "pdf-metadata-remover", desc: "Remove hidden PDF data" },
    ],
  },

  {
    title: "Design Tools",
    basePath: "design-tools",
    subtitle: "Create beautiful palettes & gradients",
    tools: [
      { name: "Color Palette Generator", slug: "color-palette-generator", desc: "Extract or generate color palettes" },
      { name: "Gradient Generator", slug: "gradient-generator", desc: "Create CSS and design gradients" },
      { name: "Mockup Generator", slug: "mockup-generator", desc: "Showcase designs on real devices" },
      { name: "Social Media Templates", slug: "social-media-templates", desc: "Ready-to-use post templates" },
      { name: "Font Pairing Tool", slug: "font-pairing-tool", desc: "Find perfect font combinations" },
    ],
  },

  {
    title: "Developer Tools",
    basePath: "developer-tools",
    subtitle: "Useful utilities for developers",
    tools: [
      { name: "JSON Formatter & Validator", slug: "json-formatter-validator", desc: "Format and validate JSON" },
      { name: "Code Minifier", slug: "code-minifier", desc: "Minify HTML, CSS, and JavaScript" },
      { name: "Base64 Encoder / Decoder", slug: "base64-encoder-decoder", desc: "Encode or decode Base64" },
      { name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", desc: "Generate placeholder text" },
      { name: "UUID Generator", slug: "uuid-generator", desc: "Create unique IDs" },
    ],
  },
];
