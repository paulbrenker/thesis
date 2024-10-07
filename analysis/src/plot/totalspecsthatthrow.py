"""
## Specifications that threw bar plot
==============================
"""

import matplotlib.pyplot as plt
import pandas as pd
from communication import (
    save_plot_to_thesis_dir,
    get_linter_results,
    DataFrameMappers,
)


def create_plot():
    """ "
    create a bar plot that shows how many specifications threw in total
    """

    df_was_thrown = get_linter_results(cell_mapper=DataFrameMappers.map_to_thrown)
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(
        df_was_thrown.columns,
        pd.DataFrame.sum(df_was_thrown),
        0.5,
        label="Linterfehler",
    )
    ax.set_xticklabels(df_was_thrown.columns, rotation=45, ha="right")
    ax.grid(True, which="both", linestyle="--", linewidth=0.7)
    ax.set_yscale("log")
    ax.set_xlabel("Linterregeln")
    ax.set_ylabel("Anzahl Spezifikationen")
    ax.legend()
    fig.tight_layout()
    save_plot_to_thesis_dir(filename="totalspecthrownbarplot", fig=fig)
