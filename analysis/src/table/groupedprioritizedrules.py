"""
## Grouping Rules into Relevance Clusters
=========================================
"""

from sklearn.cluster import KMeans
import pandas as pd
from table import get_combined


def create_report():
    """
    create the report with the Groups that emerge from clustering
    """

    ser_combined: pd.Series = get_combined().T

    data = ser_combined.values.reshape(-1, 1)
    kmeans = KMeans(n_clusters=3, random_state=0)

    severity_mapping = {0: "error", 1: "warn", 2: "hint"}
    grouping = [severity_mapping[group] for group in kmeans.fit_predict(data)]

    df_combined = ser_combined.to_frame()
    df_grouped = df_combined.assign(group=grouping)

    print(df_grouped.sort_values(ascending=False, by=0))
