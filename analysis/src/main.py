"""
# Main execution context
=======================
"""

from plot import specificationsperdomain, operationsperspec
from table import singletriggermean

specificationsperdomain.create_plot()
operationsperspec.create_plot()
singletriggermean.create_report()
