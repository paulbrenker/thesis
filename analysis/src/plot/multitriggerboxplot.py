"""
## Boxplot for Multi Trigger Inverts. Null values are cast out.
===============================================================
"""

import matplotlib.pyplot as plt
import seaborn as sns

from communication import (
    ColumnLimiters,
    get_linter_results,
    DataFrameMappers,
    save_plot_to_thesis_dir,
)


def create_plot():
    """
    create the Boxplot
    """

    column_limiter = [
        rule
        for rule in ColumnLimiters.get_multi_trigger()
        if rule not in ColumnLimiters.get_problematic()
    ]

    df_inverse = get_linter_results(
        column_limiter=column_limiter, cell_mapper=DataFrameMappers.map_to_inverse
    )

    box_columns = [
        (column, df_inverse.loc[df_inverse[column] != 0][column])
        for column in df_inverse.columns
        if len(df_inverse.loc[df_inverse[column] != 0][column]) > 0
    ]

    fig, ax = plt.subplots(figsize=(10, 7))
    bplot = ax.boxplot(x=[data[1] for data in box_columns], patch_artist=True)
    ax.set_xticklabels([data[0] for data in box_columns], rotation=45, ha="right")
    ax.grid(True, which="both", linestyle="--", linewidth=0.5)
    ax.set_xlabel("Linterregeln")
    ax.set_ylabel("Relative Häufigkeit der geworfenen Linterfehler")
    ax.legend()

    colors = sns.color_palette("Set1", n_colors=len(box_columns))
    for box in bplot["boxes"]:
        box.set_facecolor(colors.pop())
    fig.tight_layout()

    save_plot_to_thesis_dir("boxplotcleanmultitrigger", fig=fig)
