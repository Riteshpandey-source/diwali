const http = require('http');
const https = require('https');
const assert = require('assert');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        body: data
      }));
    }).on('error', reject);
  });
}

async function runSeoVerification() {
  console.log('====================================================');
  console.log('   PRODUCTION SEO & CWV AUDIT VERIFICATION SUITE   ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(desc, fn) {
    try {
      fn();
      console.log(`  [PASS] ${desc}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${desc}: ${err.message}`);
      failed++;
    }
  }

  // 1. Test /robots.txt
  console.log('--- 1. Testing /robots.txt ---');
  const robotsRes = await fetch('http://localhost:3000/robots.txt');
  test('robots.txt returns HTTP 200', () => {
    assert.strictEqual(robotsRes.statusCode, 200);
  });
  test('robots.txt has text/plain Content-Type', () => {
    assert.ok(robotsRes.headers['content-type'].includes('text/plain'));
  });
  test('robots.txt contains User-agent: * and Allow: /', () => {
    assert.ok(robotsRes.body.includes('User-agent: *'));
    assert.ok(robotsRes.body.includes('Allow: /'));
  });
  test('robots.txt contains correct production Sitemap URL', () => {
    assert.ok(robotsRes.body.includes('Sitemap: https://diwali-i7j4.onrender.com/sitemap.xml'));
  });

  // 2. Test /sitemap.xml
  console.log('\n--- 2. Testing /sitemap.xml ---');
  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  test('sitemap.xml returns HTTP 200', () => {
    assert.strictEqual(sitemapRes.statusCode, 200);
  });
  test('sitemap.xml has application/xml Content-Type', () => {
    assert.ok(sitemapRes.headers['content-type'].includes('application/xml'));
  });
  test('sitemap.xml contains correct production <loc>', () => {
    assert.ok(sitemapRes.body.includes('<loc>https://diwali-i7j4.onrender.com/</loc>'));
  });
  test('sitemap.xml has valid XML declaration and urlset tags', () => {
    assert.ok(sitemapRes.body.startsWith('<?xml version="1.0"'));
    assert.ok(sitemapRes.body.includes('<urlset'));
    assert.ok(sitemapRes.body.includes('</urlset>'));
  });
  test('sitemap.xml includes image sitemap metadata', () => {
    assert.ok(sitemapRes.body.includes('og_preview.jpg'));
    assert.ok(sitemapRes.body.includes('diwali_logo.png'));
  });

  // 3. Test Social Preview Asset /assets/images/og_preview.jpg
  console.log('\n--- 3. Testing Social Preview Asset ---');
  const imgRes = await fetch('http://localhost:3000/assets/images/og_preview.jpg');
  test('og_preview.jpg returns HTTP 200', () => {
    assert.strictEqual(imgRes.statusCode, 200);
  });
  test('og_preview.jpg has image/jpeg Content-Type', () => {
    assert.ok(imgRes.headers['content-type'].includes('image/jpeg'));
  });

  // 4. Test Soft-404 Guard
  console.log('\n--- 4. Testing Soft-404 Guard ---');
  const nonExistentRes = await fetch('http://localhost:3000/missing_asset_test.png');
  test('Missing static file returns HTTP 404 (not 200 fallback)', () => {
    assert.strictEqual(nonExistentRes.statusCode, 404);
  });

  // 5. Test HTML SEO Elements in /
  console.log('\n--- 5. Testing HTML Metadata, OpenGraph & Structured Data ---');
  const htmlRes = await fetch('http://localhost:3000/');
  const html = htmlRes.body;

  test('Page Title exists and is optimized (length <= 65 chars)', () => {
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    assert.ok(titleMatch, 'Title tag must exist');
    const title = titleMatch[1];
    assert.ok(title.includes('Shubh Deepawali'), 'Title must contain primary brand/celebration keyword');
    assert.ok(title.length <= 65, `Title length is ${title.length}, expected <= 65`);
  });

  test('Meta Description exists and is optimal length (140-165 chars)', () => {
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    assert.ok(descMatch, 'Meta description must exist');
    const desc = descMatch[1];
    assert.ok(desc.length >= 120 && desc.length <= 165, `Description length is ${desc.length}, expected 120-165`);
  });

  test('Canonical URL is set to production URL without duplicate canonicals', () => {
    const canonicalMatches = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/gi);
    assert.ok(canonicalMatches && canonicalMatches.length === 1, 'Exactly one canonical link required');
    assert.ok(canonicalMatches[0].includes('https://diwali-i7j4.onrender.com/'));
  });

  test('Robots meta tag permits indexing and snippet/image preview', () => {
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["'](.*?)["']/i);
    assert.ok(robotsMatch, 'Robots meta tag must exist');
    const content = robotsMatch[1];
    assert.ok(content.includes('index'), 'Must allow indexing');
    assert.ok(content.includes('follow'), 'Must follow links');
    assert.ok(!content.includes('noindex'), 'Must not have accidental noindex');
  });

  test('Open Graph metadata (og:title, og:description, og:image, og:url, og:site_name)', () => {
    assert.ok(html.includes('property="og:site_name"'), 'og:site_name required');
    assert.ok(html.includes('property="og:title"'), 'og:title required');
    assert.ok(html.includes('property="og:description"'), 'og:description required');
    assert.ok(html.includes('property="og:url" content="https://diwali-i7j4.onrender.com/"'), 'og:url must be absolute production URL');
    assert.ok(html.includes('property="og:image" content="https://diwali-i7j4.onrender.com/assets/images/og_preview.jpg"'), 'og:image must be absolute URL');
    assert.ok(html.includes('property="og:image:width" content="1376"'), 'og:image:width required');
    assert.ok(html.includes('property="og:image:height" content="768"'), 'og:image:height required');
  });

  test('Twitter Card metadata (summary_large_image, image, title, desc)', () => {
    assert.ok(html.includes('name="twitter:card" content="summary_large_image"'), 'twitter:card must be summary_large_image');
    assert.ok(html.includes('name="twitter:title"'), 'twitter:title required');
    assert.ok(html.includes('name="twitter:description"'), 'twitter:description required');
    assert.ok(html.includes('name="twitter:image" content="https://diwali-i7j4.onrender.com/assets/images/og_preview.jpg"'), 'twitter:image must be absolute URL');
  });

  test('Preload tag configured for critical LCP hero asset', () => {
    assert.ok(html.includes('<link rel="preload" as="image" href="assets/images/diwali_logo.png">'));
  });

  test('Schema.org JSON-LD structured data is present and valid JSON', () => {
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    assert.ok(jsonLdMatch, 'JSON-LD script must exist');
    const parsed = JSON.parse(jsonLdMatch[1]);
    assert.strictEqual(parsed['@context'], 'https://schema.org');
    assert.ok(Array.isArray(parsed['@graph']), '@graph array required');
    const webApp = parsed['@graph'].find(item => item['@type'] === 'WebApplication');
    const event = parsed['@graph'].find(item => item['@type'] === 'Festival');
    assert.ok(webApp, 'WebApplication schema required');
    assert.ok(event, 'Festival schema required');
    assert.strictEqual(webApp.url, 'https://diwali-i7j4.onrender.com/');
  });

  test('Single H1 tag exists in DOM hierarchy', () => {
    const h1Matches = html.match(/<h1[\s>]/gi);
    assert.ok(h1Matches && h1Matches.length === 1, `Expected exactly 1 H1, found ${h1Matches ? h1Matches.length : 0}`);
  });

  test('All <img> tags have non-empty alt attributes', () => {
    const imgTags = html.match(/<img[^>]+>/gi) || [];
    assert.ok(imgTags.length > 0, 'Image tags should exist in HTML');
    for (const tag of imgTags) {
      assert.ok(/alt=["'][^"']+["']/i.test(tag), `Image tag missing non-empty alt: ${tag}`);
    }
  });

  test('Trademark & non-commercial fan tribute disclaimer is present', () => {
    assert.ok(html.includes('greeting-legal-footer'), 'Legal footer element required');
    assert.ok(html.includes('Neela Film Productions'), 'Disclaimer must mention copyright owner');
    assert.ok(html.includes('non-commercial'), 'Disclaimer must clarify non-commercial fan tribute');
  });

  console.log('\n====================================================');
  console.log(`TOTAL SEO TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSeoVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
