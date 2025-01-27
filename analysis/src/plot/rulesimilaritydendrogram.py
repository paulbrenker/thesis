"""
## Rule Similarity Dendrogram
=====================
"""

import matplotlib.pyplot as plt
from scipy.spatial.distance import pdist
from scipy.cluster.hierarchy import dendrogram, linkage
from communication import save_plot_to_thesis_dir, get_linter_results, DataFrameMappers


def create_plot():
    """
    create a dendrogram with jaccards distace for rules thrown
    """
    df_transformed = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)

    distance_matrix = pdist(df_transformed.T, metric="jaccard")
    linked = linkage(distance_matrix, method="complete")

    fig, ax = plt.subplots(figsize=(10, 10))
    dendrogram(
        linked,
        orientation="top",
        distance_sort="descending",
        show_leaf_counts=True,
        labels=df_transformed.columns,
        ax=ax,
    )
    ax.set_xticklabels(df_transformed.columns, rotation=45, ha="right")
    ax.grid(True, which="both", linestyle="--", linewidth=0.7)
    ax.set_xlabel("Linterregeln")
    ax.set_ylabel("Jaccard Ähnlichkeit")
    fig.tight_layout()
    save_plot_to_thesis_dir(filename="hierarchicalclusteronbinary", fig=fig)
