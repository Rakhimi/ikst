'use client'

import React from "react";
import { Cycle } from "@prisma/client";
import { useRouter } from 'next/navigation';

type ResultList2Props = {
  cycles: (
    | (Cycle & {
        islamicSet?: { id: number; title: string } | null;
        quranSet?: { id: number; title: string } | null;
      })
    | null
  )[];
};

const ResultSetList: React.FC<ResultList2Props> = ({ cycles }) => {
  
  const router = useRouter();

  if (!cycles || cycles.length === 0) {
    return <p>No cycles available.</p>;
  }

  return (
    <ul className="m-10">
      {cycles.map((cycle) => (
        <li key={cycle?.id}>
          <div className="w-1/4 p-2 bg-gray-100 border rounded-md hover:bg-gray-200 cursor-pointer mb-5 text-center"
          onClick={() => {
            router.push(`/resultSet/${cycle?.id}/${cycle?.name}`);
          }}
          >
          <h2 className="font-semibold text-gray-700">{cycle?.name}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ResultSetList;
