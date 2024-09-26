"""
Visualize total azure errors
"""

from matplotlib import pyplot as plt
import pandas as pd
import numpy as np
from communication import (
    save_plot_to_thesis_dir,
    get_linter_results,
    DataFrameMappers,
)


def create_plot():
    """
    create barplot about azure handling of their own guidelines
    """

    azure_excluded_rules = [
        "operation-tags",
        "no-$ref-siblings",
        "openapi-tags",
        "operation-description",
        "info-contact",
        "operation-tag-defined",
    ]

    df_azure = get_linter_results(
        column_limiter=azure_excluded_rules,
        cell_mapper=DataFrameMappers.map_to_thrown,
        index_limiter="azure.com",
    )

    df_else = get_linter_results(
        column_limiter=azure_excluded_rules,
        cell_mapper=DataFrameMappers.map_to_thrown,
    )

    bar_width = 0.3
    index = np.arange(len(df_azure.columns))

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(
        index - bar_width / 2,
        pd.DataFrame.sum(df_azure),
        bar_width - 0.05,
        label="Azure Linterfehler",
    )
    ax.bar(
        index + bar_width / 2,
        pd.DataFrame.sum(df_else),
        bar_width - 0.05,
        label="Andere Linterfehler",
    )
    ax.set_xticks(index)
    ax.set_xticklabels(df_azure.columns, rotation=45, ha="right")
    ax.grid(True, which="both", linestyle="--", linewidth=0.7)
    ax.set_yscale("log")
    ax.set_xlabel("Linterregeln, die von Azure Spectral Regelwerk ignoriert werden")
    ax.set_ylabel("Anzahl Spezifikationen")
    ax.legend()
    ax.set_title("Kumulativ Azure Spezifikationen, die Linterfehler")
    fig.tight_layout()
    save_plot_to_thesis_dir(filename="azurespecthrownbarplot", fig=fig)
