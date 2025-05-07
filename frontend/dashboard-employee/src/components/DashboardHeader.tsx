import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, FileDown } from "lucide-react";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { exportToExcel } from "../utils/exportUtils";

export default function DashboardHeader() {
  const { employees, filterText, setFilterText } = useEmployeeStore();

  const handleExport = () => {
    exportToExcel(employees, "Employee_Learning_Report");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Employee Learning Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor training performance and learning progress
        </p>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export All To Excel
        </Button>
      </div>
    </div>
  );
}
