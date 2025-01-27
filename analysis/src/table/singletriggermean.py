"""
## SINGLE TRIGGER rule mean over all specs
=====================
"""

import logging
import pandas as pd
from communication import (
    get_linter_results,
    DataFrameMappers,
    ColumnLimiters,
)

logger = logging.getLogger(__name__)


def create_report():
    """
    Print the mean of single trigger rules
    """
    df_only_single = get_linter_results(
        column_limiter=ColumnLimiters.get_single_trigger(),
        cell_mapper=DataFrameMappers.map_to_thrown,
    )

    logger.info(
        "Mean of Single Trigger Rules:\n%s", pd.DataFrame.mean(df_only_single).to_string
    )
