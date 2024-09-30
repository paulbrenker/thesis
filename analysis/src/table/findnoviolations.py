"""
No caused violations specs, no errors thrown rules Module
===========================================================
"""

import logging

from communication import get_linter_results, DataFrameMappers

logger = logging.getLogger(__name__)


def create_report():
    """
    create the report for the no violations module
    """

    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_thrown)

    series_transformed_summated = df.T.sum()

    no_violations_thrown = [
        key for key, value in series_transformed_summated.items() if value == 0
    ]

    logger.info(
        "Number of Specifications with no violations: %i", len(no_violations_thrown)
    )

    never_triggered_rules = [key for key, value in df.sum().items() if value == 0]

    logger.info(
        "Number of Rules that were not triggered by any Specification: %i",
        len(never_triggered_rules),
    )
