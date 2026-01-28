"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast, { Toaster } from "react-hot-toast";

const baseWords = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit",
  "sed","do","eiusmod","tempor","incididunt","ut","labore","et","dolore",
  "magna","aliqua","ut","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","ut","aliquip","ex","ea",
  "commodo","consequat","duis","aute","irure","dolor","in","reprehenderit",
  "in","voluptate","velit","esse","cillum","dolore","eu","fugiat","nulla",
  "pariatur","excepteur","sint","occaecat","cupidatat","non","proident",
  "sunt","in","culpa","qui","officia","deserunt","mollit","anim","id","est","laborum"
];

function generateText(paragraphs, wordsPerPara) {
  let result = [];
  for (let p = 0; p < paragraphs; p++) {
    let words = [];
    for (let w = 0; w < wordsPerPara; w++) {
      const word = baseWords[Math.floor(Math.random() * baseWords.length)];
      words.push(word);
    }
    let sentence = words.join(" ");
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    result.push(sentence);
  }
  return result.join("\n\n");
}

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [words, setWords] = useState(30);
  const [output, setOutput] = useState(generateText(3, 30));

  const generate = () => {
    setOutput(generateText(paragraphs, words));
  };

  const copyText = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied!");
  };

  return (
    <>
      <div className="text-black bg-linear-to-r from-[#f8f7ff] via-[#faf5f5] to-[#fffdf5] min-h-screen">
        <div className="mx-auto max-w-md px-3 py-4">
          <Toaster position="top-center" />
          <Navbar />

          {/* Header */}
          <div className="text-center mb-3 mt-24">
            <h1 className="text-lg sm:text-2xl font-bold">Lorem Ipsum Generator</h1>
            <p className="text-[11px] sm:text-sm text-gray-600">
              Generate placeholder text for UI, designs & layouts
            </p>
          </div>

          {/* Main Card */}
          <div className="rounded-xl p-3 shadow-sm bg-white space-y-3">

            {/* Controls */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-medium">Paragraphs</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(+e.target.value)}
                  className="px-2 py-1 border-dotted border-2 border-gray-400 rounded text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">Words / Para</label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={words}
                  onChange={(e) => setWords(+e.target.value)}
                  className="px-2 py-1 border-dotted border-2 border-gray-400 rounded text-xs"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              className="w-full rounded-lg border-2  border-black bg-black text-white py-2 text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Generate Text
            </button>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Generated Text</span>
                <button
                  onClick={copyText}
                  className="px-2 py-1 text-[10px] border-2  border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                >
                  Copy
                </button>
              </div>

              <textarea
                value={output}
                readOnly
                className="w-full h-72 p-2 border-2 border-dotted border-gray-400 rounded-lg text-[11px] resize-none bg-gray-50"
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
