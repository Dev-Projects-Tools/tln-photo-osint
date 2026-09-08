import React, { useState } from 'react'
import axios from 'axios'

function SearchResults({ results }) {
  const [reverseSearchResults, setReverseSearchResults] = useState(null)
  const [locationSearchResults, setLocationSearchResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const performReverseSearch = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/search/reverse', {
        query: results.filename
      })
      setReverseSearchResults(response.data)
    } catch (err) {
      console.error('Reverse search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const performLocationSearch = async () => {
    try {
      setLoading(true)
      const locationHint = results.analysis?.location_hints?.[0] || 'Unknown Location'
      const response = await axios.post('/api/search/location', {
        location: locationHint
      })
      setLocationSearchResults(response.data)
    } catch (err) {
      console.error('Location search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <h3>Analysis Summary</h3>
        <p><strong>File:</strong> {results.filename}</p>
        <p><strong>Dimensions:</strong> {results.analysis.size[0]} x {results.analysis.size[1]} px</p>
        <p><strong>Format:</strong> {results.analysis.format}</p>
        {results.analysis.timestamp !== 'Not found' && (
          <p><strong>Date Taken:</strong> {results.analysis.timestamp}</p>
        )}
      </div>

      <div className="card">
        <h3>OSINT Search Options</h3>
        <button onClick={performReverseSearch} disabled={loading}>
          🔄 Reverse Image Search
        </button>
        <button onClick={performLocationSearch} disabled={loading}>
          🗺️ Location Search
        </button>
      </div>

      {reverseSearchResults && (
        <div className="card">
          <h3>Reverse Search Results</h3>
          <p><strong>Query:</strong> {reverseSearchResults.query}</p>
          <p><strong>Type:</strong> {reverseSearchResults.search_type}</p>
          <p><strong>Results Found:</strong> {reverseSearchResults.total_results}</p>
          
          <div className="results-grid">
            {reverseSearchResults.results.map((result, idx) => (
              <div key={idx} className="card">
                <h4>{result.title}</h4>
                <p><strong>Similarity:</strong> {(result.similarity * 100).toFixed(0)}%</p>
                <p><strong>Source:</strong> {result.source}</p>
                <a href={result.url} target="_blank" rel="noopener noreferrer">View Result →</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {locationSearchResults && (
        <div className="card">
          <h3>Location Search Results</h3>
          <p><strong>Query:</strong> {locationSearchResults.location_query}</p>
          <p><strong>Type:</strong> {locationSearchResults.search_type}</p>
          
          {locationSearchResults.results.map((result, idx) => (
            <div key={idx} className="card">
              <h4>{result.name}</h4>
              <p><strong>Coordinates:</strong> {result.coordinates}</p>
              <p><strong>Details:</strong> {result.details}</p>
              <p><strong>Sources:</strong> {result.sources.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults
