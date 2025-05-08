import type {
  Progress,
  RunningCourseList,
  RunningTryoutList,
} from "../store/useRealEmployeeStore";

const API_URL = "http://localhost:3000/api";

// API Response type
interface ApiResponse<T> {
  status: string;
  message: string;
  progressUsers?: T;
  listRunningCourses?: T;
  listRunningTryouts?: T;
}

export const getProgressAll = async (): Promise<Progress> => {
  try {
    const response = await fetch(`${API_URL}/reports/progress`);
    if (!response.ok) {
      throw new Error("Failed to get progress");
    }
    const data: ApiResponse<Progress> = await response.json();
    if (!data.progressUsers) {
      throw new Error("Progress data is missing");
    }
    console.log("Calling API for progress..." + data);
    return data.progressUsers;
  } catch (e) {
    console.error("Error Fetching Progress:", e);
    throw new Error("Failed to load progress. Please try again later.");
  }
};

export const getRunningCourses = async (): Promise<RunningCourseList[]> => {
  try {
    const response = await fetch(`${API_URL}/reports/running-courses`);
    if (!response.ok) {
      throw new Error("Failed to get progress");
    }
    const data: ApiResponse<RunningCourseList[]> = await response.json();
    if (!data.listRunningCourses) {
      throw new Error("Progress data is missing");
    }
    console.log("Calling API for progress..." + data);
    return data.listRunningCourses || [];
  } catch (e) {
    console.error("Error Fetching Progress:", e);
    throw new Error("Failed to load progress. Please try again later.");
  }
};

export const getRunningTryouts = async (): Promise<RunningTryoutList[]> => {
  try {
    const response = await fetch(`${API_URL}/reports/running-tryout-sections`);
    if (!response.ok) {
      throw new Error("Failed to get progress");
    }
    const data: ApiResponse<RunningTryoutList[]> = await response.json();
    if (!data.listRunningTryouts) {
      throw new Error("Progress data is missing");
    }
    console.log("Calling API for progress..." + data);
    return data.listRunningTryouts || [];
  } catch (e) {
    console.error("Error Fetching Progress:", e);
    throw new Error("Failed to load progress. Please try again later.");
  }
};
