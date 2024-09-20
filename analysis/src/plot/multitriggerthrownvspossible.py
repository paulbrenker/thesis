"""
## Multi Trigger Twin Bar Plot
==============================
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from communication import (
    save_plot_to_thesis_dir,
    get_linter_results,
    DataFrameMappers,
    ColumnLimiters,
)


def create_plot():
    """
    Create a bar plot with twin bars that show thrown errors and possible errors mean per rule
    """
    column_limiter = [
        rule
        for rule in ColumnLimiters.get_multi_trigger()
        if rule not in ColumnLimiters.get_problematic()
    ]
    df_thrown = get_linter_results(
        column_limiter=column_limiter, cell_mapper=DataFrameMappers.map_to_thrown
    )
    df_possible = get_linter_results(
        column_limiter=column_limiter, cell_mapper=DataFrameMappers.map_to_possible
    )

    fig, ax = plt.subplots(figsize=(10, 12))
    bar_width = 0.3
    index = np.arange(len(df_possible.columns))

    ax.bar(
        index - bar_width / 2,
        pd.DataFrame.mean(df_thrown).values,
        bar_width - 0.05,
        label="geworfene Linterfehler",
    )
    ax.bar(
        index + bar_width / 2,
        pd.DataFrame.mean(df_possible).values,
        bar_width - 0.05,
        label="mögliche Linterfehler",
    )
    ax.set_xticks(index)
    ax.set_xticklabels(df_thrown.columns, rotation=45, ha="right")
    ax.grid(True, which="both", linestyle="--", linewidth=0.5)
    ax.set_yscale("log")
    ax.set_xlabel("Linterregeln")
    ax.set_ylabel("Arithmetisches Mittel Linterfehler")
    ax.legend()
    ax.set_title("Multi Trigger Säulendiagramm")
    fig.tight_layout()
    save_plot_to_thesis_dir(filename="multitriggerbarplot", fig=fig)
