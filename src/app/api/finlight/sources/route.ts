import { NextResponse } from 'next/server';
import { finlight } from '@/lib/finlight';

export async function GET() {
  try {
    
    const sources = await finlight.sources.getSources();
    return NextResponse.json({ sources }, { status: 200 });
  } catch (err) {
    console.error('Finlight sources fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch finlight sources' }, { status: 500 });
  }
}
