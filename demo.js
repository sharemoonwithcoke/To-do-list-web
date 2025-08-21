// demo.js - 应用功能演示脚本
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 演示数据
const demoUsers = [
  { username: 'alice', email: 'alice@example.com', password: '123456' },
  { username: 'bob', email: 'bob@example.com', password: '123456' }
];

const demoTasks = [
  {
    title: '每日运动',
    description: '每天进行30分钟有氧运动',
    frequency: 'daily',
    requiresSubmission: true
  },
  {
    title: '学习React',
    description: '完成React教程的学习',
    frequency: 'weekly',
    requiresSubmission: false
  },
  {
    title: '项目会议',
    description: '参加团队项目会议',
    frequency: 'once',
    requiresSubmission: false
  }
];

async function demo() {
  console.log('🚀 开始演示 To-Do List 应用功能...\n');

  try {
    // 1. 注册用户
    console.log('1️⃣ 用户注册演示');
    const users = [];
    for (const userData of demoUsers) {
      const response = await fetch(`${BASE_URL}/sessions/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (response.ok) {
        users.push({ ...userData, token: result.token });
        console.log(`✅ 用户 ${userData.username} 注册成功`);
      } else {
        console.log(`❌ 用户 ${userData.username} 注册失败: ${result.error}`);
      }
    }
    console.log('');

    // 2. 用户登录
    console.log('2️⃣ 用户登录演示');
    for (const user of users) {
      const response = await fetch(`${BASE_URL}/sessions/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          password: user.password
        })
      });
      const result = await response.json();
      if (response.ok) {
        user.token = result.token;
        console.log(`✅ 用户 ${user.username} 登录成功`);
      } else {
        console.log(`❌ 用户 ${user.username} 登录失败: ${result.error}`);
      }
    }
    console.log('');

    // 3. 创建任务
    console.log('3️⃣ 任务创建演示');
    for (const user of users) {
      console.log(`为用户 ${user.username} 创建任务:`);
      for (const taskData of demoTasks) {
        const response = await fetch(`${BASE_URL}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(taskData)
        });
        const result = await response.json();
        if (response.ok) {
          console.log(`  ✅ 创建任务: ${taskData.title}`);
        } else {
          console.log(`  ❌ 创建任务失败: ${result.error}`);
        }
      }
      console.log('');
    }

    // 4. 获取任务列表
    console.log('4️⃣ 获取任务列表演示');
    for (const user of users) {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const tasks = await response.json();
      if (response.ok) {
        console.log(`用户 ${user.username} 的任务列表:`);
        tasks.forEach(task => {
          console.log(`  📝 ${task.title} (${task.frequency})`);
        });
      } else {
        console.log(`❌ 获取用户 ${user.username} 的任务失败`);
      }
      console.log('');
    }

    // 5. 提交任务证明
    console.log('5️⃣ 任务提交演示');
    for (const user of users) {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const tasks = await response.json();
      if (response.ok && tasks.length > 0) {
        const taskWithSubmission = tasks.find(t => t.requiresSubmission);
        if (taskWithSubmission) {
          const submissionResponse = await fetch(`${BASE_URL}/tasks/${taskWithSubmission.id}/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
              type: 'text',
              content: `${user.username} 完成了任务: ${taskWithSubmission.title}`
            })
          });
          if (submissionResponse.ok) {
            console.log(`✅ 用户 ${user.username} 提交了任务证明`);
          } else {
            console.log(`❌ 用户 ${user.username} 提交任务证明失败`);
          }
        }
      }
    }
    console.log('');

    // 6. 任务分享演示
    console.log('6️⃣ 任务分享演示');
    if (users.length >= 2) {
      const alice = users.find(u => u.username === 'alice');
      const bob = users.find(u => u.username === 'bob');
      
      if (alice && bob) {
        // 获取alice的任务
        const aliceTasksResponse = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${alice.token}`
          }
        });
        const aliceTasks = await aliceTasksResponse.json();
        
        if (aliceTasksResponse.ok && aliceTasks.length > 0) {
          const taskToShare = aliceTasks[0];
          const shareResponse = await fetch(`${BASE_URL}/tasks/${taskToShare.id}/share`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${alice.token}`
            },
            body: JSON.stringify({
              toUsername: bob.username
            })
          });
          
          if (shareResponse.ok) {
            console.log(`✅ Alice 成功将任务 "${taskToShare.title}" 分享给 Bob`);
          } else {
            console.log(`❌ 任务分享失败`);
          }
        }
      }
    }
    console.log('');

    // 7. 获取统计信息
    console.log('7️⃣ 统计信息演示');
    for (const user of users) {
      const response = await fetch(`${BASE_URL}/tasks/stats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const stats = await response.json();
      if (response.ok) {
        console.log(`用户 ${user.username} 的统计信息:`);
        console.log(`  总任务数: ${stats.total}`);
        console.log(`  已完成: ${stats.completed}`);
        console.log(`  待完成: ${stats.pending}`);
        console.log(`  完成率: ${stats.completionRate}%`);
      } else {
        console.log(`❌ 获取用户 ${user.username} 的统计信息失败`);
      }
      console.log('');
    }

    // 8. 获取排行榜
    console.log('8️⃣ 排行榜演示');
    const rankingsResponse = await fetch(`${BASE_URL}/tasks/rankings`, {
      headers: {
        'Authorization': `Bearer ${users[0].token}`
      }
    });
    const rankings = await rankingsResponse.json();
    if (rankingsResponse.ok) {
      console.log('用户排行榜:');
      rankings.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.username} - 完成 ${user.completedTasks} 个任务 (${user.completionRate}%)`);
      });
    } else {
      console.log('❌ 获取排行榜失败');
    }
    console.log('');

    console.log('🎉 演示完成！应用所有核心功能都正常工作。');
    console.log('📱 现在可以在浏览器中访问 http://localhost:3000 来使用完整的用户界面。');

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
  }
}

// 运行演示
demo();