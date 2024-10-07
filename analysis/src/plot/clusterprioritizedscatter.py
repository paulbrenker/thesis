"""
## Cluster Scatterplot Module
=============================
"""

import matplotlib.pyplot as plt

from table import create_clustering
from communication import save_plot_to_thesis_dir


def create_plot():
    """
    create a scatterplot for the clustering
    """
    df_clustered = create_clustering()

    filtered_hint = df_clustered[df_clustered["group"] == "hint"]
    filtered_warn = df_clustered[df_clustered["group"] == "warn"]
    filtered_error = df_clustered[df_clustered["group"] == "error"]

    fig, ax = plt.subplots(figsize=(10, 7))
    ax.scatter(
        x=filtered_hint["idf"],
        y=filtered_hint["diversity"],
        s=[30 for x in range(len(filtered_hint))],
        marker=".",
        alpha=0.6,
        label="hint",
        color="blue",
    )
    ax.scatter(
        x=filtered_warn["idf"],
        y=filtered_warn["diversity"],
        s=[40 for x in range(len(filtered_warn))],
        marker="o",
        alpha=0.7,
        label="warn",
        color="orange",
    )
    ax.scatter(
        x=filtered_error["idf"],
        y=filtered_error["diversity"],
        s=[200 for x in range(len(filtered_error))],
        marker="x",
        alpha=0.5,
        label="error",
        color="red",
    )
    ax.grid(True, which="both", linestyle="--", linewidth=0.7)

    ax.set_xlabel("Relevanz Frequenz")
    ax.set_ylabel("Relevanz Diversität")
    ax.legend()

    save_plot_to_thesis_dir("clusterprioscatter", fig=fig)
