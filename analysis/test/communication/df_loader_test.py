"""
## DataFrame Importer Test Module
=================================
"""

import json
import unittest
from communication.df_loader import (
    domain_name_matcher,
    DataFrameMappers,
    ColumnLimiters,
)


class TestImportDataFrame(unittest.TestCase):
    """
    Test importing the dataframe and mapping it
    """

    def test_domain_name_matcher_success(self):
        """
        test matching of domain names
        """
        spec_name = "../data/openapi-directory/APIs/1forge.com/0.0.1/swagger.yaml"
        matcher = "1forge.com"

        result = domain_name_matcher(spec_name, matcher)
        self.assertTrue(result)

    def test_domain_name_matcher_fail(self):
        """
        test matching of domain names
        """
        spec_name = "../data/openapi-directory/APIs/1forge.com/0.0.1/swagger.yaml"
        matcher = "azure.com"

        result = domain_name_matcher(spec_name, matcher)
        self.assertFalse(result)

    def test_map_to_thrown(self):
        """
        test mapping to thrown messages
        """
        test_data = json.dumps({"thrownMessages": 5})
        expected = 5

        result = DataFrameMappers.map_to_thrown(test_data)
        self.assertEqual(result, expected)

    def test_map_to_possible(self):
        """
        test mapping to possible messages
        """
        test_data = json.dumps({"possibleMessages": 5})
        expected = 5

        result = DataFrameMappers.map_to_possible(test_data)
        self.assertEqual(result, expected)

    def test_map_to_was_thrown(self):
        """
        test mapping to possible messages
        """
        test_data = json.dumps({"thrownMessages": 5})
        expected = 1

        result = DataFrameMappers.map_to_was_thrown(test_data)
        self.assertEqual(result, expected)

        test_data = json.dumps({"thrownMessages": 0})
        expected = 0

        result = DataFrameMappers.map_to_was_thrown(test_data)
        self.assertEqual(result, expected)

    def test_map_to_was_possible(self):
        """
        test mapping to possible messages
        """
        test_data = json.dumps({"possibleMessages": 5})
        expected = 1

        result = DataFrameMappers.map_to_was_possible(test_data)
        self.assertEqual(result, expected)

        test_data = json.dumps({"possibleMessages": 0})
        expected = 0

        result = DataFrameMappers.map_to_was_possible(test_data)
        self.assertEqual(result, expected)

    def test_map_to_inverse_success(self):
        """
        test successful inversion
        """
        test_data = json.dumps({"thrownMessages": 0, "possibleMessages": 1})
        expected = 0

        result = DataFrameMappers.map_to_inverse(test_data)
        self.assertEqual(result, expected)

    def test_map_to_inverse_null(self):
        """
        test successful inversion with possible eq null
        """
        test_data = json.dumps({"thrownMessages": 0, "possibleMessages": 0})
        expected = 0

        result = DataFrameMappers.map_to_inverse(test_data)
        self.assertEqual(result, expected)

    def test_map_to_inverse_failure(self):
        """
        test successful inversion with possible eq null
        """
        test_data = json.dumps(
            {
                "thrownMessages": 1,
                "possibleMessages": 0,
                "spectralMessages": [{"code": "test-code"}],
            }
        )
        with self.assertRaises(ValueError) as context:
            DataFrameMappers.map_to_inverse(test_data)
        self.assertEqual(
            str(context.exception),
            "possibleMessages can't be larger than thrown Messages: test-code",
        )

    def test_get_single_trigger(self):
        """
        specification test for SINGLE_TRIGGER Rules
        """
        expected = [
            "contact-properties",
            "info-contact",
            "info-description",
            "info-license",
            "license-url",
            "openapi-tags-alphabetical",
            "oas3-api-servers",
            "oas3-server-not-example.com",
        ]
        actual = ColumnLimiters.get_single_trigger()

        self.assertEqual(actual, expected)

    def test_get_multi_trigger(self):
        """
        specification test for MULTI_TRIGGER Rules
        """
        expected = [
            "operation-success-response",
            "operation-operationId-unique",
            "duplicated-entry-in-enum",
            "no-eval-in-markdown",
            "no-script-tags-in-markdown",
            "openapi-tags-uniqueness",
            "openapi-tags",
            "operation-operationId-valid-in-url",
            "operation-singular-tag",
            "operation-tags",
            "path-declarations-must-exist",
            "tag-description",
            "array-items",
            "oas3-parameter-description",
            "oas3-server-trailing-slash",
        ]
        actual = ColumnLimiters.get_multi_trigger()

        self.assertEqual(actual, expected)

    def test_get_multi_message(self):
        """
        specification test for MULTI_MESSAGE Rules
        """
        expected = [
            "operation-parameters",
            "operation-tag-defined",
            "path-params",
            "operation-description",
            "operation-operationId",
            "path-keys-no-trailing-slash",
            "path-not-include-query",
            "no-$ref-siblings",
            "typed-enum",
            "oas3-examples-value-or-externalValue",
            "oas3-operation-security-defined",
            "oas3-valid-media-example",
            "oas3-valid-schema-example",
            "oas3-schema",
            "oas3-unused-component",
            "oas3-server-variables",
            "oas3-callbacks-in-callbacks",
        ]
        actual = ColumnLimiters.get_multi_message()
        print(actual)

        self.assertEqual(actual, expected)

    def test_get_problematic(self):
        """
        specification test for not well determined Rules
        """
        expected = [
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

        actual = ColumnLimiters.get_problematic()
        print(actual)

        self.assertEqual(actual, expected)
