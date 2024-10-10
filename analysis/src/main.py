"""
# Main execution context
=======================
"""

import logging

from communication import get_current_commit_hash, get_current_iso_date

from plot import (
    specificationsperdomain,
    operationsperspec,
    multitriggerthrownvspossible,
    totalspecsthatthrow,
    rulesimilaritydendrogram,
    clusterprioritizedscatter,
    violationsonazureexcluded,
    multitriggerboxplot,
    ruleseverityreassignments,
    priodistrhist,
)
from table import (
    singletriggermean,
    inversionmultitrigger,
    describetotalnumbers,
    prioritizeinversefrequencescore,
    prioritizeruletriggerdiversity,
    prioritizemultipleweighed,
    groupedprioritizedrules,
    violationpartitionazure,
    findnoviolations,
    totalthrownrules,
)

logging.basicConfig(
    filename=f"../data/analysis-results/{get_current_iso_date()}@{get_current_commit_hash()}.txt",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

specificationsperdomain.create_plot()
operationsperspec.create_plot()
singletriggermean.create_report()
multitriggerthrownvspossible.create_plot()
totalspecsthatthrow.create_plot()
rulesimilaritydendrogram.create_plot()
inversionmultitrigger.create_report()
describetotalnumbers.create_report()
prioritizeinversefrequencescore.create_report()
prioritizeruletriggerdiversity.create_report()
prioritizemultipleweighed.create_report()
groupedprioritizedrules.create_report()
clusterprioritizedscatter.create_plot()
violationsonazureexcluded.create_plot()
violationpartitionazure.create_report()
multitriggerboxplot.create_plot()
findnoviolations.create_report()
ruleseverityreassignments.create_plot()
totalthrownrules.create_report()
priodistrhist.create_plot()
