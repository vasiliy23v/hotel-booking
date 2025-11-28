import { NextRequest, NextResponse } from 'next/server';
import { getStairsById, updateStairs, deleteStairs } from '@/lib/db';

// GET /api/stairs/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stairs = await getStairsById(id);
    
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
    const updatedStairs = await updateStairs(id, body);
    
    return NextResponse.json(updatedStairs);
  } catch (error: any) {
    if (error.message === 'Лестница не найдена') {
      return NextResponse.json({ error: 'Stairs not found' }, { status: 404 });
    }
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
    await deleteStairs(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}






