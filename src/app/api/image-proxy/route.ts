import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validate URL
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Allow http and https URLs (some CDNs or legacy sources may return http). Block anything else.
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return NextResponse.json({ error: 'Only HTTP/HTTPS URLs are allowed' }, { status: 400 });
    }

    console.debug('[image-proxy] fetching', imageUrl);

    // Fetch the image (allow redirects). Some hosts require a UA header.
    const upstream = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; News-App/1.0)',
        'Accept': 'image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      console.warn(`[image-proxy] upstream fetch failed: ${upstream.status} ${upstream.statusText} for ${imageUrl}`);
      return NextResponse.json({ error: `Upstream fetch failed with status ${upstream.status}` }, { status: 502 });
    }

    // Get content-type; if missing try to infer from URL extension, otherwise default to generic image type
    let contentType = upstream.headers.get('content-type') || '';
    if (!contentType) {
      const extMatch = imageUrl.match(/\.([a-zA-Z0-9]{2,5})(?:[?#]|$)/);
      const ext = extMatch ? extMatch[1].toLowerCase() : null;
      switch (ext) {
        case 'png': contentType = 'image/png'; break;
        case 'jpg':
        case 'jpeg': contentType = 'image/jpeg'; break;
        case 'webp': contentType = 'image/webp'; break;
        case 'avif': contentType = 'image/avif'; break;
        case 'gif': contentType = 'image/gif'; break;
        case 'svg': contentType = 'image/svg+xml'; break;
        default: contentType = 'image/*';
      }
    }

    if (contentType && !contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'URL does not point to an image' }, { status: 400 });
    }

    // Prepare headers for the proxied response. Prefer upstream cache-control when present.
    const headers: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': contentType,
    };

    const upstreamCache = upstream.headers.get('cache-control') || upstream.headers.get('Cache-Control');
    if (upstreamCache) {
      headers['Cache-Control'] = upstreamCache;
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    // Stream the upstream body back to the client rather than buffering everything in memory.
    const body = upstream.body;

    return new NextResponse(body, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}