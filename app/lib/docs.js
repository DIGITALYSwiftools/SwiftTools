import {
  RefreshCcw,
  Shrink,
  Move,
  Layers,
  Crop,
  LayoutGrid,
  Droplet,
  Stamp,
  EyeOff,
  ImagePlus,
  Code,
  Image,

  Archive,
  Images,
  Merge,
  ShieldOff,
  RotateCw,
  Scissors,

  Palette,
  Smartphone,
  Blend,
  Type,

  Braces,
  Zap,
  Lock,
  FileText,
  Fingerprint,
  ChevronLeft
} from "lucide-react";
 export const tools = [
    // Image Tools (10)
    {
      id: "image-converter",
      name: "Image Converter",
      category: "image",
      icon: <RefreshCcw className="w-6 h-6" />,
      tagline: "Convert images instantly without quality loss",
      description:
        "Convert images between JPG, PNG, and WebP formats instantly. Secure, fast, and processed locally on our servers. No watermark, no signup required.",

      detailedGuide: `## How to Use Image Converter

1. **Upload** an image file (JPG, PNG, WebP)
2. **Select** conversion type (e.g. JPG → PNG)
3. **Click Convert**
4. **Download** the converted image instantly

### Supported Conversions
- JPG → PNG
- PNG → JPG
- JPG → WebP
- PNG → WebP
- WebP → JPG
- WebP → PNG

### Features
- High-quality Sharp engine
- Metadata preserved
- Instant processing
- Secure file handling

### Best Use Cases
- Convert images for websites
- Optimize assets for performance
- Prepare images for social media
- Change formats without quality loss`,

      features: [
        "Supports JPG, PNG, WebP",
        "Fast Sharp-based conversion",
        "No watermark",
        "Preserves image quality",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/v1/image/convert",

      requestFormat: {
        type: "multipart/form-data  or image url",
        fields: {
          file: "Image file",
          conversionType: "jpg-to-png | png-to-jpg | jpg-to-webp | png-to-webp | webp-to-jpg | webp-to-png"
        }
      },

      freeLimits: "10 conversions/day",
      premiumBenefits: [
        "Unlimited conversions",
        "Batch processing",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 95
    }
    ,
    {
      id: "image-compressor",
      name: "Image Compressor",
      category: "image",
      icon: <Shrink className="w-6 h-6" />,
      tagline: "Compress JPG, PNG, and WebP images with adjustable quality",
      description:
        "Reduce image file size while preserving quality. Supports JPG, PNG, and WebP formats with customizable compression quality. Fast, secure, and no watermark or signup required.",

      detailedGuide: `## How to Use Image Compressor

1. **Upload** a JPG, PNG, or WebP image file
2. (Optional) **Set** quality from 1 (lowest) to 100 (highest). Default is 70.
3. **Click Compress**
4. **Download** the compressed image instantly

### Supported Formats
- JPG / JPEG
- PNG
- WebP

### Features
- Adjustable compression quality
- Maintains original image format
- Fast and secure Sharp processing
- No watermark or signup needed

### Best Use Cases
- Optimize images for web performance
- Reduce storage space
- Prepare images for sharing or uploading`,

      features: [
        "Supports JPG, PNG, WebP formats",
        "Adjustable compression quality (1–100)",
        "Preserves original format",
        "Fast Sharp-based processing",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/upload/imageCompressor",

      requestFormat: {
        type: "multipart/form-data or image URls",
        fields: {
          file: "Image file (JPG, PNG, or WebP)",
          quality: "Optional compression quality (1–100), default 70"
        }
      },

      freeLimits: "10 compressions/day",
      premiumBenefits: [
        "Unlimited compressions",
        "Higher quality options",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 93
    }
    ,
    {
      id: "image-resizer",
      name: "Image Resizer",
      category: "image",
      icon: <Move className="w-6 h-6" />,
      tagline: "Resize images without distortion",
      description:
        "Resize single images to any width and height without losing quality. Fast, secure, and processed on our servers. No watermark or signup required.",

      detailedGuide: `## How to Use Image Resizer

1. **Upload** an image file
2. **Specify** desired width and height
3. **Click Resize**
4. **Download** the resized image instantly

### Features
- Resize images to exact dimensions
- Maintains aspect ratio without distortion if proportions are correct
- Fast and secure processing
- Supports PNG output

### Best Use Cases
- Prepare images for websites and apps
- Fit images into specific design layouts
- Standardize image dimensions for profiles or thumbnails`,

      features: [
        "Supports single image upload",
        "Exact width and height resizing",
        "Fast Sharp-based processing",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/upload/imageResizer",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image file (single)",
          width: "Target width (number)",
          height: "Target height (number)"
        }
      },

      freeLimits: "10 resizes/day",
      premiumBenefits: [
        "Unlimited resizes",
        "Higher priority processing",
        "Batch processing"
      ],

      proFeature: false,
      popularity: 90
    }
    ,
    {
      id: "bulk-image-resizer",
      name: "Bulk Image Resizer",
      category: "image",
      icon: <Layers className="w-6 h-6" />,
      tagline: "Resize multiple images at once",
      description:
        "Upload multiple images and resize them all at once to your specified width and height. Processed securely and quickly on our servers without watermark.",

      detailedGuide: `## How to Use Bulk Image Resizer

1. **Upload** multiple image files
2. **Specify** width and height for resizing
3. **Click Resize**
4. **Download** all resized images individually or as a batch

### Features
- Upload multiple images in one go
- Resize all images to uniform dimensions
- Secure and fast processing
- Outputs resized images as PNG in base64 or downloadable batch

### Best Use Cases
- Prepare image galleries with uniform sizes
- Bulk resize product photos
- Optimize images for faster page loading`,

      features: [
        "Supports multiple image uploads",
        "Uniform width and height resizing",
        "Batch processing support",
        "Fast Sharp engine",
        "No watermark"
      ],

      apiEndpoint: "POST /api/upload/imageResizer",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image files (multiple)",
          width: "Target width (number)",
          height: "Target height (number)"
        }
      },

      freeLimits: "5 bulk jobs/day",
      premiumBenefits: [
        "Unlimited bulk jobs",
        "Priority processing",
        "Batch ZIP downloads"
      ],

      proFeature: true,
      popularity: 85
    }
    ,
    {
      id: "image-cropper",
      name: "Image Cropper",
      category: "image",
      icon: <Crop className="w-6 h-6" />,
      tagline: "Crop images freely or by aspect ratio",
      description:
        "Crop images to any size or aspect ratio you need. Easily trim unwanted parts of your photos and focus on what matters. Secure and fast cropping with no watermark.",

      detailedGuide: `## How to Use Image Cropper

1. **Upload** an image file
2. **Select** crop dimensions or aspect ratio
3. **Click Crop**
4. **Download** the cropped image instantly

### Features
- Freeform cropping or preset aspect ratios
- Fast and secure server-side processing
- No watermark or signup required

### Best Use Cases
- Crop profile pictures and avatars
- Prepare images for social media formats
- Remove unwanted background areas`,

      features: [
        "Supports single image cropping",
        "Freeform and preset aspect ratios",
        "Fast Sharp-based cropping",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/upload/imageResizer",

      requestFormat: {
        type: "multipart/form-data or image Urls  ",
        fields: {
          file: "Image file",
          cropWidth: "Crop width (number)",
          cropHeight: "Crop height (number)",
          startX: "Start X coordinate (optional)",
          startY: "Start Y coordinate (optional)"
        }
      },

      freeLimits: "10 crops/day",
      premiumBenefits: [
        "Unlimited crops",
        "Priority processing",
        "Batch cropping"
      ],

      proFeature: false,
      popularity: 88
    }
    ,
    {
      id: "social-media-image-cropper",
      name: "Social Image Cropper",
      category: "image",
      icon: <LayoutGrid className="w-6 h-6" />,
      tagline: "Crop images to popular social media formats instantly",
      description:
        "Crop images to optimized sizes for Instagram, TikTok, LinkedIn, and more. Choose from preset aspect ratios and dimensions tailored for social media platforms. Fast, secure, and watermark-free.",

      detailedGuide: `## How to Use Social Media Image Cropper

1. **Upload** your image file
2. **Select** a social media platform or preset crop size (e.g., Instagram Post 1:1, TikTok Video 9:16)
3. **Click Crop**
4. **Download** the perfectly sized image for your social media

### Supported Platforms & Aspect Ratios
- Instagram Post (1:1)
- Instagram Story (9:16)
- TikTok Video Cover (9:16)
- LinkedIn Banner (4:1)
- Facebook Cover (16:9)

### Features
- Preset social media crop sizes
- Fast, server-side Sharp cropping
- No watermark or signup required
- Secure file handling

### Best Use Cases
- Prepare profile pictures and posts for social media
- Create perfectly sized cover photos and thumbnails
- Save time cropping manually`,

      features: [
        "Preset crop sizes for major social platforms",
        "Fast Sharp-based cropping",
        "No watermark",
        "Secure uploads",
        "One-click cropping for social media"
      ],

      apiEndpoint: "POST /api/upload/imageResizer",

      requestFormat: {
        type: "multipart/form-data or image URL",
        fields: {
          file: "Image file",
          preset: `"instagram-post" | "instagram-story" | "tiktok-video" | "linkedin-banner" | "facebook-cover"`
        }
      },

      freeLimits: "10 crops/day",
      premiumBenefits: [
        "Unlimited crops",
        "Additional platform presets",
        "Batch cropping"
      ],

      proFeature: false,
      popularity: 90
    },
    {
      id: "image-blur",
      name: "Image Blur",
      category: "image",
      icon: <Droplet className="w-6 h-6" />,
      tagline: "Apply adjustable blur effect to images instantly",
      description:
        "Blur your images smoothly with a customizable blur amount. Supports common image formats, processed quickly and securely with no watermark or signup required.",

      detailedGuide: `## How to Use Image Blur

1. **Upload** an image file (JPG, PNG, WebP, etc.)
2. (Optional) **Set** blur amount (default is 5; higher values = more blur)
3. **Click Blur**
4. **Download** the blurred image instantly

### Features
- Adjustable blur effect
- Supports multiple image formats
- Fast server-side processing with Sharp
- No watermark or signup needed
- Secure file handling

### Best Use Cases
- Create artistic blur effects
- Obscure sensitive parts of images
- Add background blur to photos`,

      features: [
        "Supports JPG, PNG, WebP and more",
        "Adjustable blur radius",
        "Fast Sharp-based processing",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api//upload/imageBlur",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image file",
          blur: "Optional blur amount (number), default 5"
        }
      },

      freeLimits: "10 blurs/day",
      premiumBenefits: [
        "Unlimited blurs",
        "Higher blur radius options",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 87
    }

    ,
    {
      id: "image-watermark",
      name: "Image Watermark",
      category: "image",
      icon: <Stamp className="w-6 h-6" />,
      tagline: "Add text or logo watermarks to your images easily",
      description:
        "Securely add customizable text or logo watermarks to your images. Choose watermark position and adjust size automatically. Fast processing with no watermark added by us or signup required.",

      detailedGuide: `## How to Use Image Watermark

1. **Upload** an image file
2. Choose watermark type: **Text** or **Logo**
3. For text watermark: enter the watermark text
4. For logo watermark: upload a logo image file
5. (Optional) Select watermark position (default: bottom-right)
6. **Click Apply**
7. **Download** the watermarked image instantly

### Supported Watermark Positions
- top-left, top-right, bottom-left, bottom-right (default)
- top, bottom, left, right, center

### Features
- Add text or logo watermarks
- Automatic logo resizing
- Choose watermark position
- Fast Sharp-based image processing
- No signup or hidden watermark

### Best Use Cases
- Protect images with brand logos
- Add copyright text
- Mark images for social media or portfolios`,

      features: [
        "Supports text and logo watermarks",
        "Automatic logo resizing (max 150x150 px)",
        "Multiple watermark positions",
        "Fast Sharp processing",
        "No added watermark from service",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/upload/image-watermark",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image file to watermark",
          watermarkType: "'text' | 'logo'",
          watermarkText: "Text to use as watermark (required if watermarkType is 'text')",
          watermarkLogo: "Logo image file (required if watermarkType is 'logo')",
          position: "Watermark position: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right', 'center' (default 'bottom-right')"
        }
      },

      freeLimits: "10 watermarkings/day",
      premiumBenefits: [
        "Unlimited watermarking",
        "Custom watermark sizes",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 89
    }

    ,
    {
      id: "remove-exif-metadata",
      name: "Remove EXIF Metadata",
      category: "image",
      icon: <EyeOff className="w-6 h-6" />,
      tagline: "Strip all EXIF metadata from images instantly and securely",
      description:
        "Remove EXIF metadata from JPG, PNG, WebP, and other images to protect privacy and reduce file size. Fast, secure processing without any watermark or signup required.",

      detailedGuide: `## How to Use Remove EXIF Metadata

1. **Upload** your image file (JPG, PNG, WebP, etc.)
2. **Click Remove Metadata**
3. **Download** the image instantly without any EXIF data

### Features
- Removes all EXIF metadata safely
- Supports JPG, PNG, WebP and more
- Fast processing using Sharp
- No watermark or signup needed

### Best Use Cases
- Protect location and device info in photos
- Reduce file size by stripping metadata
- Prepare images for public sharing or online use`,

      features: [
        "Supports JPG, PNG, WebP and more",
        "Complete removal of EXIF metadata",
        "Fast Sharp-based processing",
        "No watermark added",
        "Secure and private file handling"
      ],

      apiEndpoint: "POST /api/upload/remove-exif",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image file to remove EXIF metadata from"
        }
      },

      freeLimits: "10 removals/day",
      premiumBenefits: [
        "Unlimited metadata removals",
        "Batch processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 86
    }
    ,
    {
      id: "favicon-generator",
      name: "Favicon Generator",
      category: "image",
      icon: <ImagePlus className="w-6 h-6" />,
      tagline: "Generate all favicon formats and a ZIP package instantly",
      description:
        "Create comprehensive favicon packages including icons for web, Android, Apple, Windows, and more. Upload any image and get a ready-to-use ZIP with all necessary files and HTML snippets. Fast, secure, and no signup required.",

      detailedGuide: `## How to Use Favicon Generator

1. **Upload** an image file (preferably square PNG or JPG)
2. **Click Generate**
3. **Download** a ZIP file containing favicons for multiple platforms
4. Use the included HTML snippet to embed favicons in your website

### Features
- Generates favicons for web, Android, Apple, Windows, etc.
- Includes HTML snippet for easy integration
- Outputs a ZIP file with all assets
- Fast processing and secure upload

### Best Use Cases
- Quickly generate favicon sets for websites and apps
- Support all major platforms with one upload
- Save time on favicon creation and coding`,

      features: [
        "Supports any image upload",
        "Generates multiple favicon formats",
        "Includes HTML snippet",
        "Outputs ZIP archive with all files",
        "No signup or watermark"
      ],

      apiEndpoint: "POST /api/upload/favicon",

      requestFormat: {
        type: "multipart/form-data or image URLs",
        fields: {
          file: "Image file (PNG, JPG, etc.) to generate favicons from"
        }
      },

      freeLimits: "5 favicon generations/day",
      premiumBenefits: [
        "Unlimited favicon generations",
        "Faster processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 88
    }
    ,

    // PDF Tools (6)
    {
      id: "pdf-compressor",
      name: "PDF Compressor",
      category: "pdf",
      icon: <Archive className="w-6 h-6" />,
      tagline: "Compress PDF files to reduce size quickly",
      description:
        "Upload a PDF file and get a compressed version with optimized size by removing unnecessary metadata and objects. Fast, secure, and no watermark or signup required.",

      detailedGuide: `## How to Use PDF Compressor

1. **Upload** a PDF file
2. **Click Compress**
3. **Download** the compressed PDF instantly

### Features
- Removes unnecessary metadata
- Optimizes PDF structure
- Fast compression using pdf-lib
- No watermark or signup needed

### Best Use Cases
- Reduce file size for easier sharing
- Optimize PDFs for web or email
- Maintain readable quality while compressing`,

      features: [
        "Compress PDF files",
        "Remove unnecessary metadata",
        "Fast pdf-lib processing",
        "No watermark",
        "Secure upload handling"
      ],

      apiEndpoint: "POST /api/pdf/compress",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Single PDF file to compress"
        }
      },

      freeLimits: "10 compressions/day",
      premiumBenefits: [
        "Unlimited compressions",
        "Batch compression",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 88
    },
    {
      id: "images-to-pdf",
      name: "Images to PDF",
      category: "pdf",
      icon: <Images className="w-6 h-6" />,
      tagline: "Convert multiple images into a single PDF with A4 pages",
      description:
        "Upload up to 5 images (JPG, PNG, WebP) to convert and merge into a single PDF file. Each image is scaled to fit A4 size while preserving aspect ratio. Fast and easy with no watermark or signup.",

      detailedGuide: `## How to Use Images to PDF Converter

1. **Upload** up to 5 image files (JPG, PNG, WebP)
2. **Click Convert**
3. **Download** a single PDF containing all images as A4 pages

### Features
- Supports JPG, PNG, WebP images
- Scales images to A4 pages maintaining aspect ratio
- Validates image types and file size
- Fast processing with pdf-lib
- No watermark or signup needed

### Best Use Cases
- Create PDF portfolios or reports from images
- Combine photos into a single document
- Prepare images for printing or sharing`,

      features: [
        "Convert multiple images to PDF",
        "Supports JPG, PNG, WebP",
        "Max 5 images per conversion",
        "Scaled to A4 page size",
        "Fast and secure processing",
        "No watermark"
      ],

      apiEndpoint: "POST /api/pdf/images-to-pdf",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Array of image files (max 5)"
        }
      },

      freeLimits: "10 conversions/day",
      premiumBenefits: [
        "Unlimited conversions",
        "Support for more image formats",
        "Batch processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 90
    }
    , {
      id: "pdf-merger",
      name: "PDF Merger",
      category: "pdf",
      icon: <Merge className="w-6 h-6" />,
      tagline: "Merge multiple PDF files into one easily",
      description:
        "Combine two or more PDF files into a single PDF document. Upload multiple PDFs and get a merged output quickly with no watermark or signup.",

      detailedGuide: `## How to Use PDF Merger

1. **Upload** at least 2 PDF files
2. **Click Merge**
3. **Download** the merged PDF document

### Features
- Merge multiple PDF files into one
- Maintains original page order and content
- Fast processing using pdf-lib
- No watermark or signup needed

### Best Use Cases
- Combine reports, contracts, or documents
- Create single PDFs from multiple sources
- Simplify document management`,

      features: [
        "Merge multiple PDFs",
        "Maintains page order",
        "Fast pdf-lib processing",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/pdf/merge",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Array of PDF files (minimum 2)"
        }
      },

      freeLimits: "10 merges/day",
      premiumBenefits: [
        "Unlimited merges",
        "Batch processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 89
    },
    {
      id: "pdf-metadata-remover",
      name: "Metadata Remover",
      category: "pdf",
      icon: <ShieldOff className="w-6 h-6" />,
      tagline: "Remove sensitive metadata from your PDF files",
      description:
        "Clean PDFs by stripping out metadata such as author, title, keywords, and creation dates. Supports aggressive cleaning mode to deep-clean all metadata, annotations, and form data.",

      detailedGuide: `## How to Use PDF Metadata Remover

1. **Upload** a PDF file (max 50MB)
2. **Choose** cleaning mode (normal or aggressive)
3. **Download** the cleaned PDF without metadata

### Features
- Removes common metadata fields (title, author, subject, etc.)
- Aggressive mode recreates PDF without annotations and forms
- Supports encrypted PDFs (excludes password-protected)
- Fast and secure with no watermark

### Best Use Cases
- Protect privacy by removing sensitive info
- Prepare PDFs for public release
- Reduce file size by cleaning metadata`,

      features: [
        "Remove title, author, keywords, creation/modification dates",
        "Aggressive mode for deep metadata removal",
        "Supports encrypted PDFs (except password-protected)",
        "No watermark",
        "Fast processing"
      ],

      apiEndpoint: "POST /api/pdf/metadata-remove",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Single PDF file",
          aggressive: "Optional boolean ('true' for deep cleaning)"
        }
      },

      freeLimits: "10 cleans/day",
      premiumBenefits: [
        "Unlimited cleans",
        "Batch processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 92
    },
    {
      id: "pdf-rotator",
      name: "PDF Rotator",
      category: "pdf",
      icon: <RotateCw className="w-6 h-6" />,
      tagline: "Rotate all pages in your PDF file easily",
      description:
        "Upload a PDF and rotate all pages by 90, 180, or 270 degrees. Supports large files up to 50MB with fast, secure processing and no watermark.",

      detailedGuide: `## How to Use PDF Rotator

1. **Upload** a PDF file (max 50MB)
2. **Select** rotation angle (90, 180, or 270 degrees)
3. **Download** the rotated PDF with all pages adjusted

### Features
- Rotate entire PDF pages at once
- Supports large PDFs up to 50MB
- Handles corrupted or invalid PDFs gracefully
- No watermark or signup required

### Best Use Cases
- Fix wrongly oriented PDF pages
- Prepare documents for printing or presentation
- Rotate scanned documents easily`,

      features: [
        "Rotate pages by 90, 180, or 270 degrees",
        "Supports PDFs up to 50MB",
        "Fast processing with pdf-lib",
        "No watermark",
        "Secure file handling"
      ],

      apiEndpoint: "POST /api/pdf/rotate",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Single PDF file",
          rotation: "'90' | '180' | '270' (default '90')"
        }
      },

      freeLimits: "10 rotations/day",
      premiumBenefits: [
        "Unlimited rotations",
        "Batch processing",
        "Priority support"
      ],

      proFeature: false,
      popularity: 90
    },
    {
      id: "pdf-splitter",
      name: "PDF Splitter",
      category: "pdf",
      icon: <Scissors className="w-6 h-6" />,
      tagline: "Split PDF files into individual pages with ease",
      description:
        "Upload up to 5 PDF files and receive a ZIP archive with each page split into its own PDF. Includes summary files and a global README for easy navigation.",

      detailedGuide: `## How to Use PDF Splitter

1. **Upload** up to 5 PDF files (max 50MB each)
2. **Click Split**
3. **Download** a ZIP containing individual page PDFs for each file

### Features
- Split PDFs page-by-page into separate files
- Supports up to 5 PDFs per request
- Generates summary text files per PDF
- Includes a global README file in ZIP archive
- Fast and secure with no watermark

### Best Use Cases
- Extract individual pages from large PDFs
- Share specific pages separately
- Prepare PDFs for detailed review or annotation`,

      features: [
        "Split PDFs into single-page PDFs",
        "Up to 5 PDFs per batch",
        "ZIP archive output",
        "Summary and README files included",
        "No watermark"
      ],

      apiEndpoint: "POST /api/pdf/splitter",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          files: "Array of PDF files (max 5)"
        }
      },

      freeLimits: "5 splits/day",
      premiumBenefits: [
        "Unlimited splits",
        "Larger batch sizes",
        "Priority support"
      ],

      proFeature: false,
      popularity: 87
    }
    ,

    // Design Tools (5)

    {
      id: "color-palette-generator",
      name: "Color Palette Generator",
      category: "design",
      icon: <Palette className="w-6 h-6" />,
      tagline: "Extract beautiful color palettes from images instantly",
      description:
        "Upload an image and automatically extract its dominant colors. The tool generates a clean visual PNG palette with color blocks only—perfect for designers, branding, and UI inspiration.",

      detailedGuide: `## How to Use Color Palette Generator

1. **Upload** an image (JPG, PNG, or WebP – max 20MB)
2. **Choose** number of colors to extract (optional)
3. **Click Generate**
4. **Download** a PNG palette image

### Features
- Extracts dominant colors using median cut quantization
- Filters out near-duplicate colors for cleaner palettes
- Automatically sorts colors by brightness
- Generates a pure visual palette (no text or labels)

### Best Use Cases
- UI & UX design inspiration
- Branding and logo color selection
- Social media and marketing visuals
- Creating consistent color systems`,

      features: [
        "Dominant color extraction",
        "Brightness-based color sorting",
        "Duplicate color filtering",
        "PNG visual palette output",
        "No text or labels"
      ],

      apiEndpoint: "POST /api/design/color-palette",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          file: "Image file (JPG, PNG, WebP – max 20MB)",
          colorCount: "Number of colors (optional, 3–12, default: 6)"
        }
      },

      freeLimits: "10 palettes/day",
      premiumBenefits: [
        "Unlimited palette generation",
        "Higher color accuracy",
        "Priority processing"
      ],

      proFeature: false,
      popularity: 82
    }
    ,
    {
      id: "mockup-generator",
      name: "Mockup Generator",
      category: "design",
      icon: <Smartphone className="w-6 h-6" />,
      tagline: "Create realistic mockups for devices, apparel, and print",
      description:
        "Generate high-quality mockups by placing your design into professional device, apparel, or print templates. Perfect for presentations, portfolios, and marketing visuals.",

      detailedGuide: `## How to Use Mockup Generator

1. **Upload** your design or screenshot image (max 10MB)
2. **Select** a mockup template (phone, laptop, apparel, etc.)
3. **Customize** rotation, shadows, and background (optional)
4. **Generate & Download** the mockup image

### Features
- Supports phones, laptops, tablets, apparel, and print mockups
- Automatic image scaling and cropping
- Realistic shadows and device frames
- Optional rotation and reflection effects
- High-resolution JPEG output

### Best Use Cases
- App and website presentations
- Product marketing visuals
- Portfolio and client previews
- Social media and advertising creatives`,

      features: [
        "Multiple mockup categories",
        "Automatic image fitting",
        "Realistic shadows and frames",
        "Optional rotation and reflections",
        "High-quality JPEG output"
      ],

      apiEndpoint: "POST /api/design/mockup",

      requestFormat: {
        type: "multipart/form-data",
        fields: {
          file: "Design image (JPG, PNG, WebP – max 10MB)",
          mockupId: "Template ID (optional, default: iphone15)",
          rotation: "Rotation angle (-45 to 45 degrees)",
          shadowIntensity: "Shadow opacity (0–1)",
          showReflection: "Boolean (phones & tablets only)",
          backgroundColor: "Hex color (optional)"
        }
      },

      freeLimits: "5 mockups/day",
      premiumBenefits: [
        "Unlimited mockups",
        "All premium templates",
        "Higher resolution exports",
        "Priority rendering"
      ],

      proFeature: true,
      popularity: 91
    },
    {
      id: "gradient-generator",
      name: "Gradient Generator",
      category: "design",
      icon: <Blend className="w-6 h-6" />,
      tagline: "Create beautiful CSS gradients visually",
      description:
        "Generate linear and radial gradients using an interactive color picker. Instantly copy CSS code for use in websites and designs.",

      detailedGuide: `## How to Use Gradient Generator

1. **Pick** two or more colors
2. **Choose** gradient type (linear or radial)
3. **Adjust** angle and positions
4. **Copy** generated CSS code

### Features
- Linear & radial gradients
- Live preview
- One-click CSS copy
- Custom angle and color stops

### Best Use Cases
- Website backgrounds
- Buttons & UI elements
- Hero sections`,

      features: [
        "Linear & radial gradients",
        "Live visual preview",
        "CSS output",
        "Custom angles",
        "Unlimited colors"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 78
    },
    {
      id: "font-pairing-tool",
      name: "Font Pairing Tool",
      category: "design",
      icon: <Type className="w-6 h-6" />,
      tagline: "Find perfect font combinations instantly",
      description:
        "Discover beautiful font pairings for headings and body text. Preview combinations live and choose the best match for your design.",

      detailedGuide: `## How to Use Font Pairing Tool

1. **Select** a heading font
2. **Preview** suggested body fonts
3. **Adjust** size and weight
4. **Copy** font names or CSS

### Features
- Hand-picked font combinations
- Live text preview
- Heading & body pairing
- Google Fonts support

### Best Use Cases
- Website typography
- Branding projects
- UI & UX design`,

      features: [
        "Predefined font pairs",
        "Live preview text",
        "Heading & body pairing",
        "Modern typography sets"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 74
    },
    // developer tools
    {
      id: "json-formatter-validator",
      name: "JSON Formatter",
      category: "developer",
      icon: <Braces className="w-6 h-6" />,
      tagline: "Format and validate JSON effortlessly",
      description:
        "Paste raw JSON to instantly format, beautify, and validate it. Errors are highlighted for easy debugging.",

      detailedGuide: `## How to Use JSON Formatter

1. **Paste** your JSON
2. **Click Format**
3. **View** beautified output or errors

### Features
- Pretty print JSON
- Syntax error detection
- One-click copy

### Best Use Cases
- API debugging
- Config file cleanup
- Data inspection`,

      features: [
        "JSON validation",
        "Pretty formatting",
        "Error highlighting",
        "Copy formatted output"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 90
    }
    ,
    {
      id: "code-minifier",
      name: "Code Minifier",
      category: "developer",
      icon: <Zap className="w-6 h-6" />,
      tagline: "Minify HTML, CSS, and JavaScript code",
      description:
        "Reduce file size by removing unnecessary spaces, comments, and line breaks from your code.",

      detailedGuide: `## How to Use Code Minifier

1. **Paste** your code
2. **Select** language (HTML, CSS, JS)
3. **Click Minify**
4. **Copy** optimized output

### Features
- HTML, CSS, JS support
- Instant results
- Copy-ready output`,

      features: [
        "HTML minification",
        "CSS minification",
        "JavaScript minification",
        "Fast processing"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 85
    }
    , {
      id: "base64-encoder-decoder",
      name: "Base64 Encoder",
      category: "developer",
      icon: <Lock className="w-6 h-6" />,
      tagline: "Encode or decode Base64 strings",
      description:
        "Quickly convert text to Base64 or decode Base64 back to readable text using your browser.",

      detailedGuide: `## How to Use Base64 Tool

1. **Enter** text or Base64 string
2. **Choose** encode or decode
3. **Copy** the result

### Features
- Encode & decode instantly
- No data leaves your browser
- Unicode support`,

      features: [
        "Base64 encoding",
        "Base64 decoding",
        "Client-side processing",
        "Secure & fast"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 80
    }
    , {
      id: "lorem-ipsum-generator",
      name: "Lorem Ipsum Generator",
      category: "developer",
      icon: <FileText className="w-6 h-6" />,
      tagline: "Generate placeholder text instantly",
      description:
        "Create dummy text for layouts, wireframes, and designs with customizable length.",

      detailedGuide: `## How to Use Lorem Ipsum Generator

1. **Choose** paragraphs or words
2. **Set** quantity
3. **Generate & copy** text

### Features
- Paragraphs or words
- Custom length
- One-click copy`,

      features: [
        "Paragraph generation",
        "Word-based generation",
        "Instant copy",
        "No API required"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 72
    },
    {
      id: "uuid-generator",
      name: "UUID Generator",
      category: "developer",
      icon: <Fingerprint className="w-6 h-6" />,
      tagline: "Generate unique identifiers instantly",
      description:
        "Generate UUID v4 values directly in your browser for databases, APIs, and testing.",

      detailedGuide: `## How to Use UUID Generator

1. **Click Generate**
2. **Copy** UUID instantly

### Features
- UUID v4 standard
- Browser-based generation
- No duplicates`,

      features: [
        "UUID v4 generation",
        "Instant output",
        "Copy to clipboard",
        "Client-side only"
      ],

      frontendOnly: true,
      proFeature: false,
      popularity: 76
    }


  ];