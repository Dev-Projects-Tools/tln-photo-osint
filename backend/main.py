from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import aiohttp
import json
from PIL import Image
from io import BytesIO
import base64

load_dotenv()

app = FastAPI(
    title="Photo OSINT API",
    description="Photo analysis and OSINT search prototype for TLN Cybersecurity Challenge 2026",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= ROUTES =============

@app.get("/")
async def root():
    return {
        "message": "Photo OSINT API v1.0.0",
        "endpoints": {
            "health": "/health",
            "upload_photo": "POST /api/photos/upload",
            "analyze_metadata": "POST /api/photos/metadata",
            "reverse_search": "POST /api/search/reverse",
            "location_search": "POST /api/search/location"
        }
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "Photo OSINT Backend"}

@app.post("/api/photos/upload")
async def upload_photo(file: UploadFile = File(...)):
    """
    Upload a photo for OSINT analysis
    """
    try:
        contents = await file.read()
        
        # Validate image
        image = Image.open(BytesIO(contents))
        image_format = image.format
        image_size = len(contents) / 1024  # KB
        
        # Extract basic metadata
        metadata = {
            "filename": file.filename,
            "size_kb": round(image_size, 2),
            "format": image_format,
            "dimensions": image.size,
            "exif_data": extract_exif(image),
            "upload_status": "success"
        }
        
        return metadata
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")

@app.post("/api/photos/metadata")
async def analyze_metadata(file: UploadFile = File(...)):
    """
    Analyze photo metadata for OSINT clues
    """
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents))
        
        exif = extract_exif(image)
        
        return {
            "filename": file.filename,
            "analysis": {
                "format": image.format,
                "size": image.size,
                "mode": image.mode,
                "has_exif": bool(exif),
                "exif_tags": exif,
                "camera_info": extract_camera_info(exif),
                "location_hints": extract_location_hints(exif),
                "timestamp": exif.get("DateTime", "Not found")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/search/reverse")
async def reverse_image_search(query: dict):
    """
    Perform reverse image search (mock implementation)
    """
    search_term = query.get("query", "")
    
    return {
        "query": search_term,
        "search_type": "reverse_image",
        "results": [
            {
                "title": "Match 1 - Similar image found",
                "url": "https://example.com/image1",
                "similarity": 0.95,
                "source": "Web"
            },
            {
                "title": "Match 2 - Related content",
                "url": "https://example.com/image2",
                "similarity": 0.87,
                "source": "Social Media"
            }
        ],
        "total_results": 2
    }

@app.post("/api/search/location")
async def location_search(query: dict):
    """
    Search for location-based OSINT information
    """
    location = query.get("location", "")
    
    return {
        "location_query": location,
        "search_type": "location_osint",
        "results": [
            {
                "name": f"Location info for {location}",
                "coordinates": "Lat/Long placeholder",
                "details": "Street view, landmarks, businesses",
                "sources": ["Maps", "Street View", "News"]
            }
        ]
    }

# ============= HELPER FUNCTIONS =============

def extract_exif(image: Image.Image) -> dict:
    """
    Extract EXIF metadata from image
    """
    exif_data = {}
    try:
        if hasattr(image, '_getexif') and image._getexif() is not None:
            from PIL.ExifTags import TAGS
            exif = image._getexif()
            for tag_id, value in exif.items():
                tag_name = TAGS.get(tag_id, tag_id)
                exif_data[tag_name] = str(value)
    except:
        pass
    return exif_data

def extract_camera_info(exif: dict) -> dict:
    """
    Extract camera information from EXIF data
    """
    return {
        "make": exif.get("Make", "Unknown"),
        "model": exif.get("Model", "Unknown"),
        "lens_model": exif.get("LensModel", "Unknown"),
        "iso": exif.get("ISOSpeedRatings", "Unknown"),
        "aperture": exif.get("FNumber", "Unknown")
    }

def extract_location_hints(exif: dict) -> list:
    """
    Extract location hints from EXIF data
    """
    hints = []
    if exif.get("GPSInfo"):
        hints.append("GPS coordinates found")
    if exif.get("DateTime"):
        hints.append(f"Timestamp: {exif.get('DateTime')}")
    return hints

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
