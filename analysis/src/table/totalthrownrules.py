"""
Total thrown specs that were thrown per rule
============================================
"""

import logging
import pandas as pd
from communication import get_linter_results, DataFrameMappers

logger = logging.getLogger(__name__)


def create_report():
    """
    Create a table that shows total thrown numbers
    """
    df_thrown = get_linter_results(cell_mapper=DataFrameMappers.map_to_thrown)
    df_possible = get_linter_results(cell_mapper=DataFrameMappers.map_to_possible)

    series_thrown_sum = pd.DataFrame.sum(df_thrown)
    series_thrown_mean = pd.DataFrame.mean(df_thrown)
    series_thrown_median = pd.DataFrame.median(df_thrown)
    series_thrown_std = pd.DataFrame.std(df_thrown)

    series_possible_sum = pd.DataFrame.sum(df_possible)
    series_possible_mean = pd.DataFrame.mean(df_possible)
    series_possible_median = pd.DataFrame.median(df_possible)
    series_possible_std = pd.DataFrame.std(df_possible)

    df_combined = (
        series_thrown_sum.to_frame()
        .rename(columns={0: "thrown_sum"})
        .assign(thrown_mean=pd.DataFrame.round(series_thrown_mean, decimals=2))
        .assign(thrown_median=series_thrown_median)
        .assign(thrown_std=pd.DataFrame.round(series_thrown_std, decimals=2))
        .assign(possible_sum=series_possible_sum)
        .assign(possible_mean=pd.DataFrame.round(series_possible_mean, decimals=2))
        .assign(possible_median=series_possible_median)
        .assign(possible_std=pd.DataFrame.round(series_possible_std, decimals=2))
    )

    logger.info("Total Overview over thrown stuff: \n%s", df_combined.to_string())
