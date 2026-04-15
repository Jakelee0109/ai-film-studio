# Vercel部署指南

本文档说明如何将AI Film Studio项目部署到Vercel,实现自动化的持续部署。

## 前置要求

- Vercel账户 (https://vercel.com)
- GitHub账户 (已配置)
- 项目已推送到GitHub仓库

## 部署步骤

### 1. 连接GitHub仓库到Vercel

1. 访问 https://vercel.com/dashboard
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 搜索并选择 `Jakelee0109/ai-film-studio`
5. 点击 "Import"

### 2. 配置项目设置

在Vercel导入页面,配置以下设置:

**基本设置:**
- Framework Preset: 选择 "Other" (因为项目使用自定义配置)
- Build Command: `pnpm build`
- Output Directory: `dist`
- Install Command: `pnpm install`

**环境变量配置:**

在"Environment Variables"部分,添加以下环境变量:

```
DATABASE_URL=<你的数据库连接字符串>
JWT_SECRET=<生成一个安全的随机密钥>
VITE_APP_ID=<Manus OAuth应用ID>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=<Manus OAuth门户URL>
OWNER_OPEN_ID=<项目所有者OpenID>
OWNER_NAME=<项目所有者名称>
VITE_APP_TITLE=AI Film Studio 寻山纪 AI电影制作平台
VITE_APP_LOGO=<应用logo URL>
BUILT_IN_FORGE_API_URL=<Manus API地址>
BUILT_IN_FORGE_API_KEY=<Manus API密钥>
VITE_FRONTEND_FORGE_API_KEY=<前端API密钥>
VITE_FRONTEND_FORGE_API_URL=<前端API地址>
VITE_ANALYTICS_ENDPOINT=<分析端点>
VITE_ANALYTICS_WEBSITE_ID=<分析网站ID>
```

### 3. 部署项目

1. 点击 "Deploy" 按钮
2. Vercel将开始构建和部署项目
3. 部署完成后,您将获得一个Vercel URL

### 4. 配置自定义域名(可选)

1. 在Vercel项目设置中,找到 "Domains" 部分
2. 点击 "Add Domain"
3. 输入您的自定义域名
4. 按照DNS配置说明更新您的域名提供商

## 自动部署

配置完成后,每当您向GitHub的main分支推送代码时,Vercel将自动:

1. 检测到代码变更
2. 触发新的构建
3. 运行构建命令
4. 部署新版本
5. 更新生产环境

## 监控和调试

### 查看部署日志

1. 在Vercel Dashboard中选择您的项目
2. 点击 "Deployments" 标签
3. 选择特定的部署版本查看详细日志

### 常见问题

**构建失败:**
- 检查构建日志中的错误信息
- 确保所有环境变量都已正确配置
- 验证package.json中的依赖是否完整

**环境变量未生效:**
- 确保在Vercel中正确设置了环境变量
- 重新部署项目以应用新的环境变量
- 检查变量名称是否与代码中引用的名称匹配

**数据库连接错误:**
- 验证DATABASE_URL格式是否正确
- 确保数据库服务器可从Vercel访问
- 检查数据库防火墙设置

## 性能优化建议

1. **启用缓存:** Vercel会自动缓存静态资源
2. **使用CDN:** Vercel提供全球CDN加速
3. **监控性能:** 使用Vercel Analytics监控应用性能
4. **优化构建:** 定期检查构建时间并优化依赖

## 回滚部署

如果需要回滚到之前的版本:

1. 在Vercel Dashboard中找到之前的部署
2. 点击该部署的菜单
3. 选择 "Promote to Production"

## 更多资源

- Vercel官方文档: https://vercel.com/docs
- Next.js部署指南: https://vercel.com/docs/frameworks/nextjs
- 环境变量配置: https://vercel.com/docs/concepts/projects/environment-variables
