import prisma from "@/lib/prismadb";
import { Cycle } from "@prisma/client";

export default async function getResultCycleList(): Promise<Cycle[] | null> {
  try {
    
    const cycles = await prisma.cycle.findMany({
      include: {
        islamicSet: true, 
        quranSet: true,   
      },
    });

    return cycles || [];
  } catch (error) {
    console.error("Error fetching cycles:", error);
    return null;
  }
}
