from typing import List, Dict, Any
from datetime import datetime
from dateutil import parser
import re

# Common mappings for log fields
FIELD_MAPPINGS = {
    "timestamp": ["timestamp", "time", "date", "datetime", "log_time", "created_at", "@timestamp"],
    "source_ip": ["source_ip", "src_ip", "sourceip", "client_ip", "ip_address", "src", "ip"],
    "destination_ip": ["destination_ip", "dst_ip", "dest_ip", "dst", "server_ip"],
    "username": ["username", "user", "account", "user_id", "login"],
    "action": ["action", "event", "activity", "operation"],
    "status": ["status", "result", "outcome", "state"],
    "event_type": ["event_type", "type", "category"],
    "port": ["port", "dest_port", "dst_port", "src_port"],
    "protocol": ["protocol", "proto"],
    "message": ["message", "msg", "description", "details", "raw_log"]
}

def normalize_keys(record: Dict[str, Any]) -> Dict[str, Any]:
    """Normalize the keys of a record based on common mappings."""
    normalized = {}
    used_keys = set()
    
    # Try mapping
    for std_field, aliases in FIELD_MAPPINGS.items():
        for alias in aliases:
            # Case insensitive key search
            for actual_key in record.keys():
                if actual_key.lower() == alias and actual_key not in used_keys:
                    normalized[std_field] = record[actual_key]
                    used_keys.add(actual_key)
                    break 
            if std_field in normalized:
                break
                
    # Keep remaining fields as 'unmapped' in message if needed, but for our strict model, we discard or group them
    extra_details = []
    for k, v in record.items():
        if k not in used_keys:
            extra_details.append(f"{k}={v}")
            
    if extra_details and "message" not in normalized:
        normalized["message"] = " ".join(extra_details)
        
    return normalized

def normalize_value_types(record: Dict[str, Any]) -> Dict[str, Any]:
    """Ensure values are of correct types (datetime, int, etc.)"""
    # Timestamp parsing
    if "timestamp" in record and record["timestamp"]:
        try:
            # dateutil parser handles many formats
            dt = parser.parse(str(record["timestamp"]))
            record["timestamp"] = dt
        except:
            record["timestamp"] = datetime.now() # Fallback
    else:
        record["timestamp"] = datetime.now()
        
    # Integer conversions
    if "port" in record and record["port"]:
        try:
            record["port"] = int(float(str(record["port"]).strip()))
        except:
            record["port"] = None
            
    # String conversions for basic fields
    for field in ["source_ip", "destination_ip", "username", "action", "status", "event_type", "protocol", "message"]:
        if field in record and record[field] is not None:
            if pd.isna(record[field]): # If pandas nan somehow passed
                record[field] = None
            else:
                record[field] = str(record[field]).strip()
                
    # Common normalization on values
    if "status" in record and record["status"]:
        status_lower = record["status"].lower()
        if "fail" in status_lower or "denied" in status_lower or "block" in status_lower:
            record["status"] = "failed"
        elif "success" in status_lower or "allow" in status_lower or "accept" in status_lower:
            record["status"] = "success"
            
    return record
    
import pandas as pd

def normalize_logs(parsed_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Takes parsed dicts and normalizes schema and values."""
    normalized_list = []
    for record in parsed_data:
        norm_keys = normalize_keys(record)
        norm_vals = normalize_value_types(norm_keys)
        normalized_list.append(norm_vals)
    return normalized_list
