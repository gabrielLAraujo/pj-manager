import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export function ProjectCardSkeleton() {
  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg border border-gray-200 animate-pulse">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 p-6">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-6">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>

        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>

        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-200 p-6">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </CardFooter>
    </Card>
  );
}
