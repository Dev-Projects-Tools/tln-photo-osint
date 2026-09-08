import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [metadata, setMetadata] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
    setError(null)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a photo first')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setUploading(true)
      const response = await axios.post(`${API_URL}/api/photos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMetadata(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
      setMetadata(null)
    } finally {
      setUploading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a photo first')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setUploading(true)
      const response = await axios.post(`${API_URL}/api/photos/metadata`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMetadata(response.data)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed')
      setMetadata(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>📸 Photo OSINT Analyzer</h1>
        <p className="subtitle">Upload a photo to extract metadata and search for OSINT clues</p>

        <div className="upload-section">
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="fileInput" className="file-label">
            {selectedFile ? selectedFile.name : 'Choose Photo'}
          </label>
        </div>

        <div className="button-group">
          <button onClick={handleUpload} disabled={uploading || !selectedFile} className="btn-primary">
            {uploading ? 'Processing...' : '📤 Upload Photo'}
          </button>
          <button onClick={handleAnalyze} disabled={uploading || !selectedFile} className="btn-secondary">
            {uploading ? 'Analyzing...' : '🔍 Analyze Metadata'}
          </button>
        </div>

        {error && (
          <div className="error-box">
            ❌ {error}
          </div>
        )}

        {metadata && (
          <div className="results-box">
            <h2>📊 Analysis Results</h2>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="info-card">
        <h3>🎯 About Photo OSINT</h3>
        <p>
          This tool helps you extract metadata from photos and perform OSINT searches.
          Use it to find location clues, camera information, timestamps, and more.
        </p>
        <p className="api-url">API: <code>{API_URL}</code></p>
      </div>
    </div>
  )
}

export default App
