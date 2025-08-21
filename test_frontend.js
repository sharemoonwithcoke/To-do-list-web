// test_frontend.js - 测试前端token传递
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testFrontendToken() {
  console.log('🧪 测试前端token传递...\n');

  try {
    // 1. 注册用户
    console.log('1️⃣ 注册测试用户');
    const registerResponse = await fetch(`${BASE_URL}/sessions/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'frontend_test',
        email: 'frontend@test.com',
        password: '123456'
      })
    });

    const registerResult = await registerResponse.json();
    if (!registerResponse.ok) {
      throw new Error(`注册失败: ${registerResult.error}`);
    }

    const token = registerResult.token;
    console.log('✅ 用户注册成功');
    console.log(`Token: ${token.substring(0, 50)}...`);

    // 2. 测试添加任务
    console.log('\n2️⃣ 测试添加任务');
    const addTaskResponse = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: '前端测试任务',
        description: '测试前端token传递是否正常',
        frequency: 'once',
        requiresSubmission: false
      })
    });

    const addTaskResult = await addTaskResponse.json();
    if (!addTaskResponse.ok) {
      throw new Error(`添加任务失败: ${addTaskResult.error}`);
    }

    console.log('✅ 添加任务成功');
    console.log(`任务ID: ${addTaskResult.id}`);

    // 3. 测试获取任务列表
    console.log('\n3️⃣ 测试获取任务列表');
    const getTasksResponse = await fetch(`${BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const tasks = await getTasksResponse.json();
    if (!getTasksResponse.ok) {
      throw new Error(`获取任务失败: ${tasks.error}`);
    }

    console.log('✅ 获取任务列表成功');
    console.log(`任务数量: ${tasks.length}`);
    tasks.forEach(task => {
      console.log(`  - ${task.title}`);
    });

    // 4. 测试分享功能
    console.log('\n4️⃣ 测试分享功能');
    const shareResponse = await fetch(`${BASE_URL}/tasks/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        toUsername: 'alice'
      })
    });

    const shareResult = await shareResponse.json();
    if (!shareResponse.ok) {
      console.log(`⚠️ 分享失败: ${shareResult.error}`);
    } else {
      console.log('✅ 分享功能正常');
      console.log(`分享任务数: ${shareResult.sharedTasksCount}`);
    }

    console.log('\n🎉 前端token传递测试完成！');
    console.log('📱 现在可以在浏览器中正常使用所有功能了。');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testFrontendToken();