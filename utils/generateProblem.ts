const generateProblem = (type: number, count: number) =>
  [...Array(count)].map(() => {
    const a =
      type !== 3
        ? Math.floor(Math.random() * 100)
        : Math.floor(Math.random() * 32);
    const b =
      type !== 3
        ? Math.floor(Math.random() * 100)
        : Math.floor(Math.random() * 32);
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
