import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

import { Button } from "../components/ui/button";

import { FileDown } from "lucide-react";

import { useExportStore } from "../store/useEmployeeStore";

export default function ExportSection() {
  const { exportBy, fileName, setExportBy, setFileName } = useExportStore();

  const handleExport = () => {
    console.log("Export by:", exportBy);
    console.log("File name:", fileName);
    // lanjut export logic...
  };
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Summary</CardTitle>
          <CardDescription>Export summary data to excel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex flex-col w-full md:w-1/4">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Export by
              </label>
              <select
                className="rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={exportBy}
                onChange={(e) =>
                  setExportBy(e.target.value as "all" | "users" | "groups")
                }
              >
                <option value="users">All</option>
                <option value="users">Users</option>
                <option value="groups">Groups</option>
              </select>
            </div>

            <div className="flex flex-col w-full md:flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Input Name
              </label>
              <input
                type="text"
                className="rounded-lg border border-gray-300 p-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter fullname or group name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <Button
              onClick={handleExport}
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
