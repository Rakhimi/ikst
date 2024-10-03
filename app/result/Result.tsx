'use client'

import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
  } from "@/components/ui/card"

const Result = () => {



  return (
    <div className='mt-10'>
    <Card>
    <CardHeader className='text-xl'>
        <CardTitle className='mb-2 text-2xl'>Grade Report IKST</CardTitle>
        <CardTitle>Amir Azim</CardTitle>
        <CardTitle>GR3</CardTitle>
        <CardTitle>ALSTX</CardTitle>
    </CardHeader>
    <CardContent>
    
    <div className='flex justify-between'>
    <div className='flex gap-16 text-xl font-semibold'>
        <div>
        Islamic Studies
        </div>
        <div>
        Your result: 90%
        </div>
    </div>

    <div className="relative w-1/2 h-10 bg-gray-300">
    {/* Progress bar */}
    <div
        className="h-full bg-gradient-to-r from-red-500 to-green-500"
        style={{ width: '100%' }}
    ></div>

    {/* Markers and percentage values */}
    <div className="absolute inset-0 h-full pointer-events-none">
        {[
        { value: 43, color: 'bg-red-700', labelColor: 'text-red-700' },
        { value: 56, color: 'bg-sky-700', labelColor: 'text-sky-700' },
        { value: 90, color: 'bg-black', labelColor: 'text-black' },
        ].map((marker) => (
        <div
            key={marker.value}
            className="absolute bottom-px"
            style={{ left: `${marker.value}%`, transform: 'translateX(-50%)' }}
        >
            {/* Marker value positioned above */}
            <div className={`text-md font-semibold text-center ${marker.labelColor}`}>
            {marker.value}%
            </div>
            {/* Marker line */}
            <div className={`w-1.5 h-12 ${marker.color}`}></div>
        </div>
        ))}
    </div>
    </div>
    </div>
    <div className='flex justify-between mt-10'>
    <div className='flex gap-36 text-xl font-semibold'>
        <div>
        Quran
        </div>
        <div>
        Your result: 80%
        </div>
    </div>

    <div className="relative w-1/2 h-10 bg-gray-300">
    {/* Progress bar */}
    <div
        className="h-full bg-gradient-to-r from-red-500 to-green-500"
        style={{ width: '100%' }}
    ></div>

    {/* Markers and percentage values */}
    <div className="absolute inset-0 h-full pointer-events-none">
        {[
        { value: 40, color: 'bg-red-700', labelColor: 'text-red-700' },
        { value: 60, color: 'bg-sky-700', labelColor: 'text-sky-700' },
        { value: 80, color: 'bg-black', labelColor: 'text-black' },
        ].map((marker) => (
        <div
            key={marker.value}
            className="absolute bottom-px"
            style={{ left: `${marker.value}%`, transform: 'translateX(-50%)' }}
        >
            {/* Marker value positioned above */}
            <div className={`text-md font-semibold text-center ${marker.labelColor}`}>
            {marker.value}%
            </div>
            {/* Marker line */}
            <div className={`w-1.5 h-12 ${marker.color}`}></div>
        </div>
        ))}
    </div>
    </div>
    </div>
    </CardContent>
    <CardFooter>
        <p className='text-lg font-semibold'>Blue line is school average. Red line is average of all schools</p>
    </CardFooter>
    </Card>
    
    </div>
  )
}

export default Result