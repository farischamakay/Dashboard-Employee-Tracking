import * as XLSX from "xlsx";
import type { Employee } from "../store/useEmployeeStore";

export const exportToExcel = (employees: Employee[], fileName: string) => {
  // Create worksheet data
  const worksheetData = [];

  // Add headers
  worksheetData.push([
    "Employee ID",
    "Name",
    "Position",
    "Department",
    "Average Score",
    "Completion Rate",
    "Last Activity",
    "Total Courses",
    "Completed Courses",
  ]);

  // Add employee data
  employees.forEach((employee) => {
    const totalCourses = employee.courses.length;
    const completedCourses = employee.courses.filter(
      (course) => course.completed
    ).length;

    worksheetData.push([
      employee.id,
      employee.name,
      employee.position,
      employee.department,
      employee.averageScore,
      `${employee.completionRate}%`,
      employee.lastActivity,
      totalCourses,
      completedCourses,
    ]);
  });

  // Add detail section for courses and quizzes
  worksheetData.push([]);
  worksheetData.push(["Course Details"]);
  worksheetData.push([
    "Employee Name",
    "Course Title",
    "Progress",
    "Status",
    "Quiz Title",
    "Quiz Score",
    "Quiz Max Score",
    "Completed At",
  ]);

  employees.forEach((employee) => {
    employee.courses.forEach((course) => {
      if (course.quizzes.length > 0) {
        course.quizzes.forEach((quiz) => {
          worksheetData.push([
            employee.name,
            course.title,
            `${course.progress}%`,
            course.completed ? "Completed" : "In Progress",
            quiz.title,
            quiz.score,
            quiz.maxScore,
            quiz.completedAt,
          ]);
        });
      } else {
        worksheetData.push([
          employee.name,
          course.title,
          `${course.progress}%`,
          course.completed ? "Completed" : "In Progress",
          "-",
          "-",
          "-",
          "-",
        ]);
      }
    });
  });

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
