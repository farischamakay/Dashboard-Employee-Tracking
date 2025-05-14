import { FileDown } from "lucide-react";
import { useEffect } from "react";
import {
  useExportStore,
  useExportDataEmploye,
} from "../store/useRealEmployeeStore";
import type { ProgressUser } from "../store/useRealEmployeeStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { exportToExcel } from "../utils/exportToExcelUtils";

interface ExportSectionProps {
  reports: ProgressUser;
}

export default function ExportSection({ reports }: ExportSectionProps) {
  const { exportBy, fileName, setExportBy, setGroupName } = useExportStore();
  const { handleGenerateAndExport } = useExportDataEmploye();

  useEffect(() => {
    if (exportBy !== "group") {
      setGroupName("");
    }
  }, [exportBy, setGroupName]);

  const handleClickExport = async () => {
    let referenceType: string | null = null;
    let referenceId: string | null = null;

    if (exportBy === "group" && fileName) {
      referenceType = "group";
      referenceId = fileName;
    } else {
      referenceType = null;
      referenceId = null;
    }

    const referenceData = { referenceType, referenceId };

    const result = await handleGenerateAndExport(referenceData);
    console.log("Hasil API:", result);
    if (result) {
      if (exportBy == "group" && fileName) {
        exportToExcel(result.users, `${fileName}_Learning_Report`);
      } else {
        exportToExcel(result.users, "Employee_Learning_Report");
      }
      console.log("Export Button Clicked 2:", {
        exportBy,
        referenceType,
        referenceId,
        user: result,
      });
    }
  };

  const groupsData = reports.groupProgress.map(({ groupId, group }) => ({
    groupId,
    group,
  }));

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
          <CardDescription>Export summary data to excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4">
            {/* Export By Select */}
            <div className="flex flex-col w-full md:w-1/4">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Export by
              </label>
              <select
                className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportBy}
                onChange={(e) =>
                  setExportBy(e.target.value as "user" | "group")
                }
              >
                <option value="user">Users</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <select
                className={`rounded-lg border border-gray-300 p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out ${
                  exportBy === "group" ? "block" : "hidden"
                }`}
                value={fileName}
                onChange={(e) => setGroupName(e.target.value)}
              >
                <option value="">Select a group</option>
                {groupsData.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.group}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleClickExport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
