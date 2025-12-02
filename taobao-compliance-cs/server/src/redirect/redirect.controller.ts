import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('redirect')
export class RedirectController {
  /**
   * 获取H5重定向页面（客服页面）
   */
  @Get(':sessionId')
  async getRedirectPage(
    @Param('sessionId') sessionId: string,
    @Res() res: Response,
  ) {
    const htmlContent = this.generateH5Page(sessionId);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(htmlContent);
  }

  /**
   * 生成H5页面HTML
   */
  private generateH5Page(sessionId: string): string {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <title>客服中心</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html, body {
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
        }
        
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px 30px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.5s ease-out;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        h1 {
            color: #333;
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #999;
            font-size: 14px;
        }
        
        .info-section {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .info-title {
            color: #333;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .info-title::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 16px;
            background: #667eea;
            border-radius: 2px;
            margin-right: 8px;
        }
        
        .info-text {
            color: #666;
            font-size: 14px;
            line-height: 1.6;
            margin: 8px 0;
        }
        
        .qr-container {
            background: #fff;
            border: 1px dashed #ddd;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .qr-title {
            color: #333;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        
        .qr-placeholder {
            width: 180px;
            height: 180px;
            margin: 0 auto 15px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 12px;
        }
        
        .qr-tips {
            color: #999;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .actions {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .btn {
            flex: 1;
            padding: 14px 20px;
            border: none;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: 1px solid #e0e0e0;
        }
        
        .btn-secondary:hover {
            background: #e8e8e8;
        }
        
        .btn:active {
            transform: scale(0.98);
        }
        
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 25px;
        }
        
        .feature-item {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
        }
        
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .feature-name {
            color: #333;
            font-size: 12px;
            font-weight: 600;
        }
        
        .footer {
            text-align: center;
            color: #999;
            font-size: 11px;
            line-height: 1.5;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
        }
        
        .warning {
            background: #fff8e1;
            border-left: 3px solid #ffc107;
            padding: 12px 15px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 12px;
            color: #856404;
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 22px;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">👋</div>
            <h1>欢迎咨询</h1>
            <p class="subtitle">感谢您的关注！</p>
        </div>
        
        <div class="warning">
            💡 本页面用于合规引流，请通过企业微信与我们沟通
        </div>
        
        <div class="info-section">
            <div class="info-title">为什么选择企业微信？</div>
            <div class="info-text">✅ 更安全的沟通环境</div>
            <div class="info-text">✅ 实时客服支持</div>
            <div class="info-text">✅ 完整的消息记录</div>
            <div class="info-text">✅ 专业的企业身份认证</div>
        </div>
        
        <div class="qr-container">
            <div class="qr-title">扫码添加企业微信客服</div>
            <div class="qr-placeholder">
                <div style="text-align: center;">
                    <div style="font-size: 14px; margin-bottom: 5px;">二维码</div>
                    <div style="font-size: 11px;">请配置企业微信二维码URL</div>
                </div>
            </div>
            <div class="qr-tips">
                使用微信扫描 | 或长按识别
            </div>
        </div>
        
        <div class="features">
            <div class="feature-item">
                <div class="feature-icon">💬</div>
                <div class="feature-name">在线咨询</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <div class="feature-name">快速回复</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🎁</div>
                <div class="feature-name">优惠折扣</div>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🏆</div>
                <div class="feature-name">服务保障</div>
            </div>
        </div>
        
        <div class="actions">
            <button class="btn btn-primary" onclick="addWeChat()">
                💫 添加企业微信
            </button>
        </div>
        
        <div class="actions">
            <button class="btn btn-secondary" onclick="goBack()">
                ← 返回上一页
            </button>
        </div>
        
        <div class="footer">
            <div>会话ID: ${sessionId}</div>
            <div style="margin-top: 8px;">本页面为合规客服中心</div>
        </div>
    </div>
    
    <script>
        function addWeChat() {
            // 跳转到企业微信添加页面
            // 实际URL需要根据企业微信配置修改
            const wechatUrl = 'https://work.weixin.qq.com/';
            window.location.href = wechatUrl;
        }
        
        function goBack() {
            window.history.back();
        }
        
        // 记录访问
        console.log('访问了客服页面，会话ID:', '${sessionId}');
    </script>
</body>
</html>
    `;
  }
}


