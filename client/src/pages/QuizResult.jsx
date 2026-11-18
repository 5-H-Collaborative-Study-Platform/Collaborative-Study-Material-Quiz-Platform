
import PropTypes from "prop-types";

export default function QuizResult({ score = 0 }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Quiz result</h2>
      <p role="status">You scored {score}%</p>
      {score >= 40 ? (
        <p>Passed 🎉</p>
      ) : (
        <p>Keep practising</p>
      )}
    </div>
  );
}

QuizResult.propTypes = {
  score: PropTypes.number,
};
