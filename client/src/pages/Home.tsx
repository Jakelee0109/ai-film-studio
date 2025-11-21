import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { 
  Film, Clapperboard, Users, Palette, Video, 
  Scissors, Music, Image, MessageCircle, CreditCard, Sparkles 
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: Film,
    title: "剧本创作",
    description: "AI驱动的灵感风暴，自动生成工业标准剧本格式，智能角色分析",
    module: "01"
  },
  {
    icon: Clapperboard,
    title: "分镜创作",
    description: "剧本一键转画，精确运镜控制，确保前后镜头一致性",
    module: "02"
  },
  {
    icon: Users,
    title: "选角设计",
    description: "生成超写实角色三视图，训练专属LoRA模型，虚拟试衣功能",
    module: "03"
  },
  {
    icon: Palette,
    title: "场景美术",
    description: "世界观搭建，3D资产预览，关键道具细节设计",
    module: "04"
  },
  {
    icon: Video,
    title: "AI片场",
    description: "图生视频、文生视频，物理模拟，口型同步技术",
    module: "05"
  },
  {
    icon: Scissors,
    title: "后期剪辑",
    description: "智能粗剪，AI调色，4K超分辨率提升",
    module: "06"
  },
  {
    icon: Music,
    title: "音效设计",
    description: "多情感配音生成，原创BGM创作，智能拟音",
    module: "07"
  },
  {
    icon: Image,
    title: "海报设计",
    description: "8K级高精度渲染，自动排版布局，多尺寸输出",
    module: "08"
  }
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="text-xl font-bold gradient-text">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing">
              <Button variant="ghost">定价</Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost">支持</Button>
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>控制台</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button>登录</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 animated-gradient">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              AI驱动的电影制作平台
            </h1>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            从剧本创作到后期制作，一站式AI电影制作解决方案。让创意无限，让制作简单。
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/projects">
                <Button size="lg" className="text-lg px-8">
                  开始创作
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="text-lg px-8">
                  免费开始
                </Button>
              </a>
            )}
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white/30">
                查看定价
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            全流程AI制作工具
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            11个专业模块，覆盖电影制作的每一个环节
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:bg-white/10 transition-all duration-300 border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">模块 {feature.module}</span>
                  </div>
                  <CardTitle className="text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            三步完成电影创作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">创意阶段</h3>
              <p className="text-muted-foreground">
                使用AI生成剧本、设计角色、创建分镜和场景
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">制作阶段</h3>
              <p className="text-muted-foreground">
                AI生成视频片段，智能剪辑，添加音效和配乐
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">发布阶段</h3>
              <p className="text-muted-foreground">
                生成精美海报，导出高清视频，分享到社交媒体
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/20 to-blue-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            准备好创作你的第一部AI电影了吗？
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            免费注册，立即获得10积分体验所有功能
          </p>
          {isAuthenticated ? (
            <Link href="/projects">
              <Button size="lg" className="text-lg px-8">
                进入工作台
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="text-lg px-8">
                立即开始
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-card/30">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
