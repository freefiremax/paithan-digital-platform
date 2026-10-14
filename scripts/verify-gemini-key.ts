import { config } from 'dotenv';
config({ path: '.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

console.log(`🔑 GEMINI_API_KEY found (masked): ${GEMINI_API_KEY.slice(0, 4)}...`);

if (GEMINI_API_KEY.length < 10) {
  console.error('❌ GEMINI_API_KEY appears too short');
  process.exit(1);
}

const apiKey = GEMINI_API_KEY;

async function testChatCompletion() {
  const configured = (process.env.GEMINI_MODEL || process.env.GEMINI_CHAT_MODEL || '').trim();
  const model = configured.startsWith('gemini-3.') ? configured : 'gemini-3.8-flash';
  console.log(`\n📝 Testing chat completion (${model})...`);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Say "Hello from Paithan AI test" in exactly those words.' }],
          },
        ],
        generationConfig: { temperature: 0, maxOutputTokens: 50 },
      }),
    }
  );

  const status = response.status;
  const data = await response.json();
  console.log(`   HTTP Status: ${status}`);
  
  if (status === 200) {
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    console.log(`   ✅ Success! Reply: "${reply}"`);
    return true;
  } else if (status === 400) {
      console.error(`   ❌ 400 Bad Request: ${data.error?.message || 'Request rejected'}`);
  } else if (status === 401 || status === 403) {
    console.error(`   ❌ ${status} Unauthorized/Forbidden: Invalid API key`);
  } else if (status === 429) {
    console.error(`   ❌ 429 Too Many Requests: Quota exceeded`);
  } else {
    console.error(`   ❌ ${status} Error: ${data.error?.message || 'Unknown API error'}`);
  }
  return false;
}

async function testEmbedding() {
  const embeddingModel = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
  console.log(`\n📝 Testing embedding (${embeddingModel})...`);
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(embeddingModel)}:embedContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: 'Paithan Municipal Council test embedding' }] },
      }),
    }
  );

  const status = response.status;
  const data = await response.json();
  console.log(`   HTTP Status: ${status}`);

  if (status === 200) {
    const embedding = data.embedding?.values;
    if (embedding && Array.isArray(embedding) && embedding.length > 0) {
      console.log(`   ✅ Success! Embedding dimension: ${embedding.length}`);
      return true;
    }
    console.error(`   ❌ 200 but no embedding values in response`);
  } else if (status === 400) {
      console.error(`   ❌ 400 Bad Request: ${data.error?.message || 'Request rejected'}`);
  } else if (status === 401 || status === 403) {
    console.error(`   ❌ ${status} Unauthorized/Forbidden: Invalid API key`);
  } else if (status === 429) {
    console.error(`   ❌ 429 Too Many Requests: Quota exceeded`);
  } else {
    console.error(`   ❌ ${status} Error: ${data.error?.message || 'Unknown API error'}`);
  }
  return false;
}

async function main() {
  console.log('🚀 Verifying Gemini API Key...\n');
  
  const chatOk = await testChatCompletion();
  const embedOk = await testEmbedding();
  
  console.log('\n📊 Summary:');
  console.log(`   Chat: ${chatOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Embedding: ${embedOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (chatOk && embedOk) {
    console.log('\n🎉 All tests passed! Gemini API key is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
});
