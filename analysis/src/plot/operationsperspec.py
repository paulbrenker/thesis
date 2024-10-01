"""
## Operations per Specification Plot
=====================
"""

from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns
from communication import save_plot_to_thesis_dir, get_linter_results, DataFrameMappers


def create_plot():
    """
    Get Number of API Operation per Specification and Plot a Distribution
    """
    df_operation_level = get_linter_results(
        ["operation-success-response"], DataFrameMappers.map_to_possible
    )

    operations = df_operation_level.values.flat

    operation_counts = Counter(operations)

    operation_counts_1_to_10 = sum(
        value for value in operation_counts.values() if 0 < value < 11
    )
    operation_counts_11_to_100 = sum(
        value for value in operation_counts.values() if 10 < value < 101
    )
    operation_counts_101_to_500 = sum(
        value for value in operation_counts.values() if 100 < value < 501
    )
    operation_counts_larger_500 = sum(
        value for value in operation_counts.values() if 500 < value
    )

    operation_pie = {}
    operation_pie["1- 10 Operationen"] = operation_counts_1_to_10
    operation_pie["11 - 100 Operationen"] = operation_counts_11_to_100
    operation_pie["101 - 500 Operationen"] = operation_counts_101_to_500
    operation_pie["mehr als 501 Operationen"] = operation_counts_larger_500

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.pie(
        x=operation_pie.values(),
        labels=operation_pie.keys(),
        autopct="%1.1f%%",
        startangle=140,
        colors=sns.color_palette("Set2"),
    )

    save_plot_to_thesis_dir(filename="operationsperspecificationpie", fig=fig)
