import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

export default function RunningOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Courses</CardTitle>
        <CardDescription>Employee curently learning</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 font-medium">Topic</th>
                <th className="p-3 font-medium">Start Date</th>
                <th className="p-3 font-medium">End Date</th>
                <th className="p-3 font-medium">Employee Total Enrolled</th>
                <th className="p-3 font-medium text-right">
                  Total Employee Completed
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
