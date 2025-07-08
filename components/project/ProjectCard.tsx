import { Project } from "@/types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
// import { Badge } from "lucide-react";
import { Button } from "../ui/button";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="w-full max-w-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0 p-6">
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {project.name}
        </CardTitle>
        {/* <Badge className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          {project.status === "active" ? "Ativo" : "Inativo"}
        </Badge> */}
      </CardHeader>
      <CardContent className="pt-0 px-6">
        <CardDescription className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {project.description || "Sem descrição"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Criado em {project.createdAt.toLocaleDateString("pt-BR")}
          </span>
        </div>
        <Button
          variant="link"
          className="px-0 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          Ver detalhes →
        </Button>
      </CardFooter>
    </Card>
  );
}
