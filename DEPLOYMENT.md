# 部署指南

本项目支持多种部署方式。本文档介绍如何部署到不同的平台。

## 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建生产版本
pnpm build
```

## Vercel部署 (推荐)

Vercel提供最简单的部署体验,支持自动化CI/CD。

详见: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

### 快速部署步骤:

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New Project"
3. 导入 `Jakelee0109/ai-film-studio` 仓库
4. 配置环境变量
5. 点击 "Deploy"

## Docker部署

### 创建Docker镜像

```bash
# 构建镜像
docker build -t ai-film-studio .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e JWT_SECRET="your-jwt-secret" \
  ai-film-studio
```

### Docker Compose

```bash
docker-compose up -d
```

## 环境变量配置

部署前,确保配置以下环境变量:

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | MySQL数据库连接字符串 | `mysql://user:pass@host/db` |
| `JWT_SECRET` | JWT签名密钥 | `your-secret-key` |
| `VITE_APP_ID` | Manus OAuth应用ID | `app-id` |
| `OAUTH_SERVER_URL` | OAuth服务器地址 | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | OAuth门户地址 | `https://oauth.manus.im` |
| `OWNER_OPEN_ID` | 项目所有者OpenID | `owner-id` |
| `OWNER_NAME` | 项目所有者名称 | `Your Name` |
| `VITE_APP_TITLE` | 应用标题 | `AI Film Studio 寻山纪` |
| `BUILT_IN_FORGE_API_URL` | Forge API地址 | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Forge API密钥 | `api-key` |

## 性能优化

### 构建优化

```bash
# 分析构建大小
pnpm build --analyze
```

### 运行时优化

- 启用HTTP/2推送
- 配置缓存策略
- 使用CDN分发静态资源

## 监控和日志

### Vercel监控

- 访问 https://vercel.com/dashboard 查看部署状态
- 检查构建日志和运行时错误
- 使用Vercel Analytics监控性能

### 本地日志

```bash
# 查看应用日志
docker logs <container-id>

# 实时日志
docker logs -f <container-id>
```

## 故障排除

### 构建失败

1. 检查Node.js版本 (需要v18+)
2. 清除node_modules和pnpm缓存
3. 重新安装依赖

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 数据库连接错误

1. 验证DATABASE_URL格式
2. 确保数据库服务器可访问
3. 检查防火墙和安全组设置

### 环境变量未生效

1. 重新部署应用
2. 清除浏览器缓存
3. 检查变量名称是否正确

## 回滚部署

### Vercel回滚

在Vercel Dashboard中:
1. 找到之前的部署版本
2. 点击菜单选择 "Promote to Production"

### Git回滚

```bash
# 查看提交历史
git log --oneline

# 回滚到特定提交
git revert <commit-hash>
git push origin main
```

## 更新和维护

### 定期更新依赖

```bash
# 检查过时的依赖
pnpm outdated

# 更新所有依赖
pnpm update
```

### 安全更新

```bash
# 审计依赖安全性
pnpm audit

# 修复安全漏洞
pnpm audit --fix
```

## 支持的部署平台

- ✅ Vercel (推荐)
- ✅ Docker/Docker Compose
- ✅ Railway
- ✅ Render
- ✅ AWS (ECS/Lambda)
- ✅ Google Cloud Run
- ✅ 自托管服务器

## 获取帮助

- 查看 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 了解Vercel特定配置
- 检查 [README.md](./README.md) 了解项目信息
- 查看GitHub Issues报告问题
