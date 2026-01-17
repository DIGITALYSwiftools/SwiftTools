// "use client";
// import { useParams } from "next/navigation";
// import { useState } from "react";
// import { pdfTool } from "../../lib/tools";


// export default function PdfToolPage() {
//   const { slug } = useParams();
//   const tool = pdfTool[slug];

//   const [files, setFiles] = useState([]);

//   if (!tool) return <p>Invalid PDF Tool</p>;

//   const handleConvert = async () => {
//     if (!files.length) return alert("Select file");
//     // await convertFile(files[0], slug); // auto-download
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6">
//       <h1 className="text-2xl font-bold">{tool.title}</h1>
//       <p className="text-gray-600 mb-4">{tool.description}</p>

//       <input
//         type="file"
//         accept={tool.accept}
//         multiple={slug === "pdf-merger"}
//         onChange={(e) => setFiles([...e.target.files])}
//         className="mb-4"
//       />

//       <button
//         onClick={handleConvert}
//         className="bg-black text-white px-4 py-2"
//       >
//         Convert
//       </button>
//     </div>
//   );
// }
