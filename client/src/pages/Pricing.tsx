import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Check } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 cursor-pointer">{APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}<span className="text-xl font-bold gradient-text">{APP_TITLE}</span></div></Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing"><Button variant="ghost">定价</Button></Link>
            <Link href="/support"><Button variant="ghost">支持</Button></Link>
            {isAuthenticated ? <Link href="/dashboard"><Button>控制台</Button></Link> : <a href={getLoginUrl()}><Button>登录</Button></a>}
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-foreground mb-4">选择适合你的计划</h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">灵活的点数制系统，按需付费</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card border-border"><CardHeader><CardTitle className="text-card-foreground">免费版</CardTitle><CardDescription className="text-muted-foreground">体验所有功能</CardDescription><div className="text-3xl font-bold text-card-foreground mt-4">$0<span className="text-sm font-normal text-muted-foreground">/月</span></div></CardHeader><CardContent><ul className="space-y-3"><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">每日10积分</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">基础功能访问</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">社区支持</span></li></ul><Button className="w-full mt-6" variant="outline">当前计划</Button></CardContent></Card>
          <Card className="bg-gradient-to-br from-primary/20 to-blue-600/20 border-primary"><CardHeader><CardTitle className="text-card-foreground">创作者版</CardTitle><CardDescription className="text-muted-foreground">适合个人创作者</CardDescription><div className="text-3xl font-bold text-card-foreground mt-4">$29<span className="text-sm font-normal text-muted-foreground">/月</span></div></CardHeader><CardContent><ul className="space-y-3"><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">1000积分/月</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">无水印导出</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">优先队列</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">邮件支持</span></li></ul><Button className="w-full mt-6">立即升级</Button></CardContent></Card>
          <Card className="bg-card border-border"><CardHeader><CardTitle className="text-card-foreground">工作室版</CardTitle><CardDescription className="text-muted-foreground">适合团队和工作室</CardDescription><div className="text-3xl font-bold text-card-foreground mt-4">$99<span className="text-sm font-normal text-muted-foreground">/月</span></div></CardHeader><CardContent><ul className="space-y-3"><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">无限积分</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">私有模型训练</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">API接入</span></li><li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-card-foreground">专属客服</span></li></ul><Button className="w-full mt-6" variant="outline">联系销售</Button></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
