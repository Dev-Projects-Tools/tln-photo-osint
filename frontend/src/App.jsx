import React, { useState } from 'react'
import PhotoUpload from './components/PhotoUpload'
import MetadataAnalyzer from './components/MetadataAnalyzer'
import SearchResults from './components/SearchResults'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedFile, setSelectedFile] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileSelected = (file) => {
    setSelectedFile(file)
    setAnalysisResults(null)
  }

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results)
    setActiveTab('results')
  }

  return (
    <div className="container">
      <header>
        <h1>🔍 Photo OSINT</h1>
        <p>Photo Analysis & OSINT Search Prototype - TLN Cybersecurity Challenge 2026</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Photo
        </button>
        <button 
          className={`tab-button ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
          disabled={!selectedFile}
        >
          🔎 Analyze Metadata
        </button>
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
          disabled={!analysisResults}
        >
          📊 Results
        </button>
      </div>

      <main>
        {activeTab === 'upload' && (
          <PhotoUpload onFileSelected={handleFileSelected} />
        )}
        
        {activeTab === 'analyze' && selectedFile && (
          <MetadataAnalyzer 
            file={selectedFile} 
            onAnalysisComplete={handleAnalysisComplete}
            loading={loading}
            setLoading={setLoading}
          />
        )}
        
        {activeTab === 'results' && analysisResults && (
          <SearchResults results={analysisResults} />
        )}
      </main>
    </div>
  )
}

export default App
