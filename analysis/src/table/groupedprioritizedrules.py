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

    df_clustered, _ = create_clustering()

    logger.info(
        "Kmeans Clustered Rules according to prio:\n%s",
        df_clustered.sort_values(ascending=False, by="weighed").to_string(),
    )

    df_clustered_no_azure, _ = create_clustering(no_azure_specs=True)

    logger.info(
        "Kmeans Clustered Rules not considering any azure specification:\n%s",
        df_clustered_no_azure.sort_values(ascending=False, by="weighed").to_string(),
    )


def create_clustering(no_azure_specs=False):
    """
    create the 3 means clustering
    """
    alpha = 0.8
    beta = 0.2

    inverse_frequence_series = create_inverse_frequence_score(
        no_azure_specs=no_azure_specs
    )
    trigger_diversity_series = create_jaccard_inverted_score(
        no_azure_specs=no_azure_specs
    )

    df_prioritization = inverse_frequence_series.to_frame().assign(
        diversity=trigger_diversity_series.values
    )
    df_prioritization_renamed = df_prioritization.rename(columns={0: "idf"})

    df_prioritization_renamed_weighed = df_prioritization_renamed["idf"].apply(
        lambda x: alpha * x
    )

    df_prioritization_renamed_weighed = (
        df_prioritization_renamed_weighed.to_frame().assign(
            diversity=df_prioritization_renamed["diversity"].apply(lambda x: beta * x)
        )
    )

    kmeans = KMeans(n_clusters=3, random_state=0)
    severity_mapping = {0: "error", 1: "warn", 2: "hint"}
    grouping = [
        severity_mapping[group]
        for group in kmeans.fit_predict(df_prioritization_renamed_weighed)
    ]

    df_clustered = df_prioritization_renamed.assign(
        weighed=df_prioritization_renamed_weighed["idf"]
        + df_prioritization_renamed_weighed["diversity"]
    ).assign(group=grouping)

    return df_clustered, kmeans
