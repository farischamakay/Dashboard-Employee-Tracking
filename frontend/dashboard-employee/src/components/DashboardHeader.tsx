// import { Button } from "../components/ui/button";
// import { FileDown } from "lucide-react";
// import { useEmployeeStore } from "../store/useEmployeeStore";
// import { exportToExcel } from "../utils/exportUtils";

export default function DashboardHeader() {
  // const { employees } = useEmployeeStore();

  // const handleExport = () => {
  //   exportToExcel(employees, "Employee_Learning_Report");
  // };

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

      {/* <div className="flex gap-4 w-full md:w-auto">
        <Button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div> */}
    </div>
  );
}
