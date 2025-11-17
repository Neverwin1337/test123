import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

// ✏️ 測試用 guardian 帳號（請改成你資料庫中真實存在的家長 email / 密碼）
const GUARDIAN_EMAIL = 'liwei@guardian.com';
const GUARDIAN_PASSWORD = 'gPass1!';

async function guardianLoginAndGetCookie() {
  const url = `${BASE_URL}/auth/guardian/login`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: GUARDIAN_EMAIL,
      password: GUARDIAN_PASSWORD,
    }),
  });

  const data = await res.json().catch(() => ({}));

  console.log('--- guardianLogin ---');
  console.log('Status:', res.status);
  console.log('Body:', data);

  if (!res.ok) {
    throw new Error('Guardian login failed');
  }

  // 從 Set-Cookie 組裝 Cookie header
  const raw = res.headers.raw();
  const setCookies = raw['set-cookie'] || [];
  const cookieHeader = setCookies
    .map((c) => c.split(';')[0])
    .join('; ');

  return cookieHeader;
}

async function testGuardianMyChildren() {
  const cookie = await guardianLoginAndGetCookie();
  const url = `${BASE_URL}/guardians/my/children/1/grades`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie: cookie,
    },
  });

  const data = await res.json().catch(() => ({}));

  console.log('--- testGuardianMyChildren ---');
  console.log('Status:', res.status);
  console.log('Body:', data);
}

async function main() {
  await testGuardianMyChildren();
}

main().catch(console.error);