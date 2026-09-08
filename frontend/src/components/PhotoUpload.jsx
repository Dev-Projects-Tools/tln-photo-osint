import React, { useState } from 'react'
import axios from 'axios'

function PhotoUpload({ onFileSelected }) {
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadStatus({ type: 'error', message: 'Please select a valid image file' })
      return
    }
    
    setSelectedFile(file)
    onFileSelected(file)
    setUploadStatus({ type: 'success', message: `Selected: ${file.name}` })
  }

  const uploadPhoto = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      setUploadStatus({ type: 'loading', message: 'Uploading...' })
      const response = await axios.post('/api/photos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadResult(response.data)
      setUploadStatus({ type: 'success', message: 'Upload successful!' })
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.response?.data?.detail || 'Upload failed' 
      })
    }
  }

  return (
    <div>
      <div 
        className={`upload-section ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          id="file-input"
          type="file" 
          accept="image/*" 
          onChange={handleFileInputChange}
        />
        <label htmlFor="file-input" className="upload-label">
          📸 Drag & drop your photo here or click to browse
        </label>
      </div>

      {uploadStatus && (
        <div className={`${uploadStatus.type}-message`}>
          {uploadStatus.type === 'loading' ? (
            <span className="loading"></span>
          ) : null}
          {' '}{uploadStatus.message}
        </div>
      )}

      {selectedFile && (
        <div className="card">
          <h3>Selected Photo</h3>
          <p><strong>Filename:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
          <p><strong>Type:</strong> {selectedFile.type}</p>
          <button onClick={uploadPhoto}>Upload & Scan</button>
        </div>
      )}

      {uploadResult && (
        <div className="card">
          <h3>Upload Result</h3>
          <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default PhotoUpload
