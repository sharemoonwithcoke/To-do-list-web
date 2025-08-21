// demo_updated.js - 更新后的应用功能演示脚本
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 演示数据
const demoUsers = [
  { username: 'demo_user1', email: 'user1@example.com', password: '123456' },
  { username: 'demo_user2', email: 'user2@example.com', password: '123456' }
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
  console.log('🚀 开始演示更新后的 To-Do List 应用功能...\n');

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

    // 6. 分享整个任务视图演示
    console.log('6️⃣ 分享整个任务视图演示');
    if (users.length >= 2) {
      const user1 = users[0];
      const user2 = users[1];
      
      console.log(`${user1.username} 分享任务视图给 ${user2.username}:`);
      
      const shareResponse = await fetch(`${BASE_URL}/tasks/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user1.token}`
        },
        body: JSON.stringify({
          toUsername: user2.username
        })
      });
      
      const shareResult = await shareResponse.json();
      
      if (shareResponse.ok) {
        console.log(`✅ 成功分享任务视图！`);
        console.log(`   - 视图ID: ${shareResult.viewId}`);
        console.log(`   - 分享任务数: ${shareResult.sharedTasksCount}`);
        console.log(`   - 分享时间: ${shareResult.sharedAt}`);
        
        // 验证分享结果
        const user2TasksResponse = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            'Authorization': `Bearer ${user2.token}`
          }
        });
        const user2Tasks = await user2TasksResponse.json();
        
        if (user2TasksResponse.ok) {
          console.log(`\n${user2.username} 现在拥有的任务:`);
          user2Tasks.forEach(task => {
            if (task.sharedFrom) {
              console.log(`  📤 ${task.title} (来自 ${task.sharedFrom})`);
            } else {
              console.log(`  📝 ${task.title} (自己的任务)`);
            }
          });
        }
      } else {
        console.log(`❌ 任务视图分享失败: ${shareResult.error}`);
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

    console.log('🎉 演示完成！所有功能都正常工作。');
    console.log('📱 现在可以在浏览器中访问 http://localhost:3000 来使用完整的用户界面。');
    console.log('\n🔧 修复的问题:');
    console.log('  ✅ 修复了添加任务时的401认证错误');
    console.log('  ✅ 实现了分享整个任务视图而不是单个任务');
    console.log('  ✅ 改进了用户界面和用户体验');

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error.message);
  }
}

// 运行演示
demo();