import { TimelineEvent } from "../../types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow, format } from "date-fns";
import { CircleDot, UserPlus, Receipt, CreditCard, CheckCircle, FileText, MessageSquare } from "lucide-react";

export function TimelineTab({ timeline }: { timeline: TimelineEvent[] }) {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'created': return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'invoice': return <Receipt className="h-4 w-4 text-blue-500" />;
      case 'payment': return <CreditCard className="h-4 w-4 text-amber-500" />;
      case 'delivery': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'document': return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'note': return <MessageSquare className="h-4 w-4 text-slate-500" />;
      default: return <CircleDot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
      <CardContent className="p-6 sm:p-10">
        <h3 className="text-lg font-medium mb-8">Activity History</h3>
        
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((event) => (
            <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Marker */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {getIcon(event.type)}
              </div>
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <time className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(event.timestamp), 'dd MMM yyyy, HH:mm')}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <p className="text-xs text-muted-foreground mt-2 opacity-70">
                  {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {timeline.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No activity history available.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
