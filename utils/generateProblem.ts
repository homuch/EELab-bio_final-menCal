const generateProblem = (type: number, count: number) =>
  [...Array(count)].map(() => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const op =
      type === 1 ? "+" : type === 2 ? (Math.random() < 0.5 ? "+" : "-") : "*";
    const answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
    return {
      a,
      b,
      op,
      answer,
    };
  });

export default generateProblem;
