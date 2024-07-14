"""
## Hello World Test Module
==========================
"""

import unittest

from hello_world import HelloWorld


class TestHelloWorld(unittest.TestCase):
    """
    Hello World Test Class
    """

    def test_hello_world(self):
        """
        Hello World Test Function
        """
        hello_world = HelloWorld.hello_world()
        self.assertEqual(hello_world, "Hello World!")
