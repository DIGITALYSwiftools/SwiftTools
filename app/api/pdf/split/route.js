import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data
async function parseFormData(request) {
  const formData = await request.formData();
  const files = formData.getAll('files');
  const conversionType = formData.get('conversionType');
  
  return { files, conversionType };
}

// Helper function to validate PDF files
function validateFiles(files) {
  if (!files || files.length === 0) {
    throw new Error('No files provided');
  }

  if (files.length > 5) {
    throw new Error('Maximum 5 files allowed');
  }

  for (const file of files) {
    // Check file type
    const isPDF = file.type === 'application/pdf' || 
                  file.name.toLowerCase().endsWith('.pdf');
    
    if (!isPDF) {
      throw new Error('Only PDF files are allowed');
    }

    // Check file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error(`File ${file.name} exceeds 50MB limit`);
    }
  }
}

// Split PDF into individual pages
async function splitPDF(pdfBytes, fileName) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pageCount = pdfDoc.getPageCount();
  const splitPDFs = [];
  
  // Create a separate PDF for each page
  for (let i = 0; i < pageCount; i++) {
    // Create new PDF document
    const newPdfDoc = await PDFDocument.create();
    
    // Copy the page to new document
    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
    newPdfDoc.addPage(copiedPage);
    
    // Save the new PDF
    const pdfBytes = await newPdfDoc.save();
    splitPDFs.push({
      name: `${fileName.replace('.pdf', '')}_page_${i + 1}.pdf`,
      data: pdfBytes,
      pageNumber: i + 1
    });
  }
  
  return splitPDFs;
}

export async function POST(request) {
  try {
    // Parse form data
    const { files } = await parseFormData(request);
    
    // Validate files
    validateFiles(files);
    
    // Create ZIP archive
    const zip = new JSZip();
    
    // Process each PDF file
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const fileName = file.name;
      
      // Split the PDF
      const splitPDFs = await splitPDF(fileBuffer, fileName);
      
      // Add split PDFs to ZIP
      const baseFolderName = fileName.replace('.pdf', '');
      
      for (const pdf of splitPDFs) {
        zip.file(`${baseFolderName}/${pdf.name}`, pdf.data);
      }
      
      // Also add a summary file
      const summary = `PDF: ${fileName}\nTotal Pages: ${splitPDFs.length}\nSplit Pages:\n` +
        splitPDFs.map(p => `  - ${p.name}`).join('\n');
      zip.file(`${baseFolderName}/_summary.txt`, summary);
    }
    
    // Add a global README
    zip.file('README.txt', 
      'PDF Splitter - Individual Page PDFs\n' +
      '===================================\n\n' +
      `Total PDFs processed: ${files.length}\n` +
      `Processed at: ${new Date().toISOString()}\n\n` +
      'Each PDF file has been split into individual pages.\n' +
      'Each page is saved as a separate PDF file.\n'
    );
    
    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    // Return ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="split_pdfs_${Date.now()}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('PDF split error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to split PDF',
        details: error.message 
      },
      { status: error.message.includes('Maximum') || error.message.includes('Only PDF') ? 400 : 500 }
    );
  }
}

// GET method for API documentation
export async function GET() {
  return NextResponse.json({
    description: 'PDF Splitter API',
    usage: 'POST PDF files to split each page into separate PDFs',
    parameters: {
      files: 'PDF files to split (max 5 files)',
      conversionType: 'Should be "pdf-splitter"'
    },
    returns: 'ZIP file containing individual page PDFs'
  });
}