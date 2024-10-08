"""
Total thrown specs that were thrown per rule
============================================
"""

import logging
from communication import get_linter_results, DataFrameMappers

logger = logging.getLogger(__name__)


def create_report():
    """
    Create a table that shows total thrown numbers
    """
    df = get_linter_results(cell_mapper=DataFrameMappers.map_to_thrown)

    series = df.sum()

    logger.info("Total Specs that were thrown per rule: \n%s", series.to_string())
