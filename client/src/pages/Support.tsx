import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { MessageCircle, Mail, FileText } from "lucide-react";

export default function Support() {
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
        <h1 className="text-4xl font-bold text-center text-foreground mb-4">帮助与支持</h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">我们随时为您提供帮助</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-card border-border"><CardHeader><MessageCircle className="h-12 w-12 text-primary mb-4" /><CardTitle className="text-card-foreground">AI客服</CardTitle><CardDescription className="text-muted-foreground">即时获得常见问题解答</CardDescription></CardHeader><CardContent><Button className="w-full">开始对话</Button></CardContent></Card>
          <Card className="bg-card border-border"><CardHeader><Mail className="h-12 w-12 text-primary mb-4" /><CardTitle className="text-card-foreground">邮件支持</CardTitle><CardDescription className="text-muted-foreground">发送工单给我们的团队</CardDescription></CardHeader><CardContent><Button className="w-full" variant="outline">创建工单</Button></CardContent></Card>
          <Card className="bg-card border-border"><CardHeader><FileText className="h-12 w-12 text-primary mb-4" /><CardTitle className="text-card-foreground">文档中心</CardTitle><CardDescription className="text-muted-foreground">查看详细的使用指南</CardDescription></CardHeader><CardContent><Button className="w-full" variant="outline">查看文档</Button></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
