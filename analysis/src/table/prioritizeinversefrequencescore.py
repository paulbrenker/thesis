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
    df_divided = create_inverse_frequence_score()
    df_sorted = df_divided.sort_values(ascending=False)
    logger.info(
        "Inverse Frequency Prioritized Rules Sorted:\n%s", df_sorted.to_string()
    )


def create_inverse_frequence_score(no_azure_specs=False):
    """
    create a prioritization set using inverse frequency score
    """
    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_was_thrown)

    if no_azure_specs:
        df = get_linter_results(
            index_excluder="azure.com", cell_mapper=DataFrameMappers.map_to_was_thrown
        )

    df_sum = df.sum()
    for key, value in df_sum.items():
        if value == 0:
            df_sum[key] = 1
    return 1 / df_sum
