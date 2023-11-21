"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useReactTimer from "@/utils/useReactTimer";
import generateProblem from "@/utils/generateProblem";
import { prisma } from "@/db";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type problemRecord = {
  problemId: string;
  correct: boolean;
  endAt: number;
};

const ExamComp = () => {
  const searchParams = useSearchParams();
  const type = +(searchParams.get("type") || "1"); // 1+; 2+-;3*
  const ref = useRef<HTMLInputElement>(null);

  const count = +(searchParams.get("count") || "10");
  const time = +(searchParams.get("time") || "0") || -1;
  const expName = searchParams.get("expName") || "unknown";

  const [problems, setProblems] = useState(generateProblem(type, count + 1));
  const [problemRecord, setProblemRecord] = useState<problemRecord[]>([]);

  const [result, setResult] = useState<(number | "")[]>([]);
  const [value, setValue] = useState<number | "">(0);
  const [gameStage, setGameStage] = useState<number>(0);
  // const [timeLeft, setTimeLeft] = useState<number>(time);
  const {
    time: totalTimerTime,
    startTimer: startTotalTimer,
    pauseTimer,
  } = useReactTimer(50);
  const [lastTimePoint, setLastTimePoint] = useState(0);
  const isExample = gameStage === 0;
  const noLimit = time < 0;
  const gameEnd = gameStage > count;

  const csvData = [
    ["name", "type", "count", "timeLimit"].join(", "),
    [
      expName,
      type === 1
        ? "隨機二位數加法"
        : type === 2
        ? "隨機二位數加減法"
        : "隨機二位數乘法",
      count,
      time,
    ].join(", "),
    "",
    "problemId, correct, timeEndAt",
    ...problemRecord.map(
      (e) => e.problemId + ", " + e.correct + ", " + e.endAt
    ),
  ].join("\r\n");
  const csvURL = `data:text/csv;charset=utf-8,%EF%BB%BF'${encodeURIComponent(
    csvData
  )}`;
  const csvFileName = `${expName}-${
    type === 1 ? "加法" : type === 2 ? "加減法" : "乘法"
  }-${count}題-${time < 0 ? "不限時" : `${time}秒`}.csv`;

  const nextStage = useCallback(() => {
    setProblemRecord((problemRecord) => [
      ...problemRecord,
      {
        problemId: gameStage === 0 ? `Example` : gameStage.toString(),
        correct: value === problems[gameStage].answer,
        endAt: +totalTimerTime.toPrecision(4),
      },
    ]);
    const newProblemRecord = [
      ...problemRecord,
      {
        problemId: gameStage === 0 ? `Example` : gameStage.toString(),
        correct: value === problems[gameStage].answer,
        endAt: +totalTimerTime.toPrecision(4),
      },
    ];
    if (gameStage === count) {
      pauseTimer();
      fetch("/api/saveMenArithData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: expName,
          type:
            type === 1
              ? "隨機二位數加法"
              : type === 2
              ? "隨機二位數加減法"
              : "隨機二位數乘法",
          count: count,
          timeLimit: time,
          Records: newProblemRecord,
        }),
      });
    }
    setResult((result) => [...result, value]);
    setValue("");
    setGameStage(gameStage + 1);
    setLastTimePoint(totalTimerTime);
  }, [
    gameStage,
    value,
    problems,
    totalTimerTime,
    pauseTimer,
    count,
    problemRecord,
    time,
    type,
    expName,
  ]);

  const startAllTimer = () => {
    startTotalTimer();
  };

  useEffect(() => {
    if (noLimit || gameEnd) return;
    if (totalTimerTime - lastTimePoint >= time) {
      nextStage();
    }
  }, [noLimit, nextStage, gameEnd, time, totalTimerTime, lastTimePoint]);

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
          <a
            href={csvURL}
            download={csvFileName}
            className="text-white hover:underline m-2"
          >
            下載實驗數據
          </a>
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
            <h2>
              {noLimit
                ? `不限時`
                : `剩 ${Math.ceil(time - (totalTimerTime - lastTimePoint))} 秒`}
            </h2>
            <h2>{isExample ? "範例" : `第 ${gameStage} 題`}</h2>
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
                if (isExample) startAllTimer();
                nextStage();
              }
            }}
          />
          {isExample && (
            <button
              className="text-white rounded-md border-2 border-white my-4 p-2 hover:bg-slate-300 hover:text-black"
              onClick={() => {
                startAllTimer();
                nextStage();
              }}
            >
              我了解了，開始作答(測試)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamComp;
