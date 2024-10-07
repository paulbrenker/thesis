"""
## Part of Azure Violations of total violations
===============================================
"""

import logging
import json
from scipy import stats
from communication import get_linter_results, DataFrameMappers, ColumnLimiters

logger = logging.getLogger(__name__)


def create_report():
    """
    create the report
    """
    with open("src/config/ruleconfig.json", "r", encoding="utf-8") as file:
        ruleconfig = json.load(file)

    limiter = [
        rule
        for rule in ruleconfig.keys()
        if (rule not in ColumnLimiters.get_azure_excluded())
        and (ruleconfig[rule]["status"] != "OPENAPI_2_X")
    ]

    df_azure = get_linter_results(
        column_limiter=limiter,
        cell_mapper=DataFrameMappers.map_to_thrown,
        index_limiter="azure.com",
    ).sum()

    df_total = get_linter_results(
        column_limiter=limiter,
        cell_mapper=DataFrameMappers.map_to_thrown,
    ).sum()

    df_both = (
        df_azure.to_frame()
        .rename(columns={0: "azure"})
        .assign(total=df_total)
        .assign(percentage=((df_azure / df_total) * 100).round(decimals=1))
        .dropna()
    )

    logger.info(
        "Azure Thrown Violations vs total thrown violations overview: \n%s", df_both
    )

    df_azure_not_azure_ignored = get_linter_results(
        column_limiter=ColumnLimiters.get_azure_excluded(),
        cell_mapper=DataFrameMappers.map_to_thrown,
        index_limiter="azure.com",
    ).sum()

    df_total_not_azure_ignored = get_linter_results(
        column_limiter=ColumnLimiters.get_azure_excluded(),
        cell_mapper=DataFrameMappers.map_to_thrown,
    ).sum()

    df_both_not_azure_ignored = (
        df_azure_not_azure_ignored.to_frame()
        .rename(columns={0: "azure"})
        .assign(total=df_total_not_azure_ignored)
        .assign(
            percentage=(
                (df_azure_not_azure_ignored / df_total_not_azure_ignored) * 100
            ).round(decimals=1)
        )
        .dropna()
    )
    t_statistic, p_value = stats.ttest_ind(
        df_both["percentage"],
        df_both_not_azure_ignored["percentage"],
        equal_var=False,
        alternative="less",
    )
    alpha = 0.05

    logger.info(
        "the t_statistic is %i, dependency of group 1 is statistically dependent: %s",
        t_statistic,
        p_value < alpha,
    )
