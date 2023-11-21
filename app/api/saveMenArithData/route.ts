import { prisma } from "@/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { name, type, count, timeLimit, Records } = await request.json();
    console.log(name, type, count, timeLimit, Records);
    const result = await prisma.mental_Arith_Record.create({
      data: { name, type, count, timeLimit, Records },
    });

    return NextResponse.json(result, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error },
      { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
