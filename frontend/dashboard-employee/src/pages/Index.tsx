import { useEmployeeStore } from "../store/useEmployeeStore";
import {
  useProgressStore,
  useRunningCourseStore,
  useRunningTryoutStore,
} from "../store/useRealEmployeeStore";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import DashboardHeader from "../components/DashboardHeader";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeOverview from "../components/EmployeeOverview";
import CoursesOverview from "../components/CoursesOverview";
import TryoutOverview from "../components/TryoutOverview";
import ExportSection from "../components/ExportSection";
import OverviewStats from "../components/OverviewStats";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "../components/ui/sonner";

const Index = () => {
  const { employees, selectedEmployee, setSelectedEmployee } =
    useEmployeeStore();

  const { progress, fetchAllProgress } = useProgressStore();

  const { listRunningCourses, fetchRunningCourses } = useRunningCourseStore();

  const { listRunningTryouts, fetchRunningTryouts } = useRunningTryoutStore();

  const [isMobile, setIsMobile] = useState(false);
  const {
    filterText,
    setFilterText,
    currentPage,
    itemsPerPage,
    setCurrentPage,
  } = useEmployeeStore();

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

  //Fetch employees
  useEffect(() => {
    fetchAllProgress().catch((err) => {
      toast.error("Failed To load : " + err.message);
      console.log(err);
    });
  }, [fetchAllProgress]);

  //Fetch courses
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchRunningCourses().catch((err: any) => {
      toast.error("Failed To load  Courses: " + err.message);
      console.log(err);
    });
  }, [fetchRunningCourses]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchRunningTryouts().catch((err: any) => {
      toast.error("Failed To load Tryout : " + err.message);
      console.log(err);
    });
  }, [fetchRunningTryouts]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.position.toLowerCase().includes(filterText.toLowerCase()) ||
        employee.department.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [employees, filterText]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Select first employee on load if none selected
  useEffect(() => {
    if (paginatedEmployees.length > 0 && !selectedEmployee) {
      setSelectedEmployee(paginatedEmployees[0]);
    }
  }, [paginatedEmployees, selectedEmployee, setSelectedEmployee]);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <OverviewStats employees={progress} />

        <CoursesOverview courses={listRunningCourses}></CoursesOverview>

        <TryoutOverview tryouts={listRunningTryouts}></TryoutOverview>

        <ExportSection reports={progress}></ExportSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Employee List */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Employees</h2>
              <span className="text-sm text-muted-foreground">
                {filteredEmployees.length} found
              </span>
            </div>

            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-8"
              />
            </div>

            <div
              className={`grid gap-4 ${
                isMobile ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-1" : ""
              }`}
            >
              {paginatedEmployees.map((employee) => (
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

            {/* Pagination */}
            {filteredEmployees.length > 0 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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
