'use client'

import React from "react";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

type ResultListProps = {
  groupedResults: Record<
    string,
    { profile: { id: number; firstName: string; lastName: string; school: string }; islamicResult: number | null; quranResult: number | null }[]
  >;
  name: string;
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

  // Calculate all-school average
  const calculateAllSchoolAverage = () => {
    const allResults = Object.values(groupedResults).flat();
    return calculateSchoolAverage(allResults);
  };

  const allSchoolAverage = calculateAllSchoolAverage();

  // Generate PDF for a specific school
  const generatePDF = (school: string, results: { profile: { firstName: string; lastName: string }; islamicResult: number | null; quranResult: number | null }[], schoolAverage: { islamicAverage: string; quranAverage: string }) => {
    const doc = new jsPDF();
    const tableBody = results.map((result) => [
      `${result.profile.firstName} ${result.profile.lastName}`,
      result.islamicResult ?? "N/A",
      result.quranResult ?? "N/A",
    ]);

    // Add average row
    tableBody.push([
      "Average",
      schoolAverage.islamicAverage,
      schoolAverage.quranAverage,
    ]);

    // Add all-school average row
    tableBody.push([
      "All School Average",
      allSchoolAverage.islamicAverage,
      allSchoolAverage.quranAverage,
    ]);

    doc.text(`Results for ${school}`, 14, 10);
    autoTable(doc, {
      head: [["Profile", "Islamic", "Quran"]],
      body: tableBody,
      startY: 20,
    });

    doc.save(`${school}_results.pdf`);
  };

  return (
    <div className="my-10 flex flex-col gap-4 w-3/4">
      <h1 className="font-semibold text-2xl">Results {name}</h1>
      <div className="flex flex-col gap-10">
        {Object.entries(groupedResults).map(([school, results]) => {
          const schoolAverage = calculateSchoolAverage(results);

          return (
            <div key={school} className="flex flex-col gap-4">
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
                        <td className="px-4 py-2">
                          {result.profile.firstName} {result.profile.lastName}
                        </td>
                        <td className="px-4 py-2">{result.islamicResult ?? "N/A"}</td>
                        <td className="px-4 py-2">{result.quranResult ?? "N/A"}</td>
                      </tr>
                    ))}
                    {/* School average row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-2">School Average</td>
                      <td className="px-4 py-2">{schoolAverage.islamicAverage}</td>
                      <td className="px-4 py-2">{schoolAverage.quranAverage}</td>
                    </tr>
                    {/* All-school average row */}
                    <tr className="bg-gray-100 font-semibold">
                      <td className="px-4 py-2">All School Average</td>
                      <td className="px-4 py-2">{allSchoolAverage.islamicAverage}</td>
                      <td className="px-4 py-2">{allSchoolAverage.quranAverage}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Download PDF Button */}
              <button
                onClick={() => generatePDF(school, results, schoolAverage)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              >
                Download PDF
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultSet;
