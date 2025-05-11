import * as XLSX from "xlsx";
import type { EmployeeData } from "../store/useRealEmployeeStore";

export const exportToExcel = (
  emloyeeReport: EmployeeData[],
  fileName: string
) => {
  // Create worksheet data
  const worksheetData = [];

  // Add headers
  worksheetData.push([
    "Employee ID",
    "Name",
    "Email",
    "Contact",
    "Department",
    "Average Quiz Score",
    "Completion Rate",
    "Total Courses",
    "Completed Courses",
  ]);

  // Add employee data
  emloyeeReport.forEach((employee) => {
    const totalCourses = employee.examPossible;
    const completedCourses = employee.examCompleted;

    worksheetData.push([
      employee.id,
      employee.name,
      employee.email,
      employee.contact,
      employee.groupTitleUser,
      employee.averageQuizScore,
      employee.completion,
      totalCourses,
      completedCourses,
    ]);
  });

  worksheetData.push([]);
  worksheetData.push(["Course Details"]);
  worksheetData.push([
    "Employee Name",
    "Tryout Title",
    "Status",
    "Quiz Score",
    "Quiz Max Score",
  ]);

  emloyeeReport.forEach((employee) =>
    employee.examList.forEach((exam) =>
      worksheetData.push([
        employee.name,
        exam.tryout_title,
        exam.status,
        exam.scores,
        100,
      ])
    )
  );

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths
  const wscols = [
    { wch: 10 }, // ID
    { wch: 20 }, // Name
    { wch: 20 }, // Position
    { wch: 15 }, // Department
    { wch: 12 }, // Avg Score
    { wch: 14 }, // Completion
    { wch: 12 }, // Last Activity
    { wch: 12 }, // Total Courses
    { wch: 15 }, // Completed Courses
  ];
  ws["!cols"] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, "Learning Report");

  // Generate Excel file and trigger download
  XLSX.writeFile(
    wb,
    `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};
