/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getProgressAll,
  getRunningCourses,
  getRunningTryouts,
  generateReports,
} from "../services/report.service";
import { create } from "zustand";

export interface GroupProgress {
  groupId: string;
  group: string;
  total: number;
  submitter: number;
  progress: number;
}

export interface TopTryout {
  tryout_title: string;
  average_score_users: number;
}

export interface RunningTryoutList {
  tryoutId: string;
  title: string;
  data: string;
}

export interface RunningCourseList {
  courseId: string;
  title: string;
  data: string;
}

export interface ExamList {
  userId: number;
  tryout_title: string;
  tryoutId: number;
  course_title: number;
  courseId: string;
  status: string;
  scores: number;
}

export interface ExamListUser {
  id: string;
  title: string;
  type: string;
  status: string;
  score: number;
}

export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  contact: string;
  groupTitleUser: string;
  examCompleted: number;
  examPossible: number;
  completion: number;
  averageQuizScore: number;
  examList: ExamList[];
}

export interface ExportFormData {
  referenceType: string | null;
  referenceId: string | null;
}

export interface ExportDataState {
  report: ReportData;
  isLoading: boolean;
  error: string | null;
  handleGenerateAndExport: (
    referenceData: ExportFormData
  ) => Promise<ReportData | undefined>;
}

export interface ReportData {
  type: string;
  referenceId: string;
  groupTitle: string;
  totalUser: string;
  totalExamPossible: number;
  totalExamCompleted: number;
  averageCompletion: number;
  users: EmployeeData[];
}

export interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  groupTitle: string;
  averageQuizScore: number;
  examCompleted: number;
  examPossible: number;
  completion: number;
  examList: ExamListUser[];
}

interface ExportStore {
  exportBy: "user" | "group";
  fileName: string;
  setExportBy: (value: "user" | "group") => void;
  setGroupName: (name: string) => void;
}

export const useExportStore = create<ExportStore>((set) => ({
  exportBy: "user",
  fileName: "",
  setExportBy: (value) => set({ exportBy: value }),
  setGroupName: (name) => set({ fileName: name }),
}));

export interface ProgressUser {
  totalUser: number;
  completion: number;
  averageQuizScore: number;
  totalGroups: number;
  groupProgress: GroupProgress[];
  averageScoresPerTryout: TopTryout[];
  users: UserData[];
}

interface ProgressState {
  progress: ProgressUser;
  isLoading: boolean;
  error: string | null;
  selectedEmployee: UserData | null;
  setSelectedEmployee: (employee: UserData | null) => void;
  filterText: string;
  setFilterText: (text: string) => void;
  // Pagination
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  fetchAllProgress: () => Promise<void>;
}

interface RunningCourseState {
  listRunningCourses: RunningCourseList[];
  isLoading: boolean;
  error: string | null;
  fetchRunningCourses: () => Promise<void>;
}

interface RunningTryoutState {
  listRunningTryouts: RunningTryoutList[];
  isLoading: boolean;
  error: string | null;
  fetchRunningTryouts: () => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {
    totalUser: 0,
    averageQuizScore: 0,
    completion: 0,
    totalGroups: 0,
    groupProgress: [],
    averageScoresPerTryout: [],
    users: [],
  },
  isLoading: false,
  error: null,
  selectedEmployee: null,
  setSelectedEmployee: (progressUser) =>
    set({ selectedEmployee: progressUser }),
  filterText: "",
  setFilterText: (text) => set({ filterText: text }),
  // Pagination
  currentPage: 1,
  itemsPerPage: 4,
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
  fetchAllProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getProgressAll();
      set({ progress: data, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch progress",
        isLoading: false,
      });
    }
  },
}));

export const useRunningCourseStore = create<RunningCourseState>((set) => ({
  listRunningCourses: [],
  isLoading: false,
  error: null,
  fetchRunningCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRunningCourses();
      set({ listRunningCourses: data, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch progress",
        isLoading: false,
      });
    }
  },
}));

export const useRunningTryoutStore = create<RunningTryoutState>((set) => ({
  listRunningTryouts: [],
  isLoading: false,
  error: null,
  fetchRunningTryouts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRunningTryouts();
      set({ listRunningTryouts: data, isLoading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch progress",
        isLoading: false,
      });
    }
  },
}));

export const useExportDataEmploye = create<ExportDataState>((set) => ({
  report: {
    type: "",
    referenceId: "",
    groupTitle: "",
    totalUser: "",
    totalExamPossible: 0,
    totalExamCompleted: 0,
    averageCompletion: 0,
    users: [],
  },
  isLoading: false,
  error: null,
  handleGenerateAndExport: async (referenceData: ExportFormData) => {
    set({ isLoading: true, error: null });
    try {
      const data = await generateReports(referenceData);
      set({ report: data, isLoading: false });
      console.log("Updated Report Data:", data);
      return data;
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch progress",
        isLoading: false,
      });
      return undefined;
    }
  },
}));
