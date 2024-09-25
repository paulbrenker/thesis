"""
## Grouping Rules into Relevance Clusters
=========================================
"""

import logging
from sklearn.cluster import KMeans
from table import (
    create_inverse_frequence_score,
    create_jaccard_inverted_score,
)

logger = logging.getLogger(__name__)


def create_report():
    """
    create the report with the Groups that emerge from clustering
    """

    df_clustered = create_clustering()

    logger.info(
        "Kmeans Clustered Rules according to prio:\n%s",
        df_clustered.sort_values(ascending=False, by="group").to_string(),
    )


def create_clustering():
    """
    create the 3 means clustering
    """
    alpha = 0.8
    beta = 0.2

    inverse_frequence_series = create_inverse_frequence_score() * alpha
    trigger_diversity_series = create_jaccard_inverted_score() * beta

    df_prioritization = inverse_frequence_series.to_frame().assign(
        diversity=trigger_diversity_series.values
    )
    df_prioritization_renamed = df_prioritization.rename(columns={0: "idf"})

    kmeans = KMeans(n_clusters=3, random_state=0)
    severity_mapping = {0: "error", 1: "warn", 2: "hint"}
    grouping = [
        severity_mapping[group]
        for group in kmeans.fit_predict(df_prioritization_renamed)
    ]

    df_clustered = df_prioritization_renamed.assign(group=grouping)

    return df_clustered
