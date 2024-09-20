"""
## Prioritize Weighed Method
============================
"""

import logging
from table.prioritizeruletriggerdiversity import create_jaccard_inverted_score
from table.prioritizeinversefrequencescore import create_inverse_frequence_score

logger = logging.getLogger(__name__)


def create_report():
    """
    create report that weighes multiple prioritization methods and combines them to a single
    """

    df_ifs = create_inverse_frequence_score()

    inverted_df = create_jaccard_inverted_score()

    alpha = 0.9
    beta = 0.1

    logger.info(
        "Weighed Combination of Prioritization Methods:\n%s",
        ((alpha * df_ifs) + (beta * inverted_df))
        .sort_values(ascending=False)
        .to_string(),
    )
