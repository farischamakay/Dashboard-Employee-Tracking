import type { RunningTryoutList } from "../store/useRealEmployeeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";

import { HelpCircle, Timer, ClockAlert } from "lucide-react";

interface TryoutOverviewStatsProps {
  tryouts: RunningTryoutList[];
}

export default function TryoutOverview({ tryouts }: TryoutOverviewStatsProps) {
  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Exams</CardTitle>
          <CardDescription>Employee curently learning</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto ms-2 mb-6">
          <div className="flex space-x-5 px-4">
            {tryouts.map((tryout) => {
              const parsedData = JSON.parse(tryout.data);
              return (
                <CardContent
                  className={
                    "bg-green-100 shadow-xl relative text-gray-800 min-w-[250px] max-w-[250px] flex flex-col justify-between"
                  }
                >
                  <div className="text-center my-6">
                    <h3 className="text-lg font-semibold">{tryout.title}</h3>
                    {/* <p className="text-sm text-gray-500">
                      Time Management Subtitle
                    </p> */}
                  </div>

                  {/* Soal & Durasi */}
                  <div className="flex justify-around items-center mt-2">
                    <div className="flex flex-col items-center">
                      <HelpCircle size={20} />
                      <p className="font-bold">10 soal</p>
                      <p className="text-xs text-gray-500">Soal</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Timer size={20} />
                      <p className="font-bold">30</p>
                      <p className="text-xs text-gray-500">
                        {parsedData.duration / 6000} m
                      </p>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-center mt-6 text-xs">
                    <span className="flex items-center gap-1 text-gray-600">
                      <ClockAlert size={14} />
                      Tryout Running
                    </span>
                  </div>

                  {/* Hover Button Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <button className="bg-white text-black font-medium px-4 py-2 rounded-lg shadow">
                      Mulai Tryout
                    </button>
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
