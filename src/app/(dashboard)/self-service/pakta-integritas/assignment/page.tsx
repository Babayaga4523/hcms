"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaktaIntegritasAssignmentPage() {
  const [agreed, setAgreed] = React.useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Pakta Integritas Assignment</h1>
        <p className="text-sm text-[#6B7280]">Review and sign your annual integrity pact</p>
      </div>

      <Card className="max-w-4xl mx-auto border-[#E5E7EB]">
        <CardHeader className="text-center border-b border-[#E5E7EB]">
          <CardTitle className="text-xl">PAKTA INTEGRITAS PEGAWAI BNI FINANCE</CardTitle>
          <p className="text-sm text-[#6B7280] mt-2">Tahun 2026</p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="text-sm text-[#374151] space-y-4 text-justify">
            <p>Saya yang bertanda tangan secara digital di bawah ini, berjanji dan menyatakan komitmen sebagai berikut:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Akan mematuhi segala peraturan perundang-undangan dan kebijakan internal BNI Finance yang berlaku.</li>
              <li>Akan melaksanakan tugas dan tanggung jawab dengan penuh dedikasi, kejujuran, dan profesionalisme tinggi.</li>
              <li>Menghindari segala bentuk benturan kepentingan (Conflict of Interest) dalam pelaksanaan tugas sehari-hari.</li>
              <li>Tidak akan menerima atau memberikan, secara langsung maupun tidak langsung, suap, gratifikasi, atau hadiah dalam bentuk apapun yang melanggar ketentuan.</li>
              <li>Menjaga kerahasiaan data dan informasi perusahaan serta nasabah, baik selama masih berstatus pegawai maupun setelah masa jabatan berakhir.</li>
            </ol>
            <p>Apabila saya melanggar pernyataan di atas, saya bersedia menerima sanksi administratif maupun tuntutan hukum sesuai peraturan yang berlaku.</p>
          </div>

          <div className="bg-[#F4F6FB] p-4 rounded-lg flex items-start gap-3 mt-8">
            <input
              type="checkbox"
              id="agree"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1A2B6B] focus:ring-[#1A2B6B]"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="agree" className="text-sm text-[#1A1A2E] font-medium cursor-pointer">
              Saya telah membaca, memahami, dan menyetujui seluruh isi Pakta Integritas ini.
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="primary" disabled={!agreed} leftIcon={<CheckCircle className="h-4 w-4" />}>
              Sign Document Digitally
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
