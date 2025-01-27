"""
Linter Rule Severity Reassignments Bar Plot Module
==================================================
"""

import matplotlib.pyplot as plt
from communication import save_plot_to_thesis_dir


def assign_color(reassignment):
    """
    assign colors depending on how many levels were skipped
    """
    if reassignment in ["hint -> hint", "warn -> warn", "error -> error"]:
        return "#8BC34A"
    if reassignment in [
        "hint -> warn",
        "warn -> hint",
        "warn -> error",
        "error -> warn",
    ]:
        return "skyblue"

    return "#FF6F61"


def create_plot():
    """
    creating a horizontal bar plot
    """

    fig, ax = plt.subplots(figsize=(10, 6))

    reassignments = {
        "hint -> hint": 4,
        "warn -> warn": 4,
        "error -> error": 1,
        "warn -> error": 13,
        "warn -> hint": 12,
        "hint -> warn": 3,
        "hint -> error": 1,
    }

    labels = list(reassignments.keys())
    counts = list(reassignments.values())
    colors = [assign_color(label) for label in labels]

    ax.barh(labels, counts, color=colors)

    ax.set_xlabel("Anzahl")
    ax.set_ylabel("Reassignments")
    ax.grid(True)

    save_plot_to_thesis_dir("ruleseverityreassignmentbarplot", fig=fig)
