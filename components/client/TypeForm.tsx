"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

type problemInfo = {
  expName: string;
  type: number;
  count: number;
  time: number;
};

const TypeForm = () => {
  const [problemInfo, setProblemInfo] = useState<problemInfo>({
    expName: "test",
    type: 1,
    count: 20,
    time: 0,
  });
  useEffect(() => {
    setProblemInfo({
      expName: localStorage.getItem("expName") || "test",
      type: localStorage.getItem("type") ? +localStorage.getItem("type")! : 1,
      count: localStorage.getItem("count")
        ? +localStorage.getItem("count")!
        : 20,
      time: localStorage.getItem("time") ? +localStorage.getItem("time")! : 0,
    });
  }, []);
  return (
    <div className="flex flex-col items-center justify-start mt-10">
      <label className="p-2" htmlFor="exp-name">
        實驗名稱
      </label>
      <input
        className="p-2 text-black"
        type="text"
        id="exp-name"
        value={problemInfo.expName}
        onChange={(e) =>
          setProblemInfo({ ...problemInfo, expName: e.target.value })
        }
      />
      <label className="p-2" htmlFor="problem-type">
        測驗種類
      </label>
      <select
        className="p-2 text-black"
        id="problem-type"
        value={problemInfo.type}
        onChange={(e) =>
          setProblemInfo({ ...problemInfo, type: +e.target.value })
        }
      >
        <option value="1">隨機二位數加法</option>
        <option value="2">隨機二位數加減法</option>
        <option value="3">隨機二位數乘法</option>
      </select>
      <label className="p-2" htmlFor="problem-count">
        題目數量
      </label>
      <input
        className="p-2 text-black"
        type="number"
        id="problem-count"
        value={problemInfo.count}
        onChange={(e) =>
          setProblemInfo({ ...problemInfo, count: +e.target.value })
        }
      />
      <label className="p-2" htmlFor="problem-time">
        題目時間(秒，0為無限制)
      </label>
      <input
        className="p-2 text-black"
        type="number"
        id="problem-time"
        value={problemInfo.time}
        min={0}
        step={1}
        onChange={(e) =>
          setProblemInfo({ ...problemInfo, time: +e.target.value })
        }
      />
      <Link
        href={`/test?type=${problemInfo.type}&count=${problemInfo.count}&time=${problemInfo.time}&expName=${problemInfo.expName}`}
        passHref
        className="p-2 border-2 border-white hover:bg-slate-900 hover:text-white mt-1 w-24 text-center"
        onClick={() => {
          localStorage.setItem("expName", problemInfo.expName);
          localStorage.setItem("type", problemInfo.type.toString());
          localStorage.setItem("count", problemInfo.count.toString());
          localStorage.setItem("time", problemInfo.time.toString());
        }}
      >
        開始
      </Link>
    </div>
  );
};

export default TypeForm;
