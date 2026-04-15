import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { projectTemplates } from '../drizzle/schema';

const connection = await mysql.createPool({
  connectionLimit: 1,
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection);

const templates = [
  {
    name: '悬疑短片',
    slug: 'mystery-short',
    description: '适合5-15分钟的悬疑类短片制作。包含紧张的节奏、反转的情节和心理层面的冲突。',
    category: '悬疑',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=300&fit=crop',
    scriptTemplate: `# 悬疑短片剧本模板\n\n## 故事大纲\n- 开场：引入神秘元素\n- 发展：逐步升级的紧张感\n- 高潮：意外的转折\n- 结局：出人意料的结尾`,
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
    scriptTemplate: `# 科幻大片剧本模板\n\n## 世界观设定\n- 时间背景：未来/过去/平行世界\n- 地点设定：地球/外星球/虚拟世界`,
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
} catch (error: any) {
  if (error.code === 'ER_DUP_ENTRY') {
    console.log('✓ 模板已存在,跳过创建');
  } else {
    console.error('✗ 创建模板失败:', error.message);
  }
}

await connection.end();
