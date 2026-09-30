import { config } from 'dotenv';
config({ path: '.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment');
  process.exit(1);
}

console.log(`🔑 GEMINI_API_KEY found (masked): ${GEMINI_API_KEY.slice(0, 4)}...`);
console.log(`🔑 Key length: ${GEMINI_API_KEY.length}`);

if (GEMINI_API_KEY.length < 10) {
  console.error('❌ GEMINI_API_KEY appears too short');
  process.exit(1);
}

async function testChatCompletion() {
  console.log('\n📝 Testing chat completion (gemini-1.5-flash)...');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    console.error(`   ❌ 400 Bad Request: ${JSON.stringify(data)}`);
  } else if (status === 401 || status === 403) {
    console.error(`   ❌ ${status} Unauthorized/Forbidden: Invalid API key`);
  } else if (status === 429) {
    console.error(`   ❌ 429 Too Many Requests: Quota exceeded`);
  } else {
    console.error(`   ❌ ${status} Error: ${JSON.stringify(data)}`);
  }
  return false;
}

async function testEmbedding() {
  console.log('\n📝 Testing embedding (text-embedding-004)...');
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_API_KEY}`,
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
    console.error(`   ❌ 400 Bad Request: ${JSON.stringify(data)}`);
  } else if (status === 401 || status === 403) {
    console.error(`   ❌ ${status} Unauthorized/Forbidden: Invalid API key`);
  } else if (status === 429) {
    console.error(`   ❌ 429 Too Many Requests: Quota exceeded`);
  } else {
    console.error(`   ❌ ${status} Error: ${JSON.stringify(data)}`);
  }
  return false;
}

async function main() {
  console.log('🚀 Verifying Gemini API Key...\n');
  
  const chatOk = await testChatCompletion();
  const embedOk = await testEmbedding();
  
  console.log('\n📊 Summary:');
  console.log(`   Chat (gemini-1.5-flash): ${chatOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Embedding (text-embedding-004): ${embedOk ? '✅ PASS' : '❌ FAIL'}`);
  
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