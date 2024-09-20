"""
## Description of some total numbers
====================================
"""

import logging
from communication import (
    get_linter_results,
    DataFrameMappers,
)

logger = logging.getLogger(__name__)


def create_report():
    """
    create a report of total numbers
    """

    total_thrown = (
        get_linter_results(cell_mapper=DataFrameMappers.map_to_thrown).sum().sum()
    )
    total_possible = (
        get_linter_results(cell_mapper=DataFrameMappers.map_to_possible).sum().sum()
    )

    logger.info("total thrown errors over all rules: %s", total_thrown)
    logger.info("total possible errors over all rules: %s", total_possible)
