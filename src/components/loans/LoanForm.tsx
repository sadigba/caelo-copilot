import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft,
  MessageSquare, 
  SendHorizontal
} from "lucide-react";
import { useLoanContext } from "@/context/LoanContext";
import { Insight } from "@/context/LoanContext";
import { toast } from "sonner";

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight | null;
  loanId: string;
}

export function CommentsSidebar({ isOpen, onClose, insight, loanId }: CommentsSidebarProps) {
  const [newComment, setNewComment] = useState('');
  const { addComment } = useLoanContext();
  
  // Don't render anything when not open
  if (!isOpen || !insight) {
    return null;
  }

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    addComment(loanId, insight.id, {
      text: newComment,
      user: "You"
    });
    
    setNewComment('');
    toast.success("Comment added");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  return (
    <div className="border-l h-full bg-background w-[320px] min-w-[320px] flex flex-col fixed top-0 right-0 bottom-0 z-50">
      {/* Header */}
      <div className="h-14 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span className="font-medium">Comments</span>
          <span className="text-xs bg-secondary rounded-full px-1.5 py-0.5 ml-2">
            {insight.comments?.length || 0}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Insight preview */}
      <div className="border-b p-3 bg-muted/20">
        <p className="text-sm font-medium">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{insight.narrative}</p>
      </div>
      
      {/* Comments area */}
      <div className="flex-1 overflow-y-auto p-4">
        {insight.comments && insight.comments.length > 0 ? (
          <div className="space-y-4">
            {insight.comments.map((comment, index) => (
              <div key={index} className="bg-secondary/20 p-3 rounded-md">
                <div className="text-sm">{comment.text}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {comment.user} • {comment.timestamp && new Date(comment.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/60" />
            <p className="text-muted-foreground mb-2">No comments yet</p>
            <p className="text-xs text-muted-foreground">Add the first comment below</p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2 border rounded-md px-4 py-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a comment..."
            className="border-0 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button onClick={handleSendComment} size="icon" className="h-8 w-8" variant="default">
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
