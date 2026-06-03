export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const walrusRes = await fetch('https://publisher.walrus.space/v1/blobs?epochs=5', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/octet-stream' },
      body,
    });

    if (!walrusRes.ok) throw new Error(`Walrus error: ${walrusRes.status}`);
    const data = await walrusRes.json();
    const blobId = data?.newlyCreated?.blobObject?.blobId || data?.alreadyCertified?.blobId || data?.blobId;
    if (!blobId) throw new Error('No blob ID');

    res.status(200).json({ blobId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
