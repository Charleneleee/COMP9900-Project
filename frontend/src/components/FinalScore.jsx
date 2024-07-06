import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Box, Divider, Grid, Typography } from "@mui/material";
import { green, grey, orange } from "@mui/material/colors";

export default function FinalScore({ data }) {
  const [weightedScores, setWeightedScores] = useState({ E: 0, S: 0, G: 0 });
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    let E_weight = 0;
    let S_weight = 0;
    let G_weight = 0;

    let totalEWeight = 0;
    let totalSWeight = 0;
    let totalGWeight = 0;
    let totalEWeightedScore = 0;
    let totalSWeightedScore = 0;
    let totalGWeightedScore = 0;

    data.forEach((risk) => {
      if (risk.name == "Environmental Risk") {
        E_weight = risk.weight;
      } else if (risk.name == "Social Risk") {
        S_weight = risk.weight;
      } else if (risk.name == "Governance Risk") {
        G_weight = risk.weight;
      }

      risk.indicators.forEach((indicator) => {
        let indicatorWeightedScore = 0;
        let totalIndicatorWeight = 0;

        indicator.metrics.forEach((metric) => {
          if (metric.checked) {
            let metricWeightedScore = parseFloat(metric.score) * metric.weight;
            indicatorWeightedScore += metricWeightedScore;
            totalIndicatorWeight += metric.weight;
          }
        });

        indicatorWeightedScore /= totalIndicatorWeight;

        if (risk.name === "Environmental Risk") {
          totalEWeight += indicator.weight;
          totalEWeightedScore += indicatorWeightedScore * indicator.weight;
        } else if (risk.name === "Social Risk") {
          totalSWeight += indicator.weight;
          totalSWeightedScore += indicatorWeightedScore * indicator.weight;
        } else if (risk.name === "Governance Risk") {
          totalGWeight += indicator.weight;
          totalGWeightedScore += indicatorWeightedScore * indicator.weight;
        }
      });
    });

    const finalEWeightedScore = totalEWeightedScore / totalEWeight;
    const finalSWeightedScore = totalSWeightedScore / totalSWeight;
    const finalGWeightedScore = totalGWeightedScore / totalGWeight;

    const finalScore = calculateFinalScore(
      finalEWeightedScore,
      finalSWeightedScore,
      finalGWeightedScore,
      E_weight,
      S_weight,
      G_weight
    );

    setWeightedScores({
      E: finalEWeightedScore,
      S: finalSWeightedScore,
      G: finalGWeightedScore,
    });
    setFinalScore(finalScore);
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <Typography align="center" variant="h6">
            {weightedScores.E.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.S.toFixed(2)}
          </Typography>
          <Typography align="center" variant="h6">
            {weightedScores.G.toFixed(2)}
          </Typography>
          <Divider sx={{ margin: "12px 0" }} />
          <Typography align="center" variant="h4">
            {finalScore.toFixed(2)}
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
              score: PropTypes.number.isRequired,
              weight: PropTypes.number.isRequired,
              checked: PropTypes.bool.isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
