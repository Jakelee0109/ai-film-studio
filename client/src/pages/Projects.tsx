import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useEffect } from "react";

export default function Projects() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 cursor-pointer">{APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}<span className="text-xl font-bold gradient-text">{APP_TITLE}</span></div></Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard"><Button variant="ghost">控制台</Button></Link>
            <Link href="/projects"><Button variant="ghost">我的项目</Button></Link>
            <Link href="/support"><Button variant="ghost">支持</Button></Link>
            <Button variant="outline" onClick={() => logout()}>退出</Button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold text-foreground mb-4">我的项目</h1><p className="text-muted-foreground">项目管理功能开发中...</p></div>
    </div>
  );
}
