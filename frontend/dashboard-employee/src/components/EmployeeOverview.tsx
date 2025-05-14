import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "./ui/button";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { ChartBar, Award, GraduationCap, FileDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  useExportDataEmploye,
  type UserData,
} from "../store/useRealEmployeeStore";
import { exportToExcel } from "../utils/exportToExcelUtils";

interface EmployeeOverviewProps {
  employee: UserData;
}

export default function EmployeeOverview({ employee }: EmployeeOverviewProps) {
  const { handleGenerateAndExport } = useExportDataEmploye();

  const totalQuizzes = employee.examPossible;
  const completedCourses = employee.examCompleted;
  const totalCourses = employee.examPossible;

  const handleExportEmployee = async () => {
    const referenceData = {
      referenceType: "user",
      referenceId: employee.id,
    };
    const result = await handleGenerateAndExport(referenceData);
    if (result) {
      exportToExcel(result.users, `${employee.name}_Learning_Report`);
    }
  };
  const quizData = employee.examList.map((quiz) => ({
    name:
      quiz.title.length > 15 ? quiz.title.substring(0, 15) + "..." : quiz.title,
    score: quiz.score,
    fullName: quiz.title,
    course: quiz.title,
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {employee.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {employee.groupTitle} •
            </div>
          </div>
          {employee.completion !== 0 && (
            <div className="flex items-center gap-4">
              <Button
                onClick={handleExportEmployee}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
              >
                <FileDown className="h-4 w-4" /> Export {employee.name} Report
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Courses Completed
              </div>
              <div className="mt-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-500" />
                <div className="text-2xl font-bold">
                  {completedCourses}/{totalCourses}
                </div>
              </div>
              <Progress value={employee.completion} className="h-2 mt-2" />
            </div>

            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Average Score
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">
                  {employee.averageQuizScore}%
                </div>
              </div>
              <Progress
                value={employee.averageQuizScore}
                className="h-2 mt-2"
              />
            </div>

            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Total Quizzes
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-blue-500" />
                <div className="text-2xl font-bold">{totalQuizzes}</div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          <div>
            <h3 className="font-semibold text-lg mb-4">Quiz Scores</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quizData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    label={{
                      value: "Score (%)",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: "middle" },
                    }}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value}%`,
                      `${props.payload.fullName} (${props.payload.course})`,
                    ]}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {quizData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 90
                            ? "#10b981"
                            : entry.score >= 75
                            ? "#6366f1"
                            : "#f59e0b"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employee.examList.map((course) => (
              <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                {course.score > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Quizzes
                    </p>
                    <div className="space-y-2">
                      <div
                        key={course.id}
                        className="flex justify-between items-center bg-white p-2 rounded text-sm"
                      >
                        <span>{course.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {course.status}
                          </span>
                          <span
                            className={`font-medium ${
                              course.score >= 90
                                ? "text-green-600"
                                : course.score >= 75
                                ? "text-blue-600"
                                : "text-amber-600"
                            }`}
                          >
                            {course.score}/{100}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
