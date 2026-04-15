import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Film, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TemplateSelector({ isOpen, onClose, onSuccess }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: templates, isLoading } = trpc.projects.templates.useQuery(undefined, {
    enabled: isOpen,
  });

  const createFromTemplateMutation = trpc.projects.createFromTemplate.useMutation({
    onSuccess: () => {
      toast.success("项目创建成功!");
      setSelectedTemplate(null);
      setProjectTitle("");
      onClose();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("创建失败: " + error.message);
    },
  });

  const handleCreate = () => {
    if (!selectedTemplate) {
      toast.error("请选择一个模板");
      return;
    }
    if (!projectTitle.trim()) {
      toast.error("请输入项目标题");
      return;
    }

    setIsCreating(true);
    createFromTemplateMutation.mutate({
      templateSlug: selectedTemplate,
      projectTitle,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>选择项目模板</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            选择一个预设模板快速开始你的电影项目
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates?.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.slug
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTemplate(template.slug)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-card-foreground">{template.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {template.category}
                        </CardDescription>
                      </div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedTemplate && (
              <div className="space-y-2 border-t border-border pt-4">
                <Label htmlFor="project-title">项目标题</Label>
                <Input
                  id="project-title"
                  placeholder="输入你的项目标题"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedTemplate || !projectTitle.trim() || isCreating}
          >
            {isCreating ? "创建中..." : "从模板创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
