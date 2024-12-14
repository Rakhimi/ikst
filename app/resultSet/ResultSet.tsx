'use client'

import React from "react";

type ResultListProps = {
  groupedResults: Record<
    string,
    { profile: { id: number; firstName: string; lastName: string; school: string }; islamicResult: number | null; quranResult: number | null }[]
  >;
  name : string
};

const ResultSet: React.FC<ResultListProps> = ({ groupedResults, name }) => {
  // Calculate averages for a school
  const calculateSchoolAverage = (results: { islamicResult: number | null; quranResult: number | null }[]) => {
    const islamicSum = results.reduce((sum, result) => sum + (result.islamicResult ?? 0), 0);
    const quranSum = results.reduce((sum, result) => sum + (result.quranResult ?? 0), 0);
    const countIslamic = results.filter((result) => result.islamicResult !== null).length;
    const countQuran = results.filter((result) => result.quranResult !== null).length;

    return {
      islamicAverage: countIslamic ? (islamicSum / countIslamic).toFixed(2) : "N/A",
      quranAverage: countQuran ? (quranSum / countQuran).toFixed(2) : "N/A",
    };
  };

  // Calculate overall averages
  const allResults = Object.values(groupedResults).flat();
  const overallAverage = calculateSchoolAverage(allResults);

  return (
    <div className="my-10 flex flex-col gap-4 w-3/4">
      <h1 className="font-semibold text-2xl">Results {name}</h1>
      <div className="flex flex-col gap-10">
        {Object.entries(groupedResults).map(([school, results]) => {
          const schoolAverage = calculateSchoolAverage(results);

          return (
            <div key={school} className="flex flex-col gap-2">
              <h2 className="font-semibold text-xl">{school}</h2>
              <div>
                <table className="table-auto divide-y divide-gray-200 border border-gray-300 w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2">Profile</th>
                      <th className="px-4 py-2">Islamic</th>
                      <th className="px-4 py-2">Quran</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-center">
                    {results.map((result) => (
                      <tr key={result.profile.id}>
                        <td className="px-4 py-2">{result.profile.firstName} {result.profile.lastName}</td>
                        <td className="px-4 py-2">{result.islamicResult ?? "N/A"}</td>
                        <td className="px-4 py-2">{result.quranResult ?? "N/A"}</td>
                      </tr>
                    ))}
                    {/* School average row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-2">Average</td>
                      <td className="px-4 py-2">{schoolAverage.islamicAverage}</td>
                      <td className="px-4 py-2">{schoolAverage.quranAverage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        {/* All school average row */}
        <div className="flex flex-col gap-2 mt-4">
          <h2 className="font-semibold text-xl">All School Average</h2>
          <table className="table-auto border border-gray-300 w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Islamic</th>
                <th className="px-4 py-2">Quran</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50 font-semibold text-center">
                <td className="px-4 py-2">{overallAverage.islamicAverage}</td>
                <td className="px-4 py-2">{overallAverage.quranAverage}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultSet;
