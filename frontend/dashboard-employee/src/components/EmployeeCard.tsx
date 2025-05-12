import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ChartLine, CircleCheck } from "lucide-react";
import type { UserData } from "../store/useRealEmployeeStore";

interface EmployeeCardProps {
  progressUser: UserData;
  onClick: () => void;
  isSelected: boolean;
}

export default function EmployeeCard({
  progressUser,
  onClick,
  isSelected,
}: EmployeeCardProps) {
  const totalCourses = progressUser.examPossible;
  const completedCourses = progressUser.examCompleted;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150?img=9"
            alt={progressUser.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {progressUser.completion === 100 && (
            <CircleCheck className="absolute -bottom-1 -right-1 text-green-500 w-5 h-5 bg-white rounded-full" />
          )}
        </div>

        <div className="overflow-hidden">
          <h3 className="font-medium text-gray-900 truncate">
            {progressUser.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{progressUser.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Course Progress</span>
          <span className="font-medium">
            {completedCourses}/{totalCourses}
          </span>
        </div>
        <Progress
          value={progressUser.completion}
          className="h-2 bg-gray-200"
          indicatorClassName="bg-blue-500"
        />
      </div>

      <div className="flex items-center gap-2 mt-3 text-sm">
        <ChartLine className="w-4 h-4 text-indigo-500" />
        <span className="text-gray-600">
          Avg. Score:{" "}
          <span className="font-medium text-gray-800">
            {progressUser.averageQuizScore}%
          </span>
        </span>
      </div>
    </Card>
  );
}
