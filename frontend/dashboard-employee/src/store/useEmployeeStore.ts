
import { create } from 'zustand';

export interface Quiz {
  id: number;
  title: string;
  score: number;
  maxScore: number;
  completedAt: string;
}

export interface Course {
  id: number;
  title: string;
  progress: number;
  completed: boolean;
  quizzes: Quiz[];
}

export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  avatar: string;
  courses: Course[];
  averageScore: number;
  completionRate: number;
  lastActivity: string;
}

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
  filterText: string;
  setFilterText: (text: string) => void;
}

// Mock data for our employees
const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Budi Santoso",
    position: "Software Developer",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?img=1",
    courses: [
      {
        id: 101,
        title: "Advanced JavaScript",
        progress: 85,
        completed: false,
        quizzes: [
          { id: 1001, title: "ES6 Features", score: 90, maxScore: 100, completedAt: "2025-04-10" },
          { id: 1002, title: "Asynchronous JS", score: 85, maxScore: 100, completedAt: "2025-04-15" }
        ]
      },
      {
        id: 102,
        title: "React Fundamentals",
        progress: 100,
        completed: true,
        quizzes: [
          { id: 1003, title: "Component Basics", score: 95, maxScore: 100, completedAt: "2025-03-18" },
          { id: 1004, title: "React Hooks", score: 88, maxScore: 100, completedAt: "2025-03-25" }
        ]
      }
    ],
    averageScore: 89.5,
    completionRate: 50,
    lastActivity: "2025-04-15"
  },
  {
    id: 2,
    name: "Siti Rahma",
    position: "UI/UX Designer",
    department: "Design",
    avatar: "https://i.pravatar.cc/150?img=5",
    courses: [
      {
        id: 201,
        title: "Design Thinking",
        progress: 100,
        completed: true,
        quizzes: [
          { id: 2001, title: "User Research", score: 98, maxScore: 100, completedAt: "2025-04-02" },
          { id: 2002, title: "Prototyping", score: 92, maxScore: 100, completedAt: "2025-04-09" }
        ]
      },
      {
        id: 202,
        title: "Figma Advanced",
        progress: 75,
        completed: false,
        quizzes: [
          { id: 2003, title: "Components & Variants", score: 88, maxScore: 100, completedAt: "2025-03-22" }
        ]
      }
    ],
    averageScore: 92.7,
    completionRate: 67,
    lastActivity: "2025-04-09"
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    position: "HR Specialist",
    department: "Human Resources",
    avatar: "https://i.pravatar.cc/150?img=3",
    courses: [
      {
        id: 301,
        title: "Performance Management",
        progress: 100,
        completed: true,
        quizzes: [
          { id: 3001, title: "Setting Goals", score: 95, maxScore: 100, completedAt: "2025-03-15" },
          { id: 3002, title: "Feedback Techniques", score: 85, maxScore: 100, completedAt: "2025-03-22" }
        ]
      }
    ],
    averageScore: 90,
    completionRate: 100,
    lastActivity: "2025-03-22"
  },
  {
    id: 4,
    name: "Dewi Lestari",
    position: "Marketing Specialist",
    department: "Marketing",
    avatar: "https://i.pravatar.cc/150?img=9",
    courses: [
      {
        id: 401,
        title: "Digital Marketing",
        progress: 60,
        completed: false,
        quizzes: [
          { id: 4001, title: "SEO Basics", score: 78, maxScore: 100, completedAt: "2025-04-05" }
        ]
      },
      {
        id: 402,
        title: "Social Media Strategy",
        progress: 90,
        completed: false,
        quizzes: [
          { id: 4002, title: "Content Planning", score: 92, maxScore: 100, completedAt: "2025-03-28" },
          { id: 4003, title: "Analytics", score: 85, maxScore: 100, completedAt: "2025-04-10" }
        ]
      }
    ],
    averageScore: 85,
    completionRate: 0,
    lastActivity: "2025-04-10"
  },
  {
    id: 5,
    name: "Rini Wijaya",
    position: "Project Manager",
    department: "Engineering",
    avatar: "https://i.pravatar.cc/150?img=10",
    courses: [
      {
        id: 501,
        title: "Agile Methodology",
        progress: 100,
        completed: true,
        quizzes: [
          { id: 5001, title: "Scrum Framework", score: 96, maxScore: 100, completedAt: "2025-03-10" },
          { id: 5002, title: "Sprint Planning", score: 94, maxScore: 100, completedAt: "2025-03-17" }
        ]
      },
      {
        id: 502,
        title: "Risk Management",
        progress: 45,
        completed: false,
        quizzes: [
          { id: 5003, title: "Risk Assessment", score: 88, maxScore: 100, completedAt: "2025-04-12" }
        ]
      }
    ],
    averageScore: 92.7,
    completionRate: 50,
    lastActivity: "2025-04-12"
  },
  {
    id: 6,
    name: "Eko Prabowo",
    position: "Data Analyst",
    department: "Analytics",
    avatar: "https://i.pravatar.cc/150?img=12",
    courses: [
      {
        id: 601,
        title: "Data Visualization",
        progress: 80,
        completed: false,
        quizzes: [
          { id: 6001, title: "Chart Types", score: 92, maxScore: 100, completedAt: "2025-04-08" },
          { id: 6002, title: "Dashboard Design", score: 88, maxScore: 100, completedAt: "2025-04-15" }
        ]
      },
      {
        id: 602,
        title: "SQL Advanced",
        progress: 100,
        completed: true,
        quizzes: [
          { id: 6003, title: "Joins & Subqueries", score: 94, maxScore: 100, completedAt: "2025-03-25" },
          { id: 6004, title: "Performance Optimization", score: 90, maxScore: 100, completedAt: "2025-04-01" }
        ]
      }
    ],
    averageScore: 91,
    completionRate: 50,
    lastActivity: "2025-04-15"
  }
];

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: mockEmployees,
  isLoading: false,
  selectedEmployee: null,
  setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
  filterText: "",
  setFilterText: (text) => set({ filterText: text }),
}));
