"""
## Priorization after Inverse Frequence Method
=====================
"""

import logging
from communication import (
    get_linter_results,
    DataFrameMappers,
)

logger = logging.getLogger(__name__)


def create_report():
    """
    create a report of prioritized results with inverse frequence method
    """
    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)

    df_sum = df.sum()
    for key, value in df_sum.items():
        if value == 0:
            df_sum[key] = 1
    df_divided = 1 / df_sum
    df_sorted = df_divided.sort_values(ascending=False)
    logger.info(
        "Inverse Frequency Prioritized Rules Sorted:\n%s", df_sorted.to_string()
    )
