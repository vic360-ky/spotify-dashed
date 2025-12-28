import pandas as pd
import json
from datetime import datetime
from typing import List, Dict, Any
import os


class SpotifyDataProcessor:
    """Process and aggregate Spotify listening history JSON files."""
    
    def __init__(self):
        self.df = None
        self.raw_data = []
    
    def load_json_files(self, file_paths: List[str]) -> pd.DataFrame:
        """
        Load and aggregate multiple JSON files into a single DataFrame.
        
        Args:
            file_paths: List of paths to JSON files
            
        Returns:
            Processed pandas DataFrame
        """
        all_records = []
        
        for file_path in file_paths:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                    # Handle both single object and array of objects
                    if isinstance(data, list):
                        all_records.extend(data)
                    else:
                        all_records.append(data)
                        
            except Exception as e:
                print(f"Error loading {file_path}: {str(e)}")
                continue
        
        if not all_records:
            raise ValueError("No valid records found in provided files")
        
        # Create DataFrame
        self.df = pd.DataFrame(all_records)
        
        # Process the data
        self._process_data()
        
        return self.df
    
    def load_from_json_content(self, json_contents: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Load JSON content directly (for uploaded files).
        
        Args:
            json_contents: List of parsed JSON objects/arrays
            
        Returns:
            Processed pandas DataFrame
        """
        all_records = []
        
        for content in json_contents:
            if isinstance(content, list):
                all_records.extend(content)
            else:
                all_records.append(content)
        
        if not all_records:
            raise ValueError("No valid records found in provided data")
        
        self.df = pd.DataFrame(all_records)
        self._process_data()
        
        return self.df
    
    def _process_data(self):
        """Process the DataFrame: convert dates, calculate time units, extract date parts."""
        
        # Convert endTime to datetime
        self.df['endTime'] = pd.to_datetime(self.df['endTime'])
        
        # Calculate time in different units
        self.df['secondsPlayed'] = self.df['msPlayed'] / 1000
        self.df['minutesPlayed'] = self.df['secondsPlayed'] / 60
        self.df['hoursPlayed'] = self.df['minutesPlayed'] / 60
        
        # Extract date components for filtering and grouping
        self.df['date'] = self.df['endTime'].dt.date
        self.df['hour'] = self.df['endTime'].dt.hour
        self.df['dayOfWeek'] = self.df['endTime'].dt.dayofweek
        self.df['weekOfYear'] = self.df['endTime'].dt.isocalendar().week
        self.df['month'] = self.df['endTime'].dt.to_period('M')
        self.df['year'] = self.df['endTime'].dt.year
        
        # Sort by endTime
        self.df = self.df.sort_values('endTime').reset_index(drop=True)
    
    def get_date_range(self) -> Dict[str, str]:
        """Get the min and max dates in the dataset."""
        if self.df is None or self.df.empty:
            return {"min_date": None, "max_date": None}
        
        return {
            "min_date": self.df['date'].min().isoformat(),
            "max_date": self.df['date'].max().isoformat()
        }
    
    def get_available_dates(self) -> List[str]:
        """Get list of all unique dates that have data."""
        if self.df is None or self.df.empty:
            return []
        
        return sorted([d.isoformat() for d in self.df['date'].unique()])
    
    def get_summary_stats(self) -> Dict[str, Any]:
        """Get summary statistics about the dataset."""
        if self.df is None or self.df.empty:
            return {}
        
        return {
            "total_records": len(self.df),
            "unique_artists": self.df['artistName'].nunique(),
            "unique_tracks": self.df['trackName'].nunique(),
            "total_ms_played": int(self.df['msPlayed'].sum()),
            "total_seconds_played": float(self.df['secondsPlayed'].sum()),
            "total_minutes_played": float(self.df['minutesPlayed'].sum()),
            "total_hours_played": float(self.df['hoursPlayed'].sum()),
            "date_range": self.get_date_range(),
            "available_dates": self.get_available_dates()
        }
    
    def filter_by_date_range(self, start_date: str = None, end_date: str = None) -> pd.DataFrame:
        """
        Filter DataFrame by date range.
        
        Args:
            start_date: ISO format date string (YYYY-MM-DD)
            end_date: ISO format date string (YYYY-MM-DD)
            
        Returns:
            Filtered DataFrame
        """
        if self.df is None or self.df.empty:
            return pd.DataFrame()
        
        filtered_df = self.df.copy()
        
        if start_date:
            start = pd.to_datetime(start_date).date()
            filtered_df = filtered_df[filtered_df['date'] >= start]
        
        if end_date:
            end = pd.to_datetime(end_date).date()
            filtered_df = filtered_df[filtered_df['date'] <= end]
        
        return filtered_df
    
    def filter_by_artist(self, artist_name: str) -> pd.DataFrame:
        """Filter DataFrame by artist name."""
        if self.df is None or self.df.empty:
            return pd.DataFrame()
        
        return self.df[self.df['artistName'] == artist_name].copy()
    
    def filter_by_track(self, track_name: str, artist_name: str = None) -> pd.DataFrame:
        """
        Filter DataFrame by track name and optionally artist.
        
        Args:
            track_name: Name of the track
            artist_name: Optional artist name for more specific filtering
        """
        if self.df is None or self.df.empty:
            return pd.DataFrame()
        
        filtered_df = self.df[self.df['trackName'] == track_name].copy()
        
        if artist_name:
            filtered_df = filtered_df[filtered_df['artistName'] == artist_name]
        
        return filtered_df
    
    def to_dict(self, df: pd.DataFrame = None) -> List[Dict[str, Any]]:
        """
        Convert DataFrame to list of dictionaries for JSON serialization.
        
        Args:
            df: DataFrame to convert (uses self.df if None)
        """
        if df is None:
            df = self.df
        
        if df is None or df.empty:
            return []
        
        # Convert to dict and handle datetime/date serialization
        records = df.copy()
        records['endTime'] = records['endTime'].dt.strftime('%Y-%m-%dT%H:%M:%SZ')
        records['date'] = records['date'].astype(str)
        records['month'] = records['month'].astype(str)
        
        return records.to_dict(orient='records')
    
    def export_to_csv(self, filepath: str, df: pd.DataFrame = None):
        """
        Export DataFrame to CSV file.
        
        Args:
            filepath: Path to save CSV
            df: DataFrame to export (uses self.df if None)
        """
        if df is None:
            df = self.df
        
        if df is None or df.empty:
            raise ValueError("No data to export")
        
        export_df = df.copy()
        export_df['endTime'] = export_df['endTime'].dt.strftime('%Y-%m-%d %H:%M:%S')
        export_df['date'] = export_df['date'].astype(str)
        
        export_df.to_csv(filepath, index=False)