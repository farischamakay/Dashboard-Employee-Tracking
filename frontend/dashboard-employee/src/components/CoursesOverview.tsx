import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import type { RunningCourseList } from "../store/useRealEmployeeStore";

import { ClockAlert } from "lucide-react";

interface CoursesOverviewStatsProps {
  courses: RunningCourseList[];
}

function getCountdown(endDateStr: string): string {
  const endDate = new Date(endDateStr);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return `Kelas akan berakhir ${diffDays} hari lagi`;
  } else if (diffDays === 0) {
    return "Berakhir hari ini";
  } else {
    return "Sudah berakhir";
  }
}

export default function CoursesOverview({
  courses,
}: CoursesOverviewStatsProps) {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Employee currently learning</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto ms-2 mb-6">
          <div className="flex space-x-4 px-4">
            {courses.map((course) => {
              const parsedData = JSON.parse(course.data);
              return (
                <CardContent
                  key={course.courseId}
                  className="rounded-md shadow-xl relative min-w-[16rem] p-0 max-w-[16rem] overflow-hidden"
                >
                  <img
                    src="https://purdueglobalwriting.center/wp-content/uploads/2020/04/gettyimages-677892870.jpg"
                    alt={course.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-2">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium text-gray-800">
                          Expired date:
                        </span>{" "}
                        {new Date(parsedData.endDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-x-1 text-yellow-800 text-sm font-small">
                      <ClockAlert size={16} className="inline-block" />
                      {getCountdown(parsedData.endDate)}
                    </div>
                  </div>
                </CardContent>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
