"""
## DataFrame Loader Module
=====================
"""

import json
import pandas as pd


def get_linter_results(
    column_limiter: list = None,
    cell_mapper: callable = None,
    index_limiter=None,
    index_excluder=None,
    cell_value_exclude: tuple = None,
):
    """
    retrieve latest Linter Results CSV as a pandas  DataFrame
    """
    file_path = (
        "../data/linter-results/2024-09-14@81c1e820ca6c67f61e69525e4e35cb3cf1f0778b.csv"
    )
    with open("src/config/ruleconfig.json", "r", encoding="utf-8") as file:
        ruleconfig = json.load(file)

    no_oas2_rules = [
        rule
        for rule in ruleconfig.keys()
        if ruleconfig[rule]["status"] != "OPENAPI_2_X"
    ]

    df = pd.read_csv(file_path, delimiter=";", index_col="specs")[no_oas2_rules]
    if column_limiter is not None:
        df = df[column_limiter]
    if cell_mapper is not None:
        df = pd.DataFrame.map(df, cell_mapper)
    if cell_value_exclude is not None:
        df = df.loc[df[cell_value_exclude[0]] != cell_value_exclude[1]]
    if index_limiter is not None:
        df = df.loc[
            df.index.to_series().apply(
                lambda index: domain_name_matcher(index, index_limiter)
            )
        ]
    if index_excluder is not None:
        df = df.loc[
            df.index.to_series().apply(
                lambda index: domain_name_matcher(index, index_excluder, invert=True)
            )
        ]
    return df


def domain_name_matcher(file_path: str, matcher: str, invert=False) -> bool:
    """
    Match if the domain name is a given value
    """
    domain = file_path.split("/")[4]
    if invert:
        return domain != matcher
    return domain == matcher


class DataFrameMappers:
    """
    Multiple Method Options that can be used to map your Dataframe
    """

    @classmethod
    def map_to_thrown(cls, inversion: str) -> int:
        """
        Map to thrown Linter Messages absolute number
        """
        result_object = json.loads(inversion)
        return result_object["thrownMessages"]

    @classmethod
    def map_to_possible(cls, inversion: str) -> int:
        """
        Map to possible Linter Messages absolute number
        """
        result_object = json.loads(inversion)
        return result_object["possibleMessages"]

    @classmethod
    def map_to_was_thrown(cls, inversion: str) -> int:
        """
        Maps 1 if messages where thrown 0 if not
        """
        thrown_messages = json.loads(inversion)["thrownMessages"]
        if thrown_messages > 0:
            return 1
        return 0

    @classmethod
    def map_to_was_possible(cls, inversion: str) -> int:
        """
        Maps 1 if messages where possible 0 if not
        """
        possible_messages = json.loads(inversion)["possibleMessages"]
        if possible_messages > 0:
            return 1
        return 0

    @classmethod
    def map_to_inverse(cls, inversion: str) -> int:
        """
        Maps 1 if messages where possible 0 if not
        """
        result_object = json.loads(inversion)
        thrown_messages = result_object["thrownMessages"]
        possible_messages = result_object["possibleMessages"]
        if possible_messages < thrown_messages:
            code = result_object["spectralMessages"][0]["code"]
            raise ValueError(
                f"possibleMessages can't be larger than thrown Messages: {code}"
            )
        if possible_messages == 0:
            return 0
        return thrown_messages / possible_messages


class ColumnLimiters:
    """
    Methods that return subsets of rules to limit columns of the dataframe
    """

    @classmethod
    def get_single_trigger(cls) -> list:
        """
        Return only single trigger rule names
        """

        with open("src/config/ruleconfig.json", "r", encoding="utf-8") as file:
            ruleconfig = json.load(file)

        return [
            rule
            for rule in ruleconfig.keys()
            if (ruleconfig[rule]["status"] == "SINGLE_TRIGGER")
        ]

    @classmethod
    def get_multi_trigger(cls) -> list:
        """
        Return only single trigger rule names
        """

        with open("src/config/ruleconfig.json", "r", encoding="utf-8") as file:
            ruleconfig = json.load(file)

        return [
            rule
            for rule in ruleconfig.keys()
            if (ruleconfig[rule]["status"] == "MULTI_TRIGGER")
        ]

    @classmethod
    def get_multi_message(cls) -> list:
        """
        Return only single trigger rule names
        """

        with open("src/config/ruleconfig.json", "r", encoding="utf-8") as file:
            ruleconfig = json.load(file)

        return [
            rule
            for rule in ruleconfig.keys()
            if (ruleconfig[rule]["status"] == "MULTI_MESSAGE")
        ]

    @classmethod
    def get_problematic(cls) -> list:
        """
        Return a list of functions that could not be determined yet
        """
        return [
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

    @classmethod
    def get_azure_excluded(cls) -> list:
        """
        get rules that are excluded in azure ruleset
        """
        return [
            "operation-tags",
            "no-$ref-siblings",
            "openapi-tags",
            "operation-description",
            "info-contact",
            "operation-tag-defined",
        ]
