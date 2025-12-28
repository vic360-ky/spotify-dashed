import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const FileUpload = ({ onUpload, isLoading }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = (files) => {
    const jsonFiles = Array.from(files).filter(file => 
      file.name.endsWith('.json')
    );
    setSelectedFiles(prev => [...prev, ...jsonFiles]);
  };
  
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-spotify-green mb-2">
          Spotify Dashed
        </h1>
        <p className="text-spotify-lightgray">
          Upload your Spotify listening history JSON files to get started
        </p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-spotify-green bg-spotify-green/10' 
            : 'border-spotify-gray hover:border-spotify-green/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto mb-4 text-spotify-green" size={48} />
        
        <p className="text-white mb-2">
          Drag and drop your JSON files here
        </p>
        <p className="text-spotify-lightgray text-sm mb-4">
          or
        </p>
        
        <label className="inline-block px-6 py-3 bg-spotify-green text-spotify-black font-semibold rounded-full cursor-pointer hover:bg-spotify-green/90 transition-colors">
          Browse Files
          <input
            type="file"
            multiple
            accept=".json"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-white font-semibold mb-3">
            Selected Files ({selectedFiles.length})
          </h3>
          
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-spotify-gray p-3 rounded-lg"
              >
                <span className="text-white text-sm truncate flex-1">
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 text-spotify-lightgray hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-spotify-green text-spotify-black font-semibold rounded-full hover:bg-spotify-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upload and Process Files'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;