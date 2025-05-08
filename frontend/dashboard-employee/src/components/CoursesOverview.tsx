import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import type { RunningCourseList } from "../store/useRealEmployeeStore";

interface CoursesOverviewStatsProps {
  courses: RunningCourseList[];
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
          <div className="flex space-x-6 px-4">
            {courses.map((course) => {
              const parsedData = JSON.parse(course.data);
              return (
                <CardContent
                  key={course.courseId}
                  className="rounded-md border min-w-[16rem] max-w-[16rem] overflow-hidden"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=113861&format=png&color=000000"
                    alt={course.title}
                    className="h-40 w-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start Date :{" "}
                      {new Date(parsedData.startDate).toDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      End Date : {new Date(parsedData.endDate).toDateString()}
                    </p>
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
