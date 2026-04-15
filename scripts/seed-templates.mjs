import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { projectTemplates } from '../drizzle/schema.ts';

const connection = await mysql.createPool({
  connectionLimit: 1,
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'ai_film_studio',
});

const db = drizzle(connection);

const templates = [
  {
    name: '悬疑短片',
    slug: 'mystery-short',
    description: '适合5-15分钟的悬疑类短片制作。包含紧张的节奏、反转的情节和心理层面的冲突。',
    category: '悬疑',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=300&fit=crop',
    scriptTemplate: `# 悬疑短片剧本模板

## 故事大纲
- 开场：引入神秘元素
- 发展：逐步升级的紧张感
- 高潮：意外的转折
- 结局：出人意料的结尾

## 主要角色
1. 主角：普通人物，被卷入神秘事件
2. 对手：推动冲突的力量
3. 配角：提供信息或制造障碍

## 场景设置
- 密闭空间：增强紧张感
- 光影对比：营造氛围
- 声音设计：强化心理效果`,
    settingsTemplate: JSON.stringify({
      duration: '5-15分钟',
      style: '心理悬疑',
      targetAudience: '18+',
      colorGrade: '冷色调',
      musicGenre: '紧张/惊悚',
    }),
    isActive: true,
  },
  {
    name: '科幻大片',
    slug: 'sci-fi-epic',
    description: '适合长篇科幻电影制作。包含宏大的世界观、视觉特效和深层的科幻主题。',
    category: '科幻',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440936694-6c913c1d38db?w=500&h=300&fit=crop',
    scriptTemplate: `# 科幻大片剧本模板

## 世界观设定
- 时间背景：未来/过去/平行世界
- 地点设定：地球/外星球/虚拟世界
- 科技水平：描述该世界的科技发展程度
- 社会结构：权力分布和阶级划分

## 核心冲突
1. 人类 vs 自然/科技
2. 个人 vs 社会/制度
3. 理想 vs 现实

## 主要角色
1. 英雄：推动故事前进的主动者
2. 反派：代表对立力量
3. 同盟者：提供支持和信息

## 视觉设定
- 建筑风格：未来主义/复古朋克
- 科技美学：极简/繁复
- 色彩方案：冷色/暖色
- 特效需求：列出关键的视觉特效`,
    settingsTemplate: JSON.stringify({
      duration: '90-180分钟',
      style: '史诗科幻',
      targetAudience: '13+',
      colorGrade: '鲜艳/冷色',
      musicGenre: '宏大/电子',
      vfxBudget: '高',
    }),
    isActive: true,
  },
];

try {
  for (const template of templates) {
    await db.insert(projectTemplates).values(template);
    console.log(`✓ 创建模板: ${template.name}`);
  }
  console.log('\n✓ 所有模板已创建成功!');
} catch (error) {
  if (error.code === 'ER_DUP_ENTRY') {
    console.log('✓ 模板已存在,跳过创建');
  } else {
    console.error('✗ 创建模板失败:', error.message);
  }
}

await connection.end();
