import { Project } from "./types";

export type CreateProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

export type CreateProjectOutput = Project & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};