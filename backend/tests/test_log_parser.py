import pytest
from app.services.log_parser import parse_csv

def test_parse_csv():
    content = 'timestamp,source_ip,action,status\n2024-01-01,192.168.1.1,login,failed'
    res = parse_csv(content)
    assert len(res) == 1
    assert res[0]['source_ip'] == '192.168.1.1'
