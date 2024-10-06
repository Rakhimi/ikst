import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { startTime, endTime, questionSetId } = body; // Assuming questionSetId is passed too

    // Get the current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure that startTime and endTime are present
    if (!startTime || !endTime) {
      return NextResponse.json(
        { error: "Start time and end time are required" },
        { status: 400 }
      );
    }

    // Convert startTime and endTime to Date objects
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Validate that the endTime is after the startTime
    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Ensure the questionSetId is provided and valid
    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    // Create the schedule in the database using Prisma
    const schedule = await prisma.schedule.create({
      data: {
        startTime: startDate,
        endTime: endDate,
        questionSetId: Number(questionSetId) // Foreign key for the related question set
      },
    });

    // Return the created schedule
    return NextResponse.json(schedule); // Prisma already knows the correct type
  } catch (error) {
    // Handle any errors that occur
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the schedule" },
      { status: 500 }
    );
  }
}
