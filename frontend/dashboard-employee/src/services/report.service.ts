import type {
  ProgressUser,
  RunningCourseList,
  RunningTryoutList,
  ReportData,
  ExportFormData,
} from "../store/useRealEmployeeStore";

const API_URL = "http://localhost:3000/api";

// API Response type
interface ApiResponse<T> {
  status: string;
  message: string;
  progressUsers?: T;
  listRunningCourses?: T;
  listRunningTryouts?: T;
  report?: T;
}

export const getProgressAll = async (): Promise<ProgressUser> => {
  try {
    const response = await fetch(`${API_URL}/reports/progress`);
    if (!response.ok) {
      throw new Error("Failed to get progress");
    }
    const data: ApiResponse<ProgressUser> = await response.json();
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

export const generateReports = async (
  referenceData: ExportFormData
): Promise<ReportData> => {
  try {
    const response = await fetch(
      `${API_URL}/reports/generate-report/progress`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          referenceType: referenceData.referenceType,
          referenceId: referenceData.referenceId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate report");
    }

    const data: ApiResponse<ReportData> = await response.json(); // parse JSON response into native JavaScript objects>
    if (!data.report) {
      throw new Error("Progress data is missing");
    }
    console.log("Calling API generate for progress...", referenceData);
    console.log("Calling API generate for progress...", data);
    return data.report || [];
  } catch (er) {
    console.error("Error Fetching Progress:", er);
    throw new Error("Failed to load progress. Please try again later. ");
  }
};
