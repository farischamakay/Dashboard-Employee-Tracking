import { Card, CardContent } from "../components/ui/card";
import type { Employee } from "../store/useEmployeeStore";
import { Users, Award, BookOpen } from "lucide-react";
import {
  PieChart,
  BarChart,
  Bar,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface OverviewStatsProps {
  employees: Employee[];
}

export default function OverviewStats({ employees }: OverviewStatsProps) {
  // Calculate overall stats
  const totalEmployees = employees.length;
  const avgCompletionRate =
    employees.reduce((sum, emp) => sum + emp.completionRate, 0) /
    totalEmployees;
  const avgScore =
    employees.reduce((sum, emp) => sum + emp.averageScore, 0) / totalEmployees;

  // const topPerformers = [...employees]
  //   .sort((a, b) => b.averageScore - a.averageScore)
  //   .slice(0, 3);

  // Department data for pie chart
  const departmentData = employees.reduce(
    (acc: Record<string, number>, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    },
    {}
  );

  const pieData = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

  // Performance trend data
  const performanceTrendData = [
    { name: "Course 1", avgScore: 82, completion: 30 },
    { name: "Course 2", avgScore: 85, completion: 45 },
    { name: "Course 3", avgScore: 87, completion: 60 },
    { name: "Course 4", avgScore: 90, completion: 78 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Employees
              </p>
              <p className="text-3xl font-bold">{totalEmployees}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Completion
              </p>
              <p className="text-3xl font-bold">
                {avgCompletionRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Quiz Score
              </p>
              <p className="text-3xl font-bold">{avgScore.toFixed(1)}%</p>
            </div>
            <div className="bg-amber-100 p-2 rounded-lg">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Courses
              </p>
              <p className="text-3xl font-bold">
                {employees.reduce(
                  (sum, emp) =>
                    sum +
                    emp.courses.filter((course) => !course.completed).length,
                  0
                )}
              </p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <BarChart className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Department Distribution</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} employees`]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-12">Employee Best Performance</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="120%">
              <BarChart
                data={performanceTrendData}
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
                    `${props.payload.name}`,
                  ]}
                />
                <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                  {performanceTrendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.avgScore >= 90
                          ? "#10b981"
                          : entry.avgScore >= 75
                          ? "#6366f1"
                          : "#f59e0b"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
