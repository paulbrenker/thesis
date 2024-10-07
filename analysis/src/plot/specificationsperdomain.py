"""
## Specifications per Domain Pie Chart Module
=============================================
"""

from collections import Counter
import matplotlib.pyplot as plt
import seaborn as sns
from communication import save_plot_to_thesis_dir, get_linter_results


def extract_domain_name(file_path: str) -> str:
    """
    Get the Provider Domain Name from a File Path of an APIsguru OpenAPI Specification
    """
    return file_path.split("/")[4]


def create_plot():
    """
    create the plot
    """

    df = get_linter_results()

    specs = df.index
    spec_names = [extract_domain_name(spec) for spec in specs]

    spec_counts = Counter(spec_names)
    spec_counts_by_name = {
        key: value for key, value in spec_counts.items() if 100 < value
    }
    spec_counts_1 = sum(value for value in spec_counts.values() if value == 1)
    spec_counts_2_to_9 = sum(value for value in spec_counts.values() if 2 < value < 10)
    spec_counts_10_to_100 = sum(
        value for value in spec_counts.values() if 10 <= value <= 100
    )

    spec_counts_by_name["1 Spezifikation"] = spec_counts_1
    spec_counts_by_name["2 - 9 Spezifikationen"] = spec_counts_2_to_9
    spec_counts_by_name["10 - 100 Spezifikationen"] = spec_counts_10_to_100

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.pie(
        x=spec_counts_by_name.values(),
        labels=spec_counts_by_name.keys(),
        autopct="%1.2f%%",
        startangle=140,
        textprops={"fontsize": 12},
        colors=sns.color_palette("Set2"),
    )
    save_plot_to_thesis_dir(filename="specificationsperdomainpie", fig=fig)
