"""
## Plot Exporter Test Module
===========================
"""

import unittest
from unittest.mock import patch, MagicMock
import os
from matplotlib.figure import Figure
import communication


class TestSavePlotToThesisDir(unittest.TestCase):
    """
    Test the global figure saving function
    """

    @patch("communication.plot_exporter.os.path.exists")
    @patch("communication.plot_exporter.plt.close")
    def test_save_plot_success(
        self,
        mock_close: MagicMock,
        mock_exists: MagicMock,
    ):
        """
        assert that the plt savefig function is called correctly
        """
        mock_exists.return_value = True

        mock_fig = MagicMock(spec=Figure)

        filename = "test_plot.png"
        communication.save_plot_to_thesis_dir(filename, mock_fig)

        expected_thesis_img_dir = os.path.join(
            "..", "tex", "thesis", "img", "test_plot.png"
        )
        mock_fig.savefig.assert_called_once_with(expected_thesis_img_dir, dpi=600)
        mock_close.assert_called_once_with("all")

    @patch("communication.plot_exporter.os.path.exists")
    def test_directory_not_exist(self, mock_exists):
        """
        assert FileNotFoundError can be thrown
        """
        mock_exists.return_value = False

        mock_fig = MagicMock(spec=Figure)

        with self.assertRaises(FileNotFoundError):
            communication.save_plot_to_thesis_dir("test_plot.png", mock_fig)


if __name__ == "__main__":
    unittest.main()
