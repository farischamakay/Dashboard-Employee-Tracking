import { Card, CardContent } from "../components/ui/card";
// import type { Employee } from "../store/useEmployeeStore";
import { Users, Award, BookOpen, Building2 } from "lucide-react";
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
import type { Progress } from "../store/useRealEmployeeStore";

interface OverviewStatsProps {
  employees: Progress;
}

export default function OverviewStats({ employees }: OverviewStatsProps) {
  // Calculate overall stats
  const totalEmployees = employees.totalUser;
  const avgCompletionRate = employees.completion;
  const avgScore = employees.averageQuizScore;
  const totalGroups = employees.totalGroups;

  const performanceTrendData = employees.averageScoresPerTryout;

  const departmentData = employees.groupProgress;

  const pieData = departmentData.map((item) => ({
    name: item.group,
    value: item.submitter,
  }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

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
              <p className="text-3xl font-bold">{avgCompletionRate}%</p>
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
              <p className="text-3xl font-bold">{avgScore}%</p>
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
                Total Groups
              </p>
              <p className="text-3xl font-bold">{totalGroups}</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Groups Performance</h3>
          <div className="h-[250px]">
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
                  dataKey="tryout_title"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 10, width: 50 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Avg. Tryout Users (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
                <Tooltip
                  formatter={(value, tryout_title, props) => [
                    `${value}%`,
                    `${props.payload.tryout_title}`,
                  ]}
                />
                <Bar dataKey="average_score_users" radius={[4, 4, 0, 0]}>
                  {performanceTrendData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.average_score_users >= 90
                          ? "#10b981"
                          : entry.average_score_users >= 75
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
