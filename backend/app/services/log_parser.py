import pandas as pd
import json
from typing import List, Dict, Any
from io import StringIO
import re

def parse_csv(content: str) -> List[Dict[str, Any]]:
    """Parse CSV content securely into a list of dictionaries."""
    try:
        # Use pandas to read CSV string securely and interpret appropriately
        df = pd.read_csv(StringIO(content))
        # Handle nan values by replacing with None
        df = df.where(pd.notnull(df), None)
        return df.to_dict('records')
    except Exception as e:
        raise ValueError(f"Failed to parse CSV: {str(e)}")

def parse_json(content: str) -> List[Dict[str, Any]]:
    """Parse JSON content securely. Looks for list of objects."""
    try:
        data = json.loads(content)
        if isinstance(data, dict):
            # Try to see if there is a 'logs' or 'events' key
            for key in ['logs', 'events', 'data']:
                if key in data and isinstance(data[key], list):
                    return data[key]
            # Wrap standard dict
            return [data]
        elif isinstance(data, list):
            return data
        else:
            raise ValueError("JSON data must be a list of objects or an object containing a list.")
    except Exception as e:
        raise ValueError(f"Failed to parse JSON: {str(e)}")

def parse_txt(content: str) -> List[Dict[str, Any]]:
    """Basic unstructured log parsing into pseudo-key-value."""
    # Will do best effort splitting
    lines = content.strip().split("\n")
    results = []
    
    # Try to find key=value pairs
    kv_pattern = re.compile(r'(\w+)=("[^"]*"|\S+)')
    
    for line in lines:
        if not line.strip():
            continue
        
        matches = kv_pattern.findall(line)
        if matches:
            record = {}
            for k, v in matches:
                record[k] = v.strip('"')
            results.append(record)
        else:
            # If no KV structure, just put as message
            results.append({"message": line})
            
    return results

def parse_log_content(content: str, filename: str) -> List[Dict[str, Any]]:
    """Entry point for parsing log file content based on extension heuristics or content."""
    filename = filename.lower()
    
    if filename.endswith('.csv'):
        return parse_csv(content)
    elif filename.endswith('.json'):
        return parse_json(content)
    else:
        # Txt or generic .log
        # Often logs might be comma-separated or space-separated.
        # Check if first line looks like a CSV header
        first_line = content.partition('\n')[0]
        if ',' in first_line and len(first_line.split(',')) > 3:
            try:
                return parse_csv(content)
            except:
                pass
        
        # Try JSON
        try:
            return parse_json(content)
        except:
            pass
            
        # Fallback to key-value or raw
        return parse_txt(content)
