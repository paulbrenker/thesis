"""
## Logging Info Test Module
===========================
"""

import unittest
from unittest.mock import patch, MagicMock
import subprocess
from datetime import datetime
import communication


class TestLoggingInfo(unittest.TestCase):
    """
    Test the logger helper class
    """

    @patch("communication.logging_info.subprocess.check_output")
    def test_get_current_commit_hash_success(self, mock_check_output: MagicMock):
        """
        test get the current commit hash returns successfully
        """
        mock_check_output.return_value = b"abc123\n"

        result = communication.get_current_commit_hash()

        self.assertEqual(result, "abc123")

        mock_check_output.assert_called_once_with(["git", "rev-parse", "HEAD"])

    @patch("communication.logging_info.subprocess.check_output")
    def test_get_current_commit_hash_failure(self, mock_check_output: MagicMock):
        """
        Simulate a CalledProcessError with a specific error message
        """
        mock_check_output.side_effect = subprocess.CalledProcessError(
            returncode=1, cmd="git rev-parse HEAD", output=b"error message"
        )

        result = communication.get_current_commit_hash()

        self.assertEqual(result, "Error: error message")
        mock_check_output.assert_called_once()

    @patch("communication.logging_info.datetime")
    def test_get_current_iso_date(self, mock_datetime: MagicMock):
        """
        Mock the current date/time
        """
        mock_datetime.now.return_value = datetime(2024, 9, 25, 12, 34, 56)

        result = communication.get_current_iso_date()

        self.assertEqual(result, "2024-09-25")
        mock_datetime.now.assert_called_once()


if __name__ == "__main__":
    unittest.main()
