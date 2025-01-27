"""
## Plot Exporter Module
=====================
"""

import logging
import os
import matplotlib.pyplot as plt
from matplotlib.figure import Figure

logger = logging.getLogger(__name__)


def save_plot_to_thesis_dir(filename: str, fig: Figure):
    """
    Save a Plot in the tex/thesis/img directory.
    Preset Resolution = 600dpi
    """
    thesis_img_dir = os.path.join("..", "tex", "thesis", "img")

    if not os.path.exists(thesis_img_dir):
        raise FileNotFoundError(f"the given directory {thesis_img_dir} does not exist")

    file_path = os.path.join(thesis_img_dir, filename)

    fig.savefig(file_path, dpi=600)
    plt.close("all")
    logger.info("Plot saved to %s", file_path)
