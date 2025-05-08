import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import type { Employee } from "../store/useEmployeeStore";
import { ChartBar, Award, GraduationCap } from "lucide-react";
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

interface EmployeeOverviewProps {
  employee: Employee;
}

export default function EmployeeOverview({ employee }: EmployeeOverviewProps) {
  const totalQuizzes = employee.courses.reduce(
    (acc, course) => acc + course.quizzes.length,
    0
  );
  const completedCourses = employee.courses.filter(
    (course) => course.completed
  ).length;
  const totalCourses = employee.courses.length;

  // Format quiz data for the chart
  const quizData = employee.courses.flatMap((course) =>
    course.quizzes.map((quiz) => ({
      name:
        quiz.title.length > 15
          ? quiz.title.substring(0, 15) + "..."
          : quiz.title,
      score: quiz.score,
      fullName: quiz.title,
      course: course.title,
    }))
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {employee.name}
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {employee.position} • {employee.department}
            </div>
          </div>
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
              <Progress value={employee.completionRate} className="h-2 mt-2" />
            </div>

            <div className="flex flex-col p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-500">
                Average Score
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                <div className="text-2xl font-bold">
                  {employee.averageScore}%
                </div>
              </div>
              <Progress value={employee.averageScore} className="h-2 mt-2" />
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
            {employee.courses.map((course) => (
              <div key={course.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">{course.title}</h4>
                  <div className="flex items-center">
                    {course.completed ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Completed
                      </span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                        In Progress
                      </span>
                    )}
                    <span className="ml-2 text-sm font-medium">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={course.progress} />

                {course.quizzes.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Quizzes
                    </p>
                    <div className="space-y-2">
                      {course.quizzes.map((quiz) => (
                        <div
                          key={quiz.id}
                          className="flex justify-between items-center bg-white p-2 rounded text-sm"
                        >
                          <span>{quiz.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {quiz.completedAt}
                            </span>
                            <span
                              className={`font-medium ${
                                quiz.score >= 90
                                  ? "text-green-600"
                                  : quiz.score >= 75
                                  ? "text-blue-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {quiz.score}/{quiz.maxScore}
                            </span>
                          </div>
                        </div>
                      ))}
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
