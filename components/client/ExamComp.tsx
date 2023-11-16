"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import generateProblem from "@/utils/generateProblem";
import Link from "next/link";

const ExamComp = () => {
  const searchParams = useSearchParams();
  const type = +(searchParams.get("type") || "1"); // 1+; 2+-;3*
  const ref = useRef<HTMLInputElement>(null);

  const count = +(searchParams.get("count") || "10");
  const time = +(searchParams.get("time") || "0") || -1;

  const [problems, setProblems] = useState(generateProblem(type, count + 1));

  const [result, setResult] = useState<(number | "")[]>([]);
  const [value, setValue] = useState<number | "">(0);
  const [gameStage, setGameStage] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(time);

  const isExample = gameStage === 0;
  const noLimit = time < 0;
  const gameEnd = gameStage > count;

  const nextStage = useCallback(() => {
    setResult((result) => [...result, value]);
    setValue("");
    setGameStage(gameStage + 1);
    setTimeLeft(time);
  }, [gameStage, value, time]);

  useEffect(() => {
    if (noLimit || gameEnd) return;
    if (timeLeft === 0) {
      nextStage();
    }
    const timer = setTimeout(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [noLimit, timeLeft, nextStage, gameEnd]);

  useEffect(() => {
    ref.current?.focus();
  }, [gameStage]);

  useEffect(() => {
    if (isExample) setValue(problems[gameStage].answer);
  }, [problems, gameStage, isExample]);

  return (
    <div className="h-full flex flex-col items-center">
      <h1 className="text-4xl m-4">
        生醫工程實驗 -- 心算測試{" "}
        {gameEnd ? "測驗結束" : isExample ? "Example" : `第 ${gameStage} 題`}
      </h1>
      {gameEnd ? (
        <div className="flex flex-col items-center justify-start">
          <h1 className="text-lg">
            {noLimit ? `不限時` : `限時 ${time} 秒`}，共答對{" "}
            {result
              .map((e, id) => !!id && e === problems[id]?.answer)
              .reduce((pre, cur) => pre + +cur, 0)}
            /{count} 題
          </h1>

          <Link
            href="/"
            className="text-lg border-white border-2 rounded-md m-2 p-2 hover:bg-slate-300 hover:text-black"
          >
            重新選擇測驗
          </Link>
          <details defaultChecked={false}>
            <summary>詳細結果</summary>
            <ol>
              {problems.map((problem, index) =>
                index === 0 ? null : (
                  <li key={index}>
                    {index}. {problem.a} {problem.op} {problem.b} ={" "}
                    {problem.answer}{" "}
                    {result[index] === problem.answer ? "✅" : "❌"}{" "}
                    {result[index] === "" ? "未作答" : result[index]}
                  </li>
                )
              )}
            </ol>
          </details>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start">
          <div>
            <h2>{noLimit ? `不限時` : `剩 ${timeLeft} 秒`}</h2>
            <h2>第 {gameStage} 題</h2>
          </div>

          <h2 className="mt-24 text-9xl">
            {problems[gameStage].a} {problems[gameStage].op}{" "}
            {problems[gameStage].b} = ?
          </h2>
          <input
            type="number"
            name="answer"
            className="p-2 text-black text-3xl mt-4"
            ref={ref}
            value={value}
            onChange={(e) => {
              setValue(+e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                nextStage();
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExamComp;
