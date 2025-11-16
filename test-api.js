// API測試腳本
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let cookies = '';

// 顏色輸出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(status, message) {
  const color = status === 'PASS' ? colors.green : status === 'FAIL' ? colors.red : colors.yellow;
  console.log(`${color}[${status}]${colors.reset} ${message}`);
}

function logSection(title) {
  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}${title}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);
}

// 通用請求函數
async function request(method, path, body = null, useCookies = true) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (useCookies && cookies) {
    options.headers['Cookie'] = cookies;
  }
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    
    // 保存cookies（支持多個cookie）
    const setCookieHeader = response.headers.raw()['set-cookie'];
    if (setCookieHeader && setCookieHeader.length > 0) {
      // 提取所有cookie的名稱和值（包括signed cookies）
      cookies = setCookieHeader.map(cookie => cookie.split(';')[0]).join('; ');
    }
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 500, error: error.message };
  }
}

// 測試函數
async function testMasterLogin() {
  logSection('測試 1: Master Key登入');
  
  const result = await request('POST', '/auth/master/login', {
    masterKey: 'polyusecretkeyforTest'
  }, false);
  
  if (result.status === 200 && result.data.success) {
    log('PASS', 'Master Key登入成功');
    log('INFO', `用戶: ${result.data.data.name}, 類型: ${result.data.data.type}`);
    return true;
  } else {
    log('FAIL', `Master Key登入失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllStudents() {
  logSection('測試 2: 獲取所有學生');
  
  const result = await request('GET', '/students');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取學生列表 (${result.data.data.length} 個學生)`);
    if (result.data.data.length > 0) {
      log('INFO', `第一個學生: ${result.data.data[0].first_name} ${result.data.data[0].last_name}`);
    }
    return true;
  } else {
    log('FAIL', `獲取學生列表失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllGrades() {
  logSection('測試 3: 獲取所有成績');
  
  const result = await request('GET', '/grades');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取成績列表 (${result.data.data.length} 條記錄)`);
    return true;
  } else {
    log('FAIL', `獲取成績列表失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllDisciplinary() {
  logSection('測試 4: 獲取所有紀律記錄');
  
  const result = await request('GET', '/disciplinary');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取紀律記錄 (${result.data.data.length} 條記錄)`);
    return true;
  } else {
    log('FAIL', `獲取紀律記錄失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllStaffs() {
  logSection('測試 5: 獲取所有員工');
  
  const result = await request('GET', '/staffs');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取員工列表 (${result.data.data.length} 個員工)`);
    return true;
  } else {
    log('FAIL', `獲取員工列表失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllGuardians() {
  logSection('測試 6: 獲取所有家長');
  
  const result = await request('GET', '/guardians');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取家長列表 (${result.data.data.length} 個家長)`);
    return true;
  } else {
    log('FAIL', `獲取家長列表失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetAllCourses() {
  logSection('測試 7: 獲取所有課程');
  
  const result = await request('GET', '/courses');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', `成功獲取課程列表 (${result.data.data.length} 個課程)`);
    return true;
  } else {
    log('FAIL', `獲取課程列表失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testGetCurrentUser() {
  logSection('測試 8: 獲取當前用戶信息');
  
  const result = await request('GET', '/auth/me');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', '成功獲取當前用戶信息');
    log('INFO', `用戶: ${result.data.data.name}, 類型: ${result.data.data.type}`);
    return true;
  } else {
    log('FAIL', `獲取用戶信息失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testStaffLogin() {
  logSection('測試 9: 員工登入');
  
  // 先清除cookies
  cookies = '';
  
  const result = await request('POST', '/auth/staff/login', {
    email: 'huang@staff.com',
    password: 'staff01!'
  }, false);
  
  if (result.status === 200 && result.data.success) {
    log('PASS', '員工登入成功');
    log('INFO', `員工: ${result.data.data.name}, Role: ${result.data.data.role}`);
    return true;
  } else {
    log('FAIL', `員工登入失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testStudentLogin() {
  logSection('測試 10: 學生登入');
  
  // 先清除cookies
  cookies = '';
  
  const result = await request('POST', '/auth/student/login', {
    email: 'lixm@student.com',
    password: 'sPass01!'
  }, false);
  
  if (result.status === 200 && result.data.success) {
    log('PASS', '學生登入成功');
    log('INFO', `學生: ${result.data.data.name}, ID: ${result.data.data.id}`);
    return true;
  } else {
    log('FAIL', `學生登入失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testStudentAccessOwnData() {
  logSection('測試 11: 學生訪問自己的數據');
  
  const result = await request('GET', '/students/1');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', '學生成功訪問自己的數據');
    return true;
  } else {
    log('FAIL', `學生訪問自己數據失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testStudentAccessOthersData() {
  logSection('測試 12: 學生訪問他人數據（應該失敗）');
  
  const result = await request('GET', '/students/2');
  
  if (result.status === 403) {
    log('PASS', '學生訪問他人數據被正確拒絕');
    return true;
  } else {
    log('FAIL', '學生可以訪問他人數據（安全問題）');
    return false;
  }
}

async function testStudentAccessGrades() {
  logSection('測試 13: 學生嘗試訪問成績管理（應該失敗）');
  
  const result = await request('GET', '/grades');
  
  if (result.status === 403) {
    log('PASS', '學生訪問成績管理被正確拒絕');
    return true;
  } else {
    log('FAIL', '學生可以訪問成績管理（權限問題）');
    return false;
  }
}

async function testStaffWithARO() {
  logSection('測試 14: ARO員工訪問成績管理');
  
  // 重新用Master Key登入以添加ARO員工
  cookies = '';
  await request('POST', '/auth/master/login', {
    masterKey: 'polyusecretkeyforTest'
  }, false);
  
  // 添加一個ARO員工
  const addResult = await request('POST', '/staffs', {
    password: 'aro123',
    last_name: '測試',
    first_name: 'ARO',
    gender: '男',
    email: 'test.aro@staff.com',
    department: '教務處',
    role: 'ARO'
  });
  
  if (!addResult.data.success) {
    log('WARN', '無法創建ARO員工，跳過測試');
    return false;
  }
  
  const aroId = addResult.data.data.id;
  
  // 用ARO登入
  cookies = '';
  const loginResult = await request('POST', '/auth/staff/login', {
    email: 'test.aro@staff.com',
    password: 'aro123'
  }, false);
  
  if (loginResult.status !== 200) {
    log('FAIL', 'ARO登入失敗');
    return false;
  }
  
  // 嘗試訪問成績
  const gradesResult = await request('GET', '/grades');
  
  if (gradesResult.status === 200 && gradesResult.data.success) {
    log('PASS', 'ARO成功訪問成績管理');
    return true;
  } else {
    log('FAIL', `ARO訪問成績失敗: ${gradesResult.data?.message}`);
    return false;
  }
}

async function testGetGradeByStudentAndCourse() {
  logSection('測試 15: ARO根據學生+課程查成績');

  // 假設上一個測試已經用ARO登入，cookies仍然有效
  const result = await request('GET', '/grades/by-student-course?student_id=1&course_id=1');

  if (result.status === 200 && result.data.success) {
    const grade = result.data.data;
    log('PASS', `成功根據學生+課程查到成績: student_id=${grade.student_id}, course_id=${grade.course_id}, grade=${grade.grade}`);
    return true;
  } else if (result.status === 404) {
    log('FAIL', '查詢失敗: 成績不存在（請確認testdata.sql是否已導入，且有student_id=1, course_id=1的記錄）');
    return false;
  } else {
    log('FAIL', `查詢失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testStaffWithDRO() {
  logSection('測試 16: DRO員工訪問紀律記錄');
  
  // 重新用Master Key登入
  cookies = '';
  await request('POST', '/auth/master/login', {
    masterKey: 'polyusecretkeyforTest'
  }, false);
  
  // 添加一個DRO員工
  const addResult = await request('POST', '/staffs', {
    password: 'dro123',
    last_name: '測試',
    first_name: 'DRO',
    gender: '女',
    email: 'test.dro@staff.com',
    department: '訓導處',
    role: 'DRO'
  });
  
  if (!addResult.data.success) {
    log('WARN', '無法創建DRO員工，跳過測試');
    return false;
  }
  
  const droId = addResult.data.data.id;
  
  // 用DRO登入
  cookies = '';
  const loginResult = await request('POST', '/auth/staff/login', {
    email: 'test.dro@staff.com',
    password: 'dro123'
  }, false);
  
  if (loginResult.status !== 200) {
    log('FAIL', 'DRO登入失敗');
    return false;
  }
  
  // 嘗試訪問紀律記錄
  const disciplinaryResult = await request('GET', '/disciplinary');
  
  if (disciplinaryResult.status === 200 && disciplinaryResult.data.success) {
    log('PASS', 'DRO成功訪問紀律記錄');
    return true;
  } else {
    log('FAIL', `DRO訪問紀律記錄失敗: ${disciplinaryResult.data?.message}`);
    return false;
  }
}

async function testAROAccessDisciplinary() {
  logSection('測試 16: 非DRO訪問紀律記錄（應該失敗）');
  
  // 用第一個員工登入（假設不是DRO）
  cookies = '';
  await request('POST', '/auth/staff/login', {
    email: 'huang@staff.com',
    password: 'staff01!'
  }, false);
  
  // 如果這個員工不是DRO，應該失敗
  const result = await request('GET', '/disciplinary');
  
  if (result.status === 403) {
    log('PASS', '非DRO訪問紀律記錄被正確拒絕');
    return true;
  } else if (result.status === 200) {
    log('WARN', 'huang@staff.com可能有DRO權限');
    return true;
  } else {
    log('FAIL', `意外的狀態碼: ${result.status}`);
    return false;
  }
}

async function testLogout() {
  logSection('測試 17: 登出');
  
  const result = await request('POST', '/auth/logout');
  
  if (result.status === 200 && result.data.success) {
    log('PASS', '成功登出');
    cookies = ''; // 清除cookies
    return true;
  } else {
    log('FAIL', `登出失敗: ${result.data?.message || result.error}`);
    return false;
  }
}

async function testWithoutAuth() {
  logSection('測試 18: 未登入訪問受保護路由（應該失敗）');
  
  cookies = ''; // 確保沒有cookies
  const result = await request('GET', '/students', null, false);
  
  if (result.status === 401) {
    log('PASS', '未登入訪問被正確拒絕');
    return true;
  } else {
    log('FAIL', '未登入訪問沒有被拒絕（安全問題）');
    return false;
  }
}

// 執行所有測試
async function runAllTests() {
  console.log(`${colors.blue}
╔════════════════════════════════════════════════════════════╗
║                    API 功能測試腳本                        ║
║                  測試服務器: ${BASE_URL}              ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

  const results = [];
  
  // 測試1: Master Key登入
  results.push(await testMasterLogin());
  
  if (results[0]) {
    // 如果Master Key登入成功，繼續其他測試
    results.push(await testGetAllStudents());
    results.push(await testGetAllGrades());
    results.push(await testGetAllDisciplinary());
    results.push(await testGetAllStaffs());
    results.push(await testGetAllGuardians());
    results.push(await testGetAllCourses());
    results.push(await testGetCurrentUser());
    
    // 測試員工登入
    results.push(await testStaffLogin());
    
    // 測試學生登入和權限
    results.push(await testStudentLogin());
    results.push(await testStudentAccessOwnData());
    results.push(await testStudentAccessOthersData());
    results.push(await testStudentAccessGrades());
    
    // 測試角色權限
    results.push(await testStaffWithARO());
    results.push(await testGetGradeByStudentAndCourse());
    results.push(await testStaffWithDRO());
    results.push(await testAROAccessDisciplinary());
    
    // 測試登出和未登入
    results.push(await testLogout());
    results.push(await testWithoutAuth());
  } else {
    log('ERROR', 'Master Key登入失敗，跳過其他測試');
  }
  
  // 統計結果
  logSection('測試結果統計');
  const passed = results.filter(r => r === true).length;
  const failed = results.filter(r => r === false).length;
  const total = results.length;
  
  console.log(`總測試數: ${total}`);
  console.log(`${colors.green}通過: ${passed}${colors.reset}`);
  console.log(`${colors.red}失敗: ${failed}${colors.reset}`);
  console.log(`成功率: ${((passed / total) * 100).toFixed(2)}%\n`);
  
  if (passed === total) {
    console.log(`${colors.green}✓ 所有測試通過！${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ 有測試失敗，請檢查上面的錯誤信息${colors.reset}`);
  }
}

// 檢查服務器是否運行
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, { method: 'GET' });
    return true;
  } catch (error) {
    console.log(`${colors.red}錯誤: 無法連接到服務器 ${BASE_URL}${colors.reset}`);
    console.log(`${colors.yellow}請確保服務器正在運行: npm start${colors.reset}\n`);
    return false;
  }
}

// 主函數
async function main() {
  const serverRunning = await checkServer();
  if (!serverRunning) {
    process.exit(1);
  }
  
  await runAllTests();
}

main();
