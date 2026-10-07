# Database Documentation

This directory contains the SQLite database files for the AI Cybersecurity Incident Investigator project.

## Architecture
The application uses SQLite during development via SQLAlchemy as the ORM.

## Tables
1. **log_files**: Metadata about uploaded log files.
2. **log_events**: Raw parsed events from the logs.
3. **incidents**: Correlated security incidents.
4. **detections**: Individual heuristic rule matches.
5. **investigations**: Saved AI context and chat history.
6. **reports**: Finalized Markdown reports.

To view or manage the database manually, you can use DB Browser for SQLite on the `investigator.db` file.
