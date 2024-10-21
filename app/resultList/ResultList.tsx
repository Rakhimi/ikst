'use client';

import React, { useEffect, useState } from 'react';
import { resultList } from '@/lib/results';
import { Button } from '@/components/ui/button';
import { resultAverage } from '@/lib/resultsAverage';
import toast from 'react-hot-toast';

enum GradeOption {
  GR3 = "GR3",
  GR7 = "GR7"
}

enum TypeOption {
  Islamic = "Islamic",
  Quran = "Quran"
}

enum SchoolOption {
  ALSTX = 'ALSTX',
  WDLTX = 'WDLTX',
  BILTX = 'BILTX',
  MCAMI = 'MCAMI',
  MABIL = 'MABIL'
}

interface AnswerSet {
  date: string;
  grade: GradeOption;
  type: TypeOption;
  result: number | null;
  id: number;
  createdAt: Date;
}

interface Result {
  id: number;
  firstName: string;
  lastName: string;
  answerSets: AnswerSet[];
  userId: number;
  school: SchoolOption;
}

interface ResultError {
  errors: {
    general: string;
  };
}

type ResultsResponse = Result[] | ResultError | undefined;

const schoolNames: Record<SchoolOption, string> = {
  ALSTX: 'AlSalam Spring TX',
  WDLTX: 'Woodland TX',
  BILTX: 'Bilal ISGH TX',
  MCAMI: 'MCA Ann Arbor',
  MABIL: 'MABIL',
};

const ResultList = () => {
  const [data, setData] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);


  const updateResultsWithAverages = async () => {
    try {
        const result = await resultAverage();
        console.log(result);
        toast.success("Results updated with averages successfully.");
    } catch (error) {
        toast.error("Error updating results with averages:")
        console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await resultList() as ResultsResponse;

      if (results && 'errors' in results) {
        setError(results.errors.general);
      } else if (Array.isArray(results)) {
        setData(results);
      }
    };

    fetchData();
  }, []);

  const renderTable = (profiles: Result[], grade: GradeOption, allProfiles: Result[], schoolId: string) => {
    // Filter profiles for the same school and same grade
    const filteredProfilesSameSchoolSameGrade = profiles.filter(profile =>
      profile.answerSets.some(set => set.grade === grade) && profile.school === schoolId
    );
  
    // Filter profiles for all schools but same grade
    const filteredProfilesAllSchoolSameGrade = allProfiles.filter(profile =>
      profile.answerSets.some(set => set.grade === grade)
    );
  
    // Helper function to calculate the average of a specific type (Quran or Islamic)
    const calculateAverage = (data: Result[], type: TypeOption) => {
      const results = data
        .map(profile => profile.answerSets.find(set => set.type === type)?.result)
        .filter(result => result !== null && result !== undefined) as number[];
  
      if (results.length === 0) return 'N/A';
  
      const sum = results.reduce((acc, curr) => acc + curr, 0);
      return (sum / results.length)
    };
  
    // Averages for same school and same grade
    const averageQuranSameSchoolSameGrade = calculateAverage(filteredProfilesSameSchoolSameGrade, TypeOption.Quran);
    const averageIslamicSameSchoolSameGrade = calculateAverage(filteredProfilesSameSchoolSameGrade, TypeOption.Islamic);
  
    // Averages for all schools but same grade
    const averageQuranAllSchoolSameGrade = calculateAverage(filteredProfilesAllSchoolSameGrade, TypeOption.Quran);
    const averageIslamicAllSchoolSameGrade = calculateAverage(filteredProfilesAllSchoolSameGrade, TypeOption.Islamic);
  
    return (
      <div>
        {/* Table for same school and same grade */}
        <table className='divide-y divide-gray-200 mb-8'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-center'>Name</th>
              <th className='px-6 py-3 text-center'>Quran</th>
              <th className='px-6 py-3 text-center'>Islamic</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {filteredProfilesSameSchoolSameGrade.map((profile) => (
              <tr key={profile.id}>
                <td className='px-6 py-3 text-center'>{`${profile.firstName} ${profile.lastName}`}</td>
                <td className='px-6 py-3 text-center'>
                  {profile.answerSets.find(set => set.type === TypeOption.Quran)?.result ?? 'N/A'}
                </td>
                <td className='px-6 py-3 text-center'>
                  {profile.answerSets.find(set => set.type === TypeOption.Islamic)?.result ?? 'N/A'}
                </td>
              </tr>
            ))}
            <tr>
              <td className='px-6 py-3 font-bold text-center'>Average</td>
              <td className='px-6 py-3 font-bold text-center'>{averageQuranSameSchoolSameGrade}</td>
              <td className='px-6 py-3 font-bold text-center'>{averageIslamicSameSchoolSameGrade}</td>
            </tr>
            <tr>
              <td className='px-6 py-3 font-bold text-center'>Average All School</td>
              <td className='px-6 py-3 font-bold text-center'>{averageQuranAllSchoolSameGrade}</td>
              <td className='px-6 py-3 font-bold text-center'>{averageIslamicAllSchoolSameGrade}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
  
  
  

  const renderTablesBySchool = (profiles: Result[], grade: GradeOption, school: SchoolOption) => {
    const filteredBySchool = profiles.filter(profile => profile.school === school);

    if (filteredBySchool.length === 0) return null;

    return (
      <div className="my-4">
        {renderTable(filteredBySchool, grade, profiles, school)}
      </div>
    );
  };

  const renderTablesByDate = () => {
    const dates = Array.from(new Set(data.flatMap(profile => profile.answerSets.map(set => set.date))));

    return dates.map((date) => (
      <div key={date} className="">
        <h2 className='font-semibold text-2xl mb-10'>Date: {date}</h2>
        <div className='flex flex-col gap-4 ml-2 border rounded-md p-4'>
          {Object.keys(schoolNames).map((school) => (
            <div key={school}>
              <h3 className='font-semibold text-xl'>School: {schoolNames[school as SchoolOption]}</h3>
              <h4 className='font-semibold text-lg ml-4'>Grade GR3</h4>
              {renderTablesBySchool(
                data.filter(profile => profile.answerSets.some(set => set.date === date)),
                GradeOption.GR3,
                school as SchoolOption // Cast to SchoolOption
              )}
              <h4 className='font-semibold text-lg ml-4'>Grade GR7</h4>
              {renderTablesBySchool(
                data.filter(profile => profile.answerSets.some(set => set.date === date)),
                GradeOption.GR7,
                school as SchoolOption // Cast to SchoolOption
              )}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='font-semibold text-3xl'>Results</h1>
      <div className='w-1/3'>
      <Button onClick={updateResultsWithAverages}>Generate Individual Result</Button>
      </div>
      {error ? (
        <p>{error}</p>
      ) : data.length > 0 ? (
        renderTablesByDate()
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ResultList;
