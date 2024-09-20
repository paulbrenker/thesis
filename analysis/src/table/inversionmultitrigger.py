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
        if rule
        not in [
            "operation-tag-defined",
            "path-keys-no-trailing-slash",
            "typed-enum",
            "oas3-unused-component",
            "path-not-include-query",
            "oas3-valid-media-example",
            "oas3-valid-schema-example",
            "oas3-schema",
            "oas3-callbacks-in-callbacks",
            "no-$ref-siblings",
            "operation-description",
            "operation-operationId",
        ]
    ]

    df_relatable = get_linter_results(
        column_limiter=relatable_columns, cell_mapper=DataFrameMappers.map_to_inverse
    )
    logger.info("Mean of Properly inverted rules: %s", pd.DataFrame.mean(df_relatable))
