"""
## MULTI TRIGGER rule mean over all specs
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
    create report for mean of inverted rules
    """
    relatable_columns = [
        rule
        for rule in (
            ColumnLimiters.get_single_trigger() + ColumnLimiters.get_multi_trigger()
        )
        if rule not in ColumnLimiters.get_problematic()
    ]

    df_relatable = get_linter_results(
        column_limiter=relatable_columns, cell_mapper=DataFrameMappers.map_to_inverse
    )
    logger.info("Mean of Properly inverted rules:\n%s", pd.DataFrame.mean(df_relatable))
