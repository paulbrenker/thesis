"""
Distribution of Rule Prioritizations Module
============================================
"""

import matplotlib.pyplot as plt
from communication import save_plot_to_thesis_dir


def create_plot():
    """
    create the histogram for distributions
    """
    freq = [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0.33333,
        0.16666,
        0.14285,
        0.111111,
        0.090909,
        0.090909,
        0.083333,
        0.024390,
        0.022222,
        0.022222,
        0.017241,
        0.012658,
        0.000424,
        0.000435,
        0.006289,
        0.000457,
        0.006536,
        0.001669,
        0.002347,
        0.000992,
        0.002632,
        0.002066,
        0.001096,
        0.001927,
    ]
    div = [
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.375,
        0.025194,
        0.026171,
        0.028361,
        0.029349,
        0.029397,
        0.034471,
        0.027007,
        0.032167,
        0.035357,
        0.036551,
        0.031494,
        0.038016,
        0.040815,
        0.074276,
        0.073718,
        0.049300,
        0.067871,
        0.042196,
        0.059269,
        0.054599,
        0.059835,
        0.052863,
        0.049029,
        0.046861,
        0.043539,
    ]
    comb = [
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.875,
        0.805039,
        0.271901,
        0.139006,
        0.120156,
        0.094768,
        0.079621,
        0.078129,
        0.073100,
        0.026584,
        0.025088,
        0.024077,
        0.021396,
        0.018290,
        0.015194,
        0.015092,
        0.014892,
        0.013940,
        0.013668,
        0.013189,
        0.012798,
        0.012761,
        0.012678,
        0.011459,
        0.010249,
        0.010249,
    ]

    fig, ax = plt.subplots(figsize=(7, 5))
    ax.hist(
        [freq, div, comb],
        bins=14,
        alpha=0.7,
        label=["Relevanz Frequenz", "Relevanz Diversität", "Relevanz Kombiniert"],
        range=[0, 1],
    )

    plt.axvline(
        0.395,
        color="black",
        linestyle=":",
        linewidth=2,
        label="Max. Relevanz Diversität",
    )

    ax.set_xlabel("Relevanz")
    ax.set_ylabel("Anzahl der Regeln")
    ax.grid(True)
    ax.legend(loc="upper center")
    save_plot_to_thesis_dir("priodistrhist", fig)
