import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/data';
import type { Stairs } from '@/types';

// GET /api/stairs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    const stairs = data.stairs?.find((s: Stairs) => s.id === id);
    
    if (!stairs) {
      return NextResponse.json({ error: 'Stairs not found' }, { status: 404 });
    }
    
    return NextResponse.json(stairs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/stairs/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = readData();
    const index = data.stairs?.findIndex((s: Stairs) => s.id === id) ?? -1;
    
    if (index === -1) {
      return NextResponse.json({ error: 'Stairs not found' }, { status: 404 });
    }
    
    data.stairs[index] = { ...data.stairs[index], ...body };
    writeData(data);
    
    return NextResponse.json(data.stairs[index]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/stairs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = readData();
    data.stairs = data.stairs?.filter((s: Stairs) => s.id !== id) || [];
    writeData(data);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






