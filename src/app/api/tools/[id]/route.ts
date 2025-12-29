import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// GET single tool by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tool = await db.tool.findUnique({
      where: { id },
      include: {
        submittedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tool);
  } catch (error) {
    console.error("Failed to fetch tool:", error);
    return NextResponse.json(
      { error: "Failed to fetch tool" },
      { status: 500 }
    );
  }
}

// PUT update tool
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Check if tool exists
    const existingTool = await db.tool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    // Update slug if name changed
    let slug = existingTool.slug;
    if (body.name && body.name !== existingTool.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const updatedTool = await db.tool.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        tagline: body.tagline,
        description: body.description,
        logoUrl: body.logoUrl,
        websiteUrl: body.websiteUrl,
        affiliateLink: body.affiliateLink,
        category: body.category,
        pricing: body.pricing,
        priceInr: body.priceInr ? parseFloat(body.priceInr) : null,
        freeTier: body.freeTier ?? false,
        features: body.features || [],
        useCases: body.useCases || [],
        tags: body.tags || [],
        featured: body.featured ?? false,
        verified: body.verified ?? false,
      },
    });

    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error("Failed to update tool:", error);
    return NextResponse.json(
      { error: "Failed to update tool" },
      { status: 500 }
    );
  }
}

// DELETE tool
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if tool exists
    const existingTool = await db.tool.findUnique({
      where: { id },
    });

    if (!existingTool) {
      return NextResponse.json(
        { error: "Tool not found" },
        { status: 404 }
      );
    }

    await db.tool.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Tool deleted" });
  } catch (error) {
    console.error("Failed to delete tool:", error);
    return NextResponse.json(
      { error: "Failed to delete tool" },
      { status: 500 }
    );
  }
}
