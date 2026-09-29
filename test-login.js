import { spawn } from 'child_process';

const dev = spawn('npm', ['run', 'dev'], { stdio: 'pipe', shell: true });

let output = '';
let serverReady = false;

dev.stdout.on('data', (data) => {
  output += data.toString();
  if ((output.includes('Ready in') || output.includes('Local:')) && !serverReady) {
    serverReady = true;
    setTimeout(runTest, 2000);
  }
});
dev.stderr.on('data', (data) => output += data.toString());

async function runTest() {
  console.log('Dev server ready, testing login...');
  
  const baseUrl = 'http://localhost:3000';
  const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
  const csrfData = await csrfRes.json();
  console.log('CSRF token obtained:', !!csrfData.csrfToken);
  
  const res = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: 'admin@paithan.gov.in',
      password: 'changeme1234',
      redirect: 'false',
      csrfToken: csrfData.csrfToken,
      callbackUrl: baseUrl
    })
  });
  
  console.log('Login response status:', res.status);
  const text = await res.text();
  console.log('Response:', text.slice(0, 500));
  
  // Check session cookie
  const cookies = res.headers.get('set-cookie');
  console.log('Cookies set:', cookies ? 'yes' : 'no');
  
  if (res.status === 200 || res.status === 302) {
    console.log('PASS: Login successful');
  } else {
    console.log('FAIL: Login failed');
  }
  
  dev.kill();
  process.exit(0);
}

setTimeout(() => {
  console.log('Timeout waiting for dev server');
  dev.kill();
  process.exit(1);
}, 90000);