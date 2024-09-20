"""
## Logger Info Module
======================
"""

import subprocess
from datetime import datetime


def get_current_commit_hash():
    """
    get current git commit hash as a string
    """
    try:
        commit_hash = (
            subprocess.check_output(["git", "rev-parse", "HEAD"])
            .strip()
            .decode("utf-8")
        )
        return commit_hash
    except subprocess.CalledProcessError as e:
        return f"Error: {e.output.decode('utf-8')}"


def get_current_iso_date():
    """
    get the Date as ISO String
    """
    current_iso_date = datetime.now().isoformat()
    return current_iso_date.split("T")[0]
