import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { Employee } from "../store/useEmployeeStore";
import { ChartLine, CircleCheck, User } from "lucide-react";

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
  isSelected: boolean;
}

export default function EmployeeCard({
  employee,
  onClick,
  isSelected,
}: EmployeeCardProps) {
  const totalCourses = employee.courses.length;
  const completedCourses = employee.courses.filter(
    (course) => course.completed
  ).length;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {employee.avatar ? (
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          {employee.completionRate === 100 && (
            <CircleCheck className="absolute -bottom-1 -right-1 text-green-500 w-5 h-5 bg-white rounded-full" />
          )}
        </div>

        <div className="overflow-hidden">
          <h3 className="font-medium text-gray-900 truncate">
            {employee.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{employee.position}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Course Progress</span>
          <span className="font-medium">
            {completedCourses}/{totalCourses}
          </span>
        </div>
        <Progress value={employee.completionRate} className="h-2" />
      </div>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <ChartLine className="w-4 h-4 text-indigo-500" />
        <span className="text-gray-600">
          Avg. Score:{" "}
          <span className="font-medium text-gray-800">
            {employee.averageScore}%
          </span>
        </span>
      </div>
    </Card>
  );
}
