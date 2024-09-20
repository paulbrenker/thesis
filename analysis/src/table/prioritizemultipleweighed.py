"""
## Prioritize Weighed Method
============================
"""

import logging
from communication import get_linter_results, DataFrameMappers
from table.prioritizeruletriggerdiversity import create_jaccard_inverted_score

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

    inverted_df = create_jaccard_inverted_score()

    alpha = 0.9
    beta = 0.1

    logger.info(
        "Weighed Combination of Prioritization Methods:\n%s",
        ((alpha * df_ifs) + (beta * inverted_df))
        .sort_values(ascending=False)
        .to_string(),
    )
