from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json
import tempfile
from datetime import datetime
from data_processor import SpotifyDataProcessor

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configuration
UPLOAD_FOLDER = 'data'
ALLOWED_EXTENSIONS = {'json'}
MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100MB max file size

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Global data processor instance
processor = SpotifyDataProcessor()


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/upload', methods=['POST'])
def upload_files():
    """
    Upload and process multiple JSON files.
    Returns processed data summary and metadata.
    """
    try:
        # Check if files were sent
        if 'files' not in request.files:
            return jsonify({"error": "No files provided"}), 400
        
        files = request.files.getlist('files')
        
        if not files or files[0].filename == '':
            return jsonify({"error": "No files selected"}), 400
        
        # Parse JSON content from uploaded files
        json_contents = []
        for file in files:
            if file and allowed_file(file.filename):
                try:
                    content = json.load(file)
                    json_contents.append(content)
                except json.JSONDecodeError:
                    return jsonify({"error": f"Invalid JSON in file: {file.filename}"}), 400
            else:
                return jsonify({"error": f"Invalid file type: {file.filename}"}), 400
        
        # Process the data
        processor.load_from_json_content(json_contents)
        
        # Get summary statistics
        stats = processor.get_summary_stats()
        
        # Return full dataset and metadata
        return jsonify({
            "success": True,
            "message": f"Successfully processed {len(files)} file(s)",
            "data": processor.to_dict(),
            "metadata": stats
        })
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/api/data', methods=['GET'])
def get_data():
    """
    Get the current dataset (with optional filtering).
    Query params: start_date, end_date, artist, track
    """
    try:
        if processor.df is None or processor.df.empty:
            return jsonify({"error": "No data loaded"}), 404
        
        # Get filter parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        artist = request.args.get('artist')
        track = request.args.get('track')
        
        # Start with full dataset
        filtered_df = processor.df.copy()
        
        # Apply filters
        if start_date or end_date:
            filtered_df = processor.filter_by_date_range(start_date, end_date)
        
        if artist:
            filtered_df = filtered_df[filtered_df['artistName'] == artist]
        
        if track:
            filtered_df = filtered_df[filtered_df['trackName'] == track]
            if artist:
                filtered_df = filtered_df[filtered_df['artistName'] == artist]
        
        return jsonify({
            "success": True,
            "data": processor.to_dict(filtered_df),
            "count": len(filtered_df)
        })
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get summary statistics for the dataset."""
    try:
        if processor.df is None or processor.df.empty:
            return jsonify({"error": "No data loaded"}), 404
        
        stats = processor.get_summary_stats()
        
        return jsonify({
            "success": True,
            "stats": stats
        })
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    """
    Export filtered data to CSV.
    Expects JSON body with optional filters: start_date, end_date, artist, track
    """
    try:
        if processor.df is None or processor.df.empty:
            return jsonify({"error": "No data loaded"}), 404
        
        # Get filter parameters from request body
        data = request.get_json() or {}
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        artist = data.get('artist')
        track = data.get('track')
        
        # Start with full dataset
        filtered_df = processor.df.copy()
        
        # Apply filters
        if start_date or end_date:
            filtered_df = processor.filter_by_date_range(start_date, end_date)
        
        if artist:
            filtered_df = filtered_df[filtered_df['artistName'] == artist]
        
        if track:
            filtered_df = filtered_df[filtered_df['trackName'] == track]
            if artist:
                filtered_df = filtered_df[filtered_df['artistName'] == artist]
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv')
        processor.export_to_csv(temp_file.name, filtered_df)
        temp_file.close()
        
        # Send file
        return send_file(
            temp_file.name,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'spotify_data_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        )
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/api/top-artists', methods=['GET'])
def get_top_artists():
    """
    Get top N artists by total listening time.
    Query params: limit (default 10), start_date, end_date
    """
    try:
        if processor.df is None or processor.df.empty:
            return jsonify({"error": "No data loaded"}), 404
        
        limit = int(request.args.get('limit', 10))
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Filter by date range if provided
        if start_date or end_date:
            filtered_df = processor.filter_by_date_range(start_date, end_date)
        else:
            filtered_df = processor.df
        
        # Group by artist and sum listening time
        top_artists = (
            filtered_df.groupby('artistName')
            .agg({
                'msPlayed': 'sum',
                'secondsPlayed': 'sum',
                'minutesPlayed': 'sum',
                'hoursPlayed': 'sum'
            })
            .sort_values('msPlayed', ascending=False)
            .head(limit)
            .reset_index()
        )
        
        return jsonify({
            "success": True,
            "data": top_artists.to_dict(orient='records')
        })
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/api/top-tracks', methods=['GET'])
def get_top_tracks():
    """
    Get top N tracks by play count.
    Query params: limit (default 10), start_date, end_date
    """
    try:
        if processor.df is None or processor.df.empty:
            return jsonify({"error": "No data loaded"}), 404
        
        limit = int(request.args.get('limit', 10))
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Filter by date range if provided
        if start_date or end_date:
            filtered_df = processor.filter_by_date_range(start_date, end_date)
        else:
            filtered_df = processor.df
        
        # Group by track and artist, count plays
        top_tracks = (
            filtered_df.groupby(['trackName', 'artistName'])
            .size()
            .reset_index(name='playCount')
            .sort_values('playCount', ascending=False)
            .head(limit)
        )
        
        return jsonify({
            "success": True,
            "data": top_tracks.to_dict(orient='records')
        })
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


if __name__ == '__main__':
    print("Starting Spotify Dashed Backend Server...")
    print("Server will be available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)