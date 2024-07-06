import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors";

export default function FinalScore({ data }) {
  const [weightedScores, setWeightedScores] = useState({
    E_company_1: 0,
    S_company_1: 0,
    G_company_1: 0,
    E_company_2: 0,
    S_company_2: 0,
    G_company_2: 0
  });
  const [finalScore_company_1, setFinalScore_company_1] = useState(0);
  const [finalScore_company_2, setFinalScore_company_2] = useState(0);

  useEffect(() => {
    let E_weight = 0;
    let S_weight = 0;
    let G_weight = 0;

    let totalEWeight = 0;
    let totalSWeight = 0;
    let totalGWeight = 0;

    let totalEWeightedScore_company_1 = 0;
    let totalSWeightedScore_company_1 = 0;
    let totalGWeightedScore_company_1 = 0;

    let totalEWeightedScore_company_2 = 0;
    let totalSWeightedScore_company_2 = 0;
    let totalGWeightedScore_company_2 = 0;

    data.forEach((risk) => {
      if (risk.name === "Environmental Risk") {
        E_weight = risk.weight;
      } else if (risk.name === "Social Risk") {
        S_weight = risk.weight;
      } else if (risk.name === "Governance Risk") {
        G_weight = risk.weight;
      }

      risk.indicators.forEach((indicator) => {
        let indicatorWeightedScore_company_1 = 0;
        let indicatorWeightedScore_company_2 = 0;
        let totalIndicatorWeight = 0;

        indicator.metrics.forEach((metric) => {
          if (metric.checked) {
            let metricWeightedScore_company_1 =
              parseFloat(metric.score_1) * metric.weight;
            let metricWeightedScore_company_2 =
              parseFloat(metric.score_2) * metric.weight;
            indicatorWeightedScore_company_1 += metricWeightedScore_company_1;
            indicatorWeightedScore_company_2 += metricWeightedScore_company_2;
            totalIndicatorWeight += metric.weight;
          }
        });

        indicatorWeightedScore_company_1 /= totalIndicatorWeight;
        indicatorWeightedScore_company_2 /= totalIndicatorWeight;

        if (risk.name === "Environmental Risk") {
          totalEWeight += indicator.weight;
          totalEWeightedScore_company_1 +=
            indicatorWeightedScore_company_1 * indicator.weight;
          totalEWeightedScore_company_2 +=
            indicatorWeightedScore_company_2 * indicator.weight;
        } else if (risk.name === "Social Risk") {
          totalSWeight += indicator.weight;
          totalSWeightedScore_company_1 +=
            indicatorWeightedScore_company_1 * indicator.weight;
          totalSWeightedScore_company_2 +=
            indicatorWeightedScore_company_2 * indicator.weight;
        } else if (risk.name === "Governance Risk") {
          totalGWeight += indicator.weight;
          totalGWeightedScore_company_1 +=
            indicatorWeightedScore_company_1 * indicator.weight;
          totalGWeightedScore_company_2 +=
            indicatorWeightedScore_company_2 * indicator.weight;
        }
      });
    });

    const finalEWeightedScore_company_1 =
      totalEWeightedScore_company_1 / totalEWeight;
    const finalSWeightedScore_company_1 =
      totalSWeightedScore_company_1 / totalSWeight;
    const finalGWeightedScore_company_1 =
      totalGWeightedScore_company_1 / totalGWeight;

    const finalEWeightedScore_company_2 =
      totalEWeightedScore_company_2 / totalEWeight;
    const finalSWeightedScore_company_2 =
      totalSWeightedScore_company_2 / totalSWeight;
    const finalGWeightedScore_company_2 =
      totalGWeightedScore_company_2 / totalGWeight;

    const finalScore_company_1 = calculateFinalScore(
      finalEWeightedScore_company_1,
      finalSWeightedScore_company_1,
      finalGWeightedScore_company_1,
      E_weight,
      S_weight,
      G_weight
    );

    const finalScore_company_2 = calculateFinalScore(
      finalEWeightedScore_company_2,
      finalSWeightedScore_company_2,
      finalGWeightedScore_company_2,
      E_weight,
      S_weight,
      G_weight
    );

    setWeightedScores({
      E_company_1: finalEWeightedScore_company_1,
      S_company_1: finalSWeightedScore_company_1,
      G_company_1: finalGWeightedScore_company_1,
      E_company_2: finalEWeightedScore_company_2,
      S_company_2: finalSWeightedScore_company_2,
      G_company_2: finalGWeightedScore_company_2
    });

    setFinalScore_company_1(finalScore_company_1);
    setFinalScore_company_2(finalScore_company_2);
  }, [data]);

  const calculateFinalScore = (
    finalEWeightedScore,
    finalSWeightedScore,
    finalGWeightedScore,
    E_weight,
    S_weight,
    G_weight
  ) => {
    if (
      isNaN(finalEWeightedScore) &&
      isNaN(finalSWeightedScore) &&
      isNaN(finalGWeightedScore)
    ) {
      return NaN; // All scores are NaN, cannot calculate final score
    } else if (isNaN(finalEWeightedScore) && isNaN(finalSWeightedScore)) {
      return (finalGWeightedScore * G_weight) / G_weight; // Only finalGWeightedScore available
    } else if (isNaN(finalSWeightedScore) && isNaN(finalGWeightedScore)) {
      return (finalEWeightedScore * E_weight) / E_weight; // Only finalEWeightedScore available
    } else if (isNaN(finalEWeightedScore) && isNaN(finalGWeightedScore)) {
      return (finalSWeightedScore * S_weight) / S_weight; // Only finalSWeightedScore available
    } else if (isNaN(finalEWeightedScore)) {
      return (
        (finalSWeightedScore * S_weight + finalGWeightedScore * G_weight) /
        (S_weight + G_weight)
      );
    } else if (isNaN(finalSWeightedScore)) {
      return (
        (finalEWeightedScore * E_weight + finalGWeightedScore * G_weight) /
        (E_weight + G_weight)
      );
    } else if (isNaN(finalGWeightedScore)) {
      return (
        (finalEWeightedScore * E_weight + finalSWeightedScore * S_weight) /
        (E_weight + S_weight)
      );
    } else {
      return (
        (finalEWeightedScore * E_weight +
          finalSWeightedScore * S_weight +
          finalGWeightedScore * G_weight) /
        (E_weight + S_weight + G_weight)
      );
    }
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography align="center" color={green[500]} variant="h6">
            E_weighted_score:
          </Typography>
          <Typography align="center" color={orange[500]} variant="h6">
            S_weighted_score:
          </Typography>
          <Typography align="center" color={grey[500]} variant="h6">
            G_weighted_score:
          </Typography>
          <Divider sx={{ margin: "12px 0" }} />
          <Typography align="center" variant="h4">
            Final Score:
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="h6">
            {weightedScores.E_company_1.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.S_company_1.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.G_company_1.toFixed(2)}
          </Typography>
          <Divider sx={{ margin: "12px 0" }} />
          <Typography align="center" variant="h4">
            {isNaN(finalScore_company_1)
              ? "N/A"
              : finalScore_company_1.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography align="center" variant="h6">
            {weightedScores.E_company_2.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.S_company_2.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.G_company_2.toFixed(2)}
          </Typography>
          <Divider sx={{ margin: "12px 0" }} />
          <Typography align="center" variant="h4">
            {isNaN(finalScore_company_2)
              ? "N/A"
              : finalScore_company_2.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

FinalScore.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      indicators: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          weight: PropTypes.number.isRequired,
          metrics: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string.isRequired,
              description: PropTypes.string.isRequired,
              score_1: PropTypes.number.isRequired,
              score_2: PropTypes.number.isRequired,
              weight: PropTypes.number.isRequired,
              checked: PropTypes.bool.isRequired
            })
          ).isRequired
        })
      ).isRequired
    })
  ).isRequired
};
