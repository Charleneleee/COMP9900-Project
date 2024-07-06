import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SingleScore from "./FinalScore";
import MultiScore from "./FinalCompareScore";

export default function FinalScore({ data }) {
  const [display_type, setDisplayType] = useState("single");

  useEffect(() => {
    let hasScore = true;
    for (let risks of data) {
      for (let indicator of risks.indicators) {
        for (let metric of indicator.metrics) {
          if (!Object.prototype.hasOwnProperty.call(metric, "score")) {
            hasScore = false;
            break;
          }
        }
        if (!hasScore) {
          break;
        }
      }
      if (!hasScore) {
        break;
      }
    }

    if (hasScore) {
      setDisplayType("single");
    } else {
      setDisplayType("multi");
    }
  }, [data]);

  return (
    <>
      {display_type === "single" ? (
        <SingleScore data={data} />
      ) : (
        <MultiScore data={data} />
      )}
    </>
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
              checked: PropTypes.bool.isRequired,
            })
          ).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};
