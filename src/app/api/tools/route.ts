import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// GET all tools with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      published: true,
    };

    if (category && category !== 'all') {
      where.category = category.toUpperCase().replace(/-/g, '_');
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tagline: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tools, total] = await Promise.all([
      db.tool.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { featured: 'desc' },
          { verified: 'desc' },
          { views: 'desc' },
        ],
        select: {
          id: true,
          slug: true,
          name: true,
          tagline: true,
          description: true,
          logoUrl: true,
          websiteUrl: true,
          category: true,
          pricing: true,
          priceInr: true,
          freeTier: true,
          featured: true,
          verified: true,
          views: true,
          createdAt: true,
        },
      }),
      db.tool.count({ where }),
    ]);

    return NextResponse.json({
      tools,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Get tools error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

// POST - Create new tool (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    
    const tool = await db.tool.create({
      data: {
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        name: body.name,
        tagline: body.tagline,
        description: body.description,
        logoUrl: body.logoUrl || null,
        screenshotUrls: body.screenshotUrls || [],
        websiteUrl: body.websiteUrl,
        affiliateLink: body.affiliateLink || null,
        category: body.category,
        tags: body.tags || [],
        pricing: body.pricing,
        priceInr: body.priceInr || null,
        priceUsd: body.priceUsd || null,
        freeTier: body.freeTier || false,
        features: body.features || [],
        useCases: body.useCases || [],
        featured: body.featured || false,
        verified: false,
        published: body.published !== false,
        submittedById: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      tool,
    });
  } catch (error) {
    console.error('Create tool error:', error);
    return NextResponse.json(
      { error: 'Failed to create tool' },
      { status: 500 }
    );
  }
}
