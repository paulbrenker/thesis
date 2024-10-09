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
    inverted_df = create_jaccard_inverted_score()

    sorted_df = inverted_df.sort_values(ascending=False)
    logger.info("Diversity ranked prioritization:\n%s", sorted_df.to_string())


def create_jaccard_inverted_score(no_azure_specs=False):
    """
    get the mean of jaccard distance between rule vectors
    """
    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)
    if no_azure_specs:
        df = get_linter_results(
            index_excluder="azure.com", cell_mapper=DataFrameMappers.map_to_was_thrown
        )
    jaccard_distances = pdist(df.T, metric="jaccard")
    jaccard_distance_matrix = squareform(jaccard_distances)
    jaccard_df = pd.DataFrame(
        jaccard_distance_matrix, index=df.columns, columns=df.columns
    )
    return 1 - pd.DataFrame.mean(jaccard_df)
