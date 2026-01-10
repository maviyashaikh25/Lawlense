const { Pinecone } = require("@pinecone-database/pinecone");
const http = require("http");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX);

// Helper to get embedding from ML service
async function getEmbedding(text) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ text });
        const options = {
            hostname: '127.0.0.1',
            port: 8000,
            path: '/embed',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed.embedding);
                    } catch (e) {
                        reject(new Error("Failed to parse ML service response"));
                    }
                } else {
                    reject(new Error(`ML Service returned status: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(`ML Service request failed: ${e.message}`));
        });

        req.setTimeout(5000, () => {
             req.destroy();
             reject(new Error("ML Service request timed out"));
        });

        req.write(postData);
        req.end();
    });
}

exports.semanticSearch = async (query) => {
  try {
    // Use native http to avoid axios/fetch hangs
    const embedding = await getEmbedding(query);

    const result = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    return result.matches;
  } catch (error) {
    console.error("Error in semantic search:", error.message);
    throw error;
  }
};

exports.upsertDocument = async (documentId, text) => {
    try {
        console.log(`[Pinecone] Splitting and upserting document: ${documentId}`);
        // 1. Chunking (Simple paragraph split with max size)
        const chunks = [];
        const MAX_CHUNK_SIZE = 1000;
        let currentChunk = "";
        
        // Normalize text
        const safeText = text || "";
        const paragraphs = safeText.split(/\n\s*\n/);
        
        for (const para of paragraphs) {
            // If adding this paragraph exceeds max size, push current chunk
            if ((currentChunk + para).length > MAX_CHUNK_SIZE && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            currentChunk += para + "\n\n";
        }
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        
        console.log(`[Pinecone] Generated ${chunks.length} chunks.`);

        // 2. Embed and Batch Upsert
        const vectors = [];
        
        for (let i = 0; i < chunks.length; i++) {
            try {
                const chunk = chunks[i];
                if (!chunk) continue;
                
                const embedding = await getEmbedding(chunk);
                
                vectors.push({
                    id: `${documentId}_${i}`,
                    values: embedding,
                    metadata: {
                        text: chunk,
                        documentId: documentId.toString()
                    }
                });
            } catch (err) {
                 console.error(`[Pinecone] Failed to embed chunk ${i}: ${err.message}`);
            }
        }
        
        if (vectors.length > 0) {
            // Pinecone supports batch upsert (max 1000 or 2MB usually)
            // We have small number of chunks for typical contracts
            await index.upsert(vectors);
            console.log(`[Pinecone] Successfully upserted ${vectors.length} vectors.`);
        }
        
    } catch (error) {
        console.error("Error in upsertDocument:", error.message);
        // Don't throw, just log. We don't want to break the whole upload flow if Pinecone fails.
    }
};
