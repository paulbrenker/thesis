"""
## Part of Azure Violations of total violations
===============================================
"""

import logging
import json
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
        .fillna({"percentage": 0})
    )

    logger.info(
        "Azure Thrown Violations vs total thrown violations overview: \n%s", df_both
    )
