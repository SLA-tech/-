#!/usr/bin/env node

/**
 * 淘宝店铺合规客服系统 - API测试脚本
 * 
 * 使用方法：
 * Windows: node test-api.js
 * Linux/Mac: ./test-api.js 或 node test-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:3000/api/v1';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  log('bright', '\n========================================');
  log('bright', '淘宝店铺合规客服系统 - API测试');
  log('bright', '========================================\n');

  try {
    // 1. 检查服务健康状态
    log('cyan', '📋 1. 检查服务健康状态...');
    const healthRes = await request('GET', '/health');
    if (healthRes.status === 200) {
      log('green', '✅ 服务正常运行');
      console.log('响应:', JSON.stringify(healthRes.data, null, 2));
    } else {
      log('red', '❌ 服务异常');
      return;
    }

    await sleep(500);

    // 2. 获取敏感词列表
    log('cyan', '\n📋 2. 获取敏感词列表...');
    const wordsRes = await request('GET', '/sensitive-words');
    log('green', `✅ 成功获取 ${wordsRes.data?.length || 0} 个敏感词`);
    if (wordsRes.data && wordsRes.data.length > 0) {
      log('blue', `示例: "${wordsRes.data[0].word}" (严重程度: ${wordsRes.data[0].severity})`);
    }

    await sleep(500);

    // 3. 添加敏感词
    log('cyan', '\n📋 3. 添加敏感词...');
    const newWord = {
      word: `测试词_${Date.now()}`,
      type: 'legal',
      severity: 7,
      enabled: 1,
    };
    const addWordRes = await request('POST', '/sensitive-words', newWord);
    if (addWordRes.status === 201 || addWordRes.status === 200) {
      log('green', '✅ 成功添加敏感词');
      console.log('新敏感词:', JSON.stringify(addWordRes.data, null, 2));
      var addedWordId = addWordRes.data.id;
    } else {
      log('yellow', '⚠️  添加敏感词返回: ' + addWordRes.status);
    }

    await sleep(500);

    // 4. 获取模板列表
    log('cyan', '\n📋 4. 获取模板列表...');
    const templatesRes = await request('GET', '/templates');
    log('green', `✅ 成功获取 ${templatesRes.data?.length || 0} 个模板`);
    if (templatesRes.data && templatesRes.data.length > 0) {
      log('blue', `示例: "${templatesRes.data[0].name}"`);
    }

    await sleep(500);

    // 5. 添加模板
    log('cyan', '\n📋 5. 添加回复模板...');
    const newTemplate = {
      name: `测试模板_${Date.now()}`,
      content: '感谢您的咨询，这是一条自动回复。',
      keywords: '测试,test',
      enabled: 1,
      loop_interval: 60,
      max_loops: 0,
    };
    const addTemplateRes = await request('POST', '/templates', newTemplate);
    if (addTemplateRes.status === 201 || addTemplateRes.status === 200) {
      log('green', '✅ 成功添加模板');
      console.log('新模板:', JSON.stringify(addTemplateRes.data, null, 2));
      var addedTemplateId = addTemplateRes.data.id;
    } else {
      log('yellow', '⚠️  添加模板返回: ' + addTemplateRes.status);
    }

    await sleep(500);

    // 6. 获取会话列表
    log('cyan', '\n📋 6. 获取会话列表...');
    const sessionsRes = await request('GET', '/sessions?page=1&limit=10');
    log('green', `✅ 成功获取会话列表`);
    console.log('会话总数:', sessionsRes.data?.total || 0);
    if (sessionsRes.data?.data && sessionsRes.data.data.length > 0) {
      log('blue', `示例会话ID: ${sessionsRes.data.data[0].id}`);
    }

    await sleep(500);

    // 7. 发送消息到系统
    log('cyan', '\n📋 7. 发送测试消息...');
    const inboundMsg = {
      taobao_user_id: `test_user_${Date.now()}`,
      content: '你好，请问有什么可以帮助？',
      content_type: 'text',
    };
    const msgRes = await request('POST', '/messages/inbound', inboundMsg);
    if (msgRes.status === 200 || msgRes.status === 201) {
      log('green', '✅ 成功发送消息');
    } else {
      log('yellow', '⚠️  消息API返回: ' + msgRes.status);
    }

    await sleep(500);

    // 8. 获取统计报表
    log('cyan', '\n📋 8. 获取统计报表...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fromDate = today.toISOString().split('T')[0];
    const toDate = tomorrow.toISOString().split('T')[0];
    const reportsRes = await request(
      'GET',
      `/reports/sensitive-summary?from=${fromDate}&to=${toDate}`
    );
    log('green', '✅ 成功获取统计报表');
    if (reportsRes.data) {
      console.log('今日敏感词触发数:', reportsRes.data.total_triggers || 0);
      if (reportsRes.data.top_words && reportsRes.data.top_words.length > 0) {
        log('blue', 'TOP触发词:');
        reportsRes.data.top_words.slice(0, 3).forEach((word) => {
          console.log(`  - "${word.word}": ${word.count}次`);
        });
      }
    }

    await sleep(500);

    // 9. 清理测试数据
    log('cyan', '\n📋 9. 清理测试数据...');
    if (addedWordId) {
      const deleteWordRes = await request('DELETE', `/sensitive-words/${addedWordId}`);
      if (deleteWordRes.status === 200) {
        log('green', '✅ 成功删除测试敏感词');
      }
    }

    if (addedTemplateId) {
      const deleteTemplateRes = await request('DELETE', `/templates/${addedTemplateId}`);
      if (deleteTemplateRes.status === 200) {
        log('green', '✅ 成功删除测试模板');
      }
    }

    // 完成
    log('green', '\n========================================');
    log('green', '✅ 所有测试完成！');
    log('green', '========================================\n');

    log('yellow', '📱 接下来您可以：');
    console.log('1. 访问前端: http://localhost:5173');
    console.log('2. 添加敏感词和回复模板');
    console.log('3. 测试消息接收和自动回复');
    console.log('4. 查看统计报表\n');

  } catch (error) {
    log('red', '\n❌ 测试失败: ' + error.message);
    log('red', '\n请确保：');
    console.log('1. 后端服务正在运行 (http://localhost:3000)');
    console.log('2. 已运行了 npm run init:db 初始化数据库');
    console.log('3. Node.js 版本 >= 20.0\n');
  }
}

// 运行测试
runTests();
