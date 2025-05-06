import { useEmployeeStore } from "../store/useEmployeeStore";
import DashboardHeader from "../components/DashboardHeader";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeOverview from "../components/EmployeeOverview";
import OverviewStats from "../components/OverviewStats";
import { useEffect, useState } from "react";

const Index = () => {
  const { employees, selectedEmployee, setSelectedEmployee, filterText } =
    useEmployeeStore();

  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Filter employees
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
      employee.position.toLowerCase().includes(filterText.toLowerCase()) ||
      employee.department.toLowerCase().includes(filterText.toLowerCase())
  );

  // Select first employee on load if none selected
  useEffect(() => {
    if (filteredEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(filteredEmployees[0]);
    }
  }, [filteredEmployees, selectedEmployee, setSelectedEmployee]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <OverviewStats employees={employees} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Employees</h2>
              <span className="text-sm text-muted-foreground">
                {filteredEmployees.length} found
              </span>
            </div>

            <div
              className={`grid gap-4 ${
                isMobile ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" : ""
              }`}
            >
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onClick={() => setSelectedEmployee(employee)}
                  isSelected={selectedEmployee?.id === employee.id}
                />
              ))}

              {filteredEmployees.length === 0 && (
                <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
                  No employees found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* Employee Detail */}
          <div className="lg:col-span-8 xl:col-span-9">
            {selectedEmployee ? (
              <EmployeeOverview employee={selectedEmployee} />
            ) : (
              <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-gray-500">
                  Select an employee to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
