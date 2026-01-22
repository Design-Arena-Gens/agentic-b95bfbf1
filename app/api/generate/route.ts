import { NextResponse } from 'next/server';
import { buildVideoPlan } from '@/app/lib/pipeline';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = buildVideoPlan(body);
    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
