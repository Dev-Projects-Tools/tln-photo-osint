import React, { useState } from 'react'
import axios from 'axios'

function MetadataAnalyzer({ file, onAnalysisComplete, loading, setLoading }) {
  const [metadataResults, setMetadataResults] = useState(null)
  const [error, setError] = useState(null)

  const analyzeMetadata = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      setError(null)
      const response = await axios.post('/api/photos/metadata', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMetadataResults(response.data)
      onAnalysisComplete(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      
      <button onClick={analyzeMetadata} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Metadata'}
      </button>

      {metadataResults && (
        <div className="card">
          <h3>Metadata Analysis Results</h3>
          <p><strong>File:</strong> {metadataResults.filename}</p>
          
          <h4>Image Information</h4>
          <p><strong>Format:</strong> {metadataResults.analysis.format}</p>
          <p><strong>Dimensions:</strong> {metadataResults.analysis.size[0]} x {metadataResults.analysis.size[1]} px</p>
          <p><strong>Color Mode:</strong> {metadataResults.analysis.mode}</p>
          
          {metadataResults.analysis.camera_info && (
            <>
              <h4>Camera Information</h4>
              <p><strong>Make:</strong> {metadataResults.analysis.camera_info.make}</p>
              <p><strong>Model:</strong> {metadataResults.analysis.camera_info.model}</p>
              <p><strong>Lens:</strong> {metadataResults.analysis.camera_info.lens_model}</p>
            </>
          )}
          
          {metadataResults.analysis.location_hints.length > 0 && (
            <>
              <h4>Location Hints</h4>
              {metadataResults.analysis.location_hints.map((hint, idx) => (
                <p key={idx}>• {hint}</p>
              ))}
            </>
          )}
          
          <p><strong>Timestamp:</strong> {metadataResults.analysis.timestamp}</p>
        </div>
      )}
    </div>
  )
}

export default MetadataAnalyzer
