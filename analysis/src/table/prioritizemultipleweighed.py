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
    df_combined = get_combined()

    logger.info(
        "Weighed Combination of Prioritization Methods:\n%s",
        df_combined.sort_values(ascending=False).to_string(),
    )


def get_combined():
    """
    get a linear combination of weighed prioritization methods
    """
    df_ifs = create_inverse_frequence_score()
    inverted_df = create_jaccard_inverted_score()

    alpha = 0.8
    beta = 0.2

    return (alpha * df_ifs) + (beta * inverted_df)
