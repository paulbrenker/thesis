"""
## Prioritize Weighed Method
============================
"""

import logging
import pandas as pd

from scipy.spatial.distance import pdist, squareform
from communication import get_linter_results, DataFrameMappers

logger = logging.getLogger(__name__)


def create_report():
    """
    create report that weighes multiple prioritization methods and combines them to a single
    """
    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)

    df_sum = df.sum()
    for key, value in df_sum.items():
        if value == 0:
            df_sum[key] = 1
    df_ifs = 1 / df_sum

    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)
    jaccard_distances = pdist(df.T, metric="jaccard")
    jaccard_distance_matrix = squareform(jaccard_distances)
    jaccard_df = pd.DataFrame(
        jaccard_distance_matrix, index=df.columns, columns=df.columns
    )
    inverted_df = 1 - pd.DataFrame.mean(jaccard_df)

    alpha = 0.9
    beta = 0.1

    logger.info(
        "Weighed Combination of Prioritization Methods:\n%s",
        ((alpha * df_ifs) + (beta * inverted_df))
        .sort_values(ascending=False)
        .to_string(),
    )
