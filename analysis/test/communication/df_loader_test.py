"""
## DataFrame Importer Test Module
=================================
"""

import json
import unittest
from communication.df_loader import DataFrameMappers


class TestImportDataFrame(unittest.TestCase):
    """
    Test importing the dataframe and mapping it
    """

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
