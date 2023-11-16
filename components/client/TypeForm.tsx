"use client";
import Link from "next/link";
import { useState } from "react";

type problemInfo = {
  type: number;
  count: number;
  time: number;
};

const TypeForm = () => {
  const [problemInfo, setProblemInfo] = useState<problemInfo>({
    type: 1,
    count: 10,
    time: 0,
  });
  return (
    <div className="flex flex-col items-center justify-start mt-10">
      <label className="p-2" htmlFor="problem-type">
        測驗種類
      </label>
      <select
        className="p-2 text-black"
        id="problem-type"
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
        defaultValue={20}
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
        defaultValue={0}
        min={0}
        step={1}
        onChange={(e) =>
          setProblemInfo({ ...problemInfo, time: +e.target.value })
        }
      />
      <Link
        href={`/test?type=${problemInfo.type}&count=${problemInfo.count}&time=${problemInfo.time}`}
        passHref
        className="p-2 border-2 border-white hover:bg-slate-900 hover:text-white mt-1 w-24 text-center"
      >
        開始
      </Link>
    </div>
  );
};

export default TypeForm;
