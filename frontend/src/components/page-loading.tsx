import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageLoadingProps {
  message: string;
}

export function PageLoading({ message }: PageLoadingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-none bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-52 max-w-full" />
          <p className="text-center text-muted-foreground text-sm">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}
