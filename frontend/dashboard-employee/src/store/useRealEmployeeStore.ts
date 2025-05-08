import {
  getProgressAll,
  getRunningCourses,
  getRunningTryouts,
} from "../services/report.service";
import { create } from "zustand";

export interface GroupProgress {
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

export interface Progress {
  totalUser: number;
  completion: number;
  averageQuizScore: number;
  totalGroups: number;
  groupProgress: GroupProgress[];
  averageScoresPerTryout: TopTryout[];
}

interface ProgressState {
  progress: Progress;
  isLoading: boolean;
  error: string | null;
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
  },
  isLoading: false,
  error: null,
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
