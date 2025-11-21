import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, CreditCard, Zap, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const subscriptionTiers = {
    free: "免费版",
    creator: "创作者版",
    studio: "工作室版"
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
              <span className="text-xl font-bold gradient-text">{APP_TITLE}</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">控制台</Button>
            </Link>
            <Link href="/projects">
              <Button variant="ghost">我的项目</Button>
            </Link>
            <Link href="/support">
              <Button variant="ghost">支持</Button>
            </Link>
            <Button variant="outline" onClick={() => logout()}>
              退出
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            欢迎回来, {user.name || "创作者"}!
          </h1>
          <p className="text-muted-foreground">开始你的AI电影创作之旅</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">剩余积分</CardTitle>
              <Zap className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{user.credits || 0}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/pricing"><span className="text-primary hover:underline cursor-pointer">购买更多</span></Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">订阅计划</CardTitle>
              <CreditCard className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                {subscriptionTiers[user.subscriptionTier || "free"]}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link href="/pricing"><span className="text-primary hover:underline cursor-pointer">升级计划</span></Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">我的项目</CardTitle>
              <Film className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/projects"><span className="text-primary hover:underline cursor-pointer">查看全部</span></Link>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">本月使用</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">积分消耗</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/20 to-blue-600/20 border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">创建新项目</CardTitle>
              <CardDescription className="text-muted-foreground">开始一个全新的AI电影制作项目</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/projects"><Button className="w-full"><Film className="mr-2 h-4 w-4" />新建项目</Button></Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">探索功能</CardTitle>
              <CardDescription className="text-muted-foreground">了解平台的11个强大AI模块</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/"><Button variant="outline" className="w-full">查看功能</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
