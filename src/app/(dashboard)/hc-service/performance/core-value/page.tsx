"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldAlert, Award, Compass } from "lucide-react";

interface CoreValueItem {
  id: string;
  name: string;
  indonesianName: string;
  definition: string;
  behaviors: string[];
  weight: number;
}

const defaultValues: CoreValueItem[] = [
  {
    id: "1",
    name: "Amanah",
    indonesianName: "Trustworthy",
    definition: "Memegang teguh kepercayaan yang diberikan.",
    behaviors: [
      "Memenuhi janji dan komitmen kerja.",
      "Bertanggung jawab atas tindakan dan keputusan.",
      "Berpegang teguh pada nilai moral dan etika."
    ],
    weight: 15,
  },
  {
    id: "2",
    name: "Kompeten",
    indonesianName: "Competent",
    definition: "Terus belajar dan mengembangkan kapabilitas.",
    behaviors: [
      "Meningkatkan kompetensi diri secara berkelanjutan.",
      "Menyelesaikan tugas dengan kualitas terbaik.",
      "Membantu orang lain belajar."
    ],
    weight: 20,
  },
  {
    id: "3",
    name: "Harmonis",
    indonesianName: "Harmonious",
    definition: "Saling peduli dan menghargai perbedaan.",
    behaviors: [
      "Menghargai setiap orang dengan latar belakang apapun.",
      "Suka menolong sesama rekan kerja.",
      "Membangun lingkungan kerja yang kondusif."
    ],
    weight: 15,
  },
  {
    id: "4",
    name: "Loyal",
    indonesianName: "Loyal",
    definition: "Dedikasi tinggi dan mengutamakan kepentingan bangsa.",
    behaviors: [
      "Menjaga nama baik sesama karyawan, pimpinan, dan instansi.",
      "Rela berkorban untuk mencapai tujuan yang lebih besar.",
      "Patuh kepada pimpinan sepanjang tidak bertentangan dengan hukum."
    ],
    weight: 15,
  },
];

export default function CoreValuesSetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Core Values (AKHLAK)</h1>
          <p className="text-sm text-[#6B7280]">
            Govern corporate cultural competency metrics and weight definitions.
          </p>
        </div>
        <Button variant="primary" onClick={() => alert("Value configuration updated!")}>
          Save Weights
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultValues.map((val) => (
          <Card key={val.id} className="shadow-card border-[#E5E7EB] hover:border-[#1A2B6B]/30 transition-all bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#E5E7EB]/50 bg-[#F4F6FB]/50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-[#1A2B6B]/10 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#1A2B6B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]">{val.name}</h3>
                  <p className="text-xs text-[#6B7280] italic">{val.indonesianName}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#FEF9C3] px-3 py-1 rounded-full border border-[#E8A020]/20">
                <span className="text-xs font-bold text-[#854D0E]">{val.weight}% Weight</span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-1">Definition</span>
                <p className="text-sm text-[#1A1A2E] font-medium">{val.definition}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">Key Observable Behaviors</span>
                <ul className="space-y-2">
                  {val.behaviors.map((beh, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-[#374151]">
                      <Compass className="h-4 w-4 text-[#E8A020] shrink-0 mt-0.5" />
                      <span>{beh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
