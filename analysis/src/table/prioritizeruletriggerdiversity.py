"""
## Prioritization of most Diverse Rule Triggers
===============================================
"""

import logging
import pandas as pd
from scipy.spatial.distance import pdist, squareform

from communication import get_linter_results, DataFrameMappers

logger = logging.getLogger(__name__)


def create_report():
    """
    create a sorted report for diversity of rule triggers
    """

    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)
    jaccard_distances = pdist(df.T, metric="jaccard")
    jaccard_distance_matrix = squareform(jaccard_distances)
    jaccard_df = pd.DataFrame(
        jaccard_distance_matrix, index=df.columns, columns=df.columns
    )
    sorted_inverted_df = (1 - pd.DataFrame.mean(jaccard_df)).sort_values(
        ascending=False
    )
    logger.info("Diversity ranked prioritization: %s", sorted_inverted_df.to_string())
