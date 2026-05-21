"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ArrowLeft,
  Plus,
  Phone,
  Mail,
  Calendar,
  Building2,
  MapPin,
  Award,
  User,
  Users,
  AlertCircle,
  FileText,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Laptop,
  History,
  BookOpen,
  UserCheck,
  Wallet,
  Edit,
  MoreVertical,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId =
  | "basic"
  | "family"
  | "emergency"
  | "education"
  | "position"
  | "document"
  | "asset"
  | "work-experience"
  | "training"
  | "direct-spv"
  | "compensation";

interface EmployeeDetailData {
  id: string;
  nik: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  phone?: string;
  address?: string;
  position: { id: string; code: string; name: string };
  division: { id: string; code: string; name: string; department: { id: string; code: string; name: string } };
  joinDate: string;
  status: "ACTIVE" | "INACTIVE" | "RESIGNED" | "TERMINATED";
  ktpNumber?: string;
  bpjsNumber?: string;
  npwpNumber?: string;
  profilePhoto?: string;
  maritalStatus?: string;
  religion?: string;
  placeOfBirth?: string;
  kkNumber?: string;
  privateEmail?: string;
  ktpAddress?: {
    street?: string;
    rt?: string;
    rw?: string;
    village?: string;
    district?: string;
    city?: string;
    postalCode?: string;
  };
  domicileAddress?: {
    street?: string;
    rt?: string;
    rw?: string;
    village?: string;
    district?: string;
    city?: string;
    postalCode?: string;
  };
  employmentAgreement?: string;
  employeeStatus?: string;
  families?: Array<{
    id: string;
    name: string;
    relationship: string;
    birthDate?: string;
    phone?: string;
    occupation?: string;
    isEmergencyContact: boolean;
  }>;
  educations?: Array<{
    id: string;
    level: string;
    institution: string;
    major?: string;
    year?: number;
    grade?: string;
  }>;
  emergencyContacts?: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    address?: string;
  }>;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url?: string;
  }>;
  assets?: Array<{
    id: string;
    name: string;
    serialNumber?: string;
    issueDate?: string;
    status: string;
  }>;
  workExperiences?: Array<{
    id: string;
    company: string;
    position: string;
    startDate?: string;
    endDate?: string;
  }>;
  trainings?: Array<{
    id: string;
    name: string;
    organizer?: string;
    year?: number;
    certificate?: string;
  }>;
  directSupervisor?: {
    name: string;
    position: string;
    phone?: string;
  };
  basicSalary?: number;
  allowances?: {
    transport?: number;
    meal?: number;
    communication?: number;
    health?: number;
    other?: number;
  };
}

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  const years = differenceInYears(today, birth);
  const months = differenceInMonths(today, birth) % 12;
  return { years, months };
};

const calculateServiceLength = (joinDate: string) => {
  const today = new Date();
  const joined = new Date(joinDate);
  const years = differenceInYears(today, joined);
  const months = differenceInMonths(today, joined) % 12;
  return { years, months };
};

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "family", label: "Family", icon: Users },
  { id: "emergency", label: "Emergency", icon: AlertCircle },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "position", label: "Position", icon: Briefcase },
  { id: "document", label: "Document", icon: FileText },
  { id: "asset", label: "Asset", icon: Laptop },
  { id: "work-experience", label: "Work Experience", icon: History },
  { id: "training", label: "Training", icon: BookOpen },
  { id: "direct-spv", label: "Direct SPV", icon: UserCheck },
  { id: "compensation", label: "Compensation", icon: Wallet },
];

export default function EmployeeDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { status } = useSession();

  const [employee, setEmployee] = useState<EmployeeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [editOpen, setEditOpen] = useState(false);

  const loadEmployee = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const res = await fetch(`/api/employees/${id}`, { credentials: "include" });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to load employee data");
      }

      setEmployee(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [id, status]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  if (loading || status === "loading") {
    return <EmployeeDetailSkeleton />;
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.back()}>
          Kembali ke Daftar Karyawan
        </Button>
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
          <h2 className="text-lg font-semibold text-red-700">Error Memuat Profil</h2>
          <p className="text-sm text-red-600 mt-1">{error || "Karyawan tidak ditemukan."}</p>
        </div>
      </div>
    );
  }

  const age = calculateAge(employee.birthDate);
  const serviceLength = calculateServiceLength(employee.joinDate);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.push("/employee")}>
            Back
          </Button>
          <h1 className="text-xl font-bold text-[#1A1A2E] hidden md:block">Detail Karyawan</h1>
        </div>
        <Button variant="secondary" size="sm" leftIcon={<Edit className="h-4 w-4" />} onClick={() => setEditOpen(true)}>
          Edit
        </Button>
      </div>

      {/* Profile Header - Compact */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          {/* Avatar and Basic Info Wrapper for mobile */}
          <div className="flex items-start gap-4 flex-1 w-full">
            {/* Avatar */}
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#1A2B6B] to-[#3B82F6] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {employee.profilePhoto ? (
                <img src={employee.profilePhoto} alt="" className="h-full w-full rounded-xl object-cover" />
              ) : (
                `${employee.firstName[0]}${employee.lastName[0]}`
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-[#1A1A2E] truncate max-w-full">
                  {employee.firstName} {employee.lastName}
                </h1>
                <Badge status={employee.status} className="text-[10px] px-2 py-0.5">
                  {employee.status}
                </Badge>
              </div>
              <p className="text-sm text-[#6B7280]">{employee.position.name}</p>
              <p className="text-xs text-[#9CA3AF]">{employee.division.name} &bull; {employee.division.department.name}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <div className="text-center px-3 py-2 bg-blue-50 rounded-lg min-w-24 flex-1 md:flex-none">
              <p className="text-xs text-[#9CA3AF]">Usia</p>
              <p className="text-sm font-semibold text-[#1A2B6B]">{age.years} thn {age.months} bln</p>
            </div>
            <div className="text-center px-3 py-2 bg-green-50 rounded-lg min-w-24 flex-1 md:flex-none">
              <p className="text-xs text-[#9CA3AF]">Masa Kerja</p>
              <p className="text-sm font-semibold text-[#1A2B6B]">{serviceLength.years} thn {serviceLength.months} bln</p>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Mail className="h-3.5 w-3.5" />
            <span>{employee.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Phone className="h-3.5 w-3.5" />
            <span>{employee.phone || "-"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Calendar className="h-3.5 w-3.5" />
            <span>Bergabung {format(new Date(employee.joinDate), "dd MMM yyyy", { locale: idLocale })}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
                  isActive
                    ? "border-[#1A2B6B] text-[#1A2B6B] bg-blue-50/50"
                    : "border-transparent text-[#6B7280] hover:text-[#1A1A2E] hover:bg-gray-50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === "basic" && <BasicInfoTab employee={employee} />}
          {activeTab === "family" && <FamilyTab family={employee.families} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "emergency" && <EmergencyTab contacts={employee.emergencyContacts} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "education" && <EducationTab education={employee.educations} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "position" && <PositionTab employee={employee} />}
          {activeTab === "document" && <DocumentTab documents={employee.documents} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "asset" && <AssetTab assets={employee.assets} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "work-experience" && <WorkExperienceTab workExperiences={employee.workExperiences} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {activeTab === "training" && <TrainingTab trainings={employee.trainings} employeeId={employee.id} onAdd={() => loadEmployee()} />}
          {["direct-spv", "compensation"].includes(activeTab) && (
            <div className="py-8 text-center text-[#9CA3AF]">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Tab {tabs.find(t => t.id === activeTab)?.label} dalam pengembangan</p>
            </div>
          )}
        </div>
      </div>

      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} employee={employee} onSuccess={loadEmployee} />
    </div>
  );
}

// ============ TAB COMPONENTS ============

function BasicInfoTab({ employee }: { employee: EmployeeDetailData }) {
  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <User className="h-4 w-4 text-[#1A2B6B]" />
          <h3 className="text-sm font-semibold text-[#1A1A2E]">Personal Info</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
            <InfoItem label="NIK" value={employee.nik} />
            <InfoItem label="Nomor KTP" value={employee.ktpNumber} />
            <InfoItem label="NPWP" value={employee.npwpNumber} />
            <InfoItem label="BPJS" value={employee.bpjsNumber} />
            <InfoItem
              label="TTL"
              value={employee.placeOfBirth
                ? `${employee.placeOfBirth}, ${format(new Date(employee.birthDate), "dd/MM/yyyy")}`
                : format(new Date(employee.birthDate), "dd/MM/yyyy", { locale: idLocale })
              }
            />
            <InfoItem label="Jenis Kelamin" value={employee.gender === "MALE" ? "Laki-laki" : "Perempuan"} />
            <InfoItem label="Agama" value={employee.religion} />
            <InfoItem label="Status" value={employee.maritalStatus} />
            <InfoItem label="Email Pribadi" value={employee.privateEmail} />
            <InfoItem label="No. HP" value={employee.phone} />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#1A2B6B]" />
          <h3 className="text-sm font-semibold text-[#1A1A2E]">Address Info</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressCard title="Alamat KTP" address={employee.ktpAddress} />
          <AddressCard title="Alamat Domisili" address={employee.domicileAddress} />
        </div>
      </div>
    </div>
  );
}

function FamilyTab({ family, employeeId, onAdd }: { family?: EmployeeDetailData["families"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/employees/${employeeId}/family`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (res.ok) {
        setOpen(false);
        onAdd();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>+ Tambah Keluarga</Button>
      </div>

      {!family || family.length === 0 ? (
        <EmptyState icon={Users} message="Data keluarga belum tersedia" />
      ) : (
        <div className="space-y-3">
          {family.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#1A2B6B] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                {member.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1A1A2E] truncate">{member.name}</p>
                  {member.isEmergencyContact && (
                    <Badge variant="warning" size="sm" className="text-[10px] px-1.5 py-0.5">Darurat</Badge>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">{member.relationship}</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                {member.phone && (
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {member.phone}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Anggota Keluarga">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Nama</label>
              <input name="name" required className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Hubungan</label>
              <input name="relationship" required placeholder="Contoh: Istri, Anak" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">No. HP</label>
              <input name="phone" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Pekerjaan</label>
              <input name="occupation" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Tanggal Lahir</label>
              <input name="birthDate" type="date" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function EmergencyTab({ contacts, employeeId, onAdd }: { contacts?: EmployeeDetailData["emergencyContacts"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/employees/${employeeId}/emergency-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (res.ok) {
        setOpen(false);
        onAdd();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>+ Tambah Kontak Darurat</Button>
      </div>

      {!contacts || contacts.length === 0 ? (
        <EmptyState icon={AlertCircle} message="Data kontak darurat belum tersedia" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(contact => (
            <div key={contact.id} className="p-4 border border-red-200 rounded-lg bg-red-50/50">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-600 flex-shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-red-600 uppercase">Kontak Darurat</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{contact.name}</p>
                  <p className="text-xs text-[#6B7280]">{contact.relationship}</p>
                  <p className="text-sm text-[#1A2B6B] mt-1 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {contact.phone}
                  </p>
                  {contact.address && (
                    <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{contact.address}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Kontak Darurat">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#1A1A2E]">Nama</label>
            <input name="name" required className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Hubungan</label>
              <input name="relationship" required placeholder="Contoh: Istri, Anak" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">No. HP</label>
              <input name="phone" required className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[#1A1A2E]">Alamat (Opsional)</label>
            <textarea name="address" rows={3} className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading} variant="danger">Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function EducationTab({ education, employeeId, onAdd }: { education?: EmployeeDetailData["educations"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/employees/${employeeId}/education`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (res.ok) {
        setOpen(false);
        onAdd();
      }
    } finally {
      setLoading(false);
    }
  };

  const educationOrder = ["SD", "SMP", "SMA/SMK", "D3", "S1", "S2", "S3"];
  const sortedEducation = [...(education || [])].sort((a, b) =>
    educationOrder.indexOf(a.level) - educationOrder.indexOf(b.level)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setOpen(true)}>+ Tambah Pendidikan</Button>
      </div>

      {!education || education.length === 0 ? (
        <EmptyState icon={GraduationCap} message="Data pendidikan belum tersedia" />
      ) : (
        <div className="space-y-3">
          {sortedEducation.map((edu) => (
            <div key={edu.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-[#1A2B6B]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1A1A2E] truncate">{edu.institution}</p>
                  <Badge variant="soft" size="sm" className="text-[10px] px-1.5 py-0.5">{edu.level}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                  {edu.major && <span>{edu.major}</span>}
                  {edu.year && <span>{edu.year}</span>}
                  {edu.grade && <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {edu.grade}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Riwayat Pendidikan">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Tingkat Pendidikan</label>
              <select name="level" required className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white">
                <option value="">Pilih Tingkat</option>
                {educationOrder.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Nama Institusi</label>
              <input name="institution" required className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Jurusan</label>
              <input name="major" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Tahun Lulus</label>
              <input name="year" type="number" min="1950" max="2099" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#1A1A2E]">Nilai / IPK</label>
              <input name="grade" placeholder="Contoh: 3.75" className="w-full border border-gray-300 rounded-lg p-2 text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" loading={loading}>Simpan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function PositionTab({ employee }: { employee: EmployeeDetailData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <Building2 className="h-5 w-5 text-[#1A2B6B] mx-auto mb-1" />
          <p className="text-[10px] text-[#9CA3AF] uppercase">Departemen</p>
          <p className="text-xs font-medium text-[#1A1A2E] mt-0.5">{employee.division.department.name}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <Building2 className="h-5 w-5 text-[#1A2B6B] mx-auto mb-1" />
          <p className="text-[10px] text-[#9CA3AF] uppercase">Divisi</p>
          <p className="text-xs font-medium text-[#1A1A2E] mt-0.5">{employee.division.name}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <Briefcase className="h-5 w-5 text-[#1A2B6B] mx-auto mb-1" />
          <p className="text-[10px] text-[#9CA3AF] uppercase">Jabatan</p>
          <p className="text-xs font-medium text-[#1A1A2E] mt-0.5">{employee.position.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <InfoItem label="Kode Jabatan" value={employee.position.code} />
        <InfoItem label="Tanggal Bergabung" value={format(new Date(employee.joinDate), "dd MMM yyyy", { locale: idLocale })} />
      </div>
    </div>
  );
}

// ============ HELPER COMPONENTS ============

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] text-[#9CA3AF] uppercase">{label}</p>
      <p className="text-sm text-[#1A1A2E] font-medium truncate">{value || "-"}</p>
    </div>
  );
}

function AddressCard({ title, address }: { title: string; address?: EmployeeDetailData["ktpAddress"] }) {
  const parts = address ? [
    address.street,
    address.rt ? `RT ${address.rt}` : null,
    address.rw ? `RW ${address.rw}` : null,
    address.village ? `Kel. ${address.village}` : null,
    address.district ? `Kec. ${address.district}` : null,
    address.city,
    address.postalCode ? `(${address.postalCode})` : null,
  ].filter(Boolean) : [];

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-[10px] font-medium text-[#1A2B6B] uppercase mb-1">{title}</p>
      <p className="text-xs text-[#6B7280] leading-relaxed">
        {parts.length > 0 ? parts.join(", ") : "Belum tersedia"}
      </p>
    </div>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="py-8 text-center">
      <Icon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
      <p className="text-sm text-[#9CA3AF]">{message}</p>
    </div>
  );
}

function DocumentTab({ documents, employeeId, onAdd }: { documents?: EmployeeDetailData["documents"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      type: formData.get("type"),
      url: formData.get("url") || "",
    };

    try {
      const res = await fetch(`/api/employees/${employeeId}/document`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add document");
      setOpen(false);
      onAdd();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-[#1A1A2E]">Document Data</h3>
        <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Data
        </Button>
      </div>

      {!documents || documents.length === 0 ? (
        <EmptyState icon={FileText} message="No document data found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-[#1A2B6B] opacity-80" />
                <div>
                  <h4 className="font-medium text-[#1A1A2E]">{doc.name}</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">{doc.type}</p>
                </div>
              </div>
              {doc.url && (
                <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                  View
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Document">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Document Name *</label>
            <input required name="name" className="w-full p-2 border rounded-md" placeholder="e.g. KTP, Ijazah" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Type *</label>
            <input required name="type" className="w-full p-2 border rounded-md" placeholder="e.g. Identity, Education" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Document URL</label>
            <input name="url" type="url" className="w-full p-2 border rounded-md" placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function AssetTab({ assets, employeeId, onAdd }: { assets?: EmployeeDetailData["assets"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      serialNumber: formData.get("serialNumber") || "",
      issueDate: formData.get("issueDate") || "",
      status: formData.get("status") || "ACTIVE",
    };

    try {
      const res = await fetch(`/api/employees/${employeeId}/asset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add asset");
      setOpen(false);
      onAdd();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-[#1A1A2E]">Asset Data</h3>
        <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Data
        </Button>
      </div>

      {!assets || assets.length === 0 ? (
        <EmptyState icon={Laptop} message="No asset data found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div key={asset.id} className="border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-[#1A1A2E]">{asset.name}</h4>
                <Badge variant={asset.status === "ACTIVE" ? "success" : "secondary"}>{asset.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#6B7280]">
                <div>
                  <span className="block opacity-70">Serial Number</span>
                  <span className="font-medium text-[#1A1A2E]">{asset.serialNumber || "-"}</span>
                </div>
                <div>
                  <span className="block opacity-70">Issue Date</span>
                  <span className="font-medium text-[#1A1A2E]">
                    {asset.issueDate ? format(new Date(asset.issueDate), "dd MMM yyyy", { locale: idLocale }) : "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Asset">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Asset Name *</label>
            <input required name="name" className="w-full p-2 border rounded-md" placeholder="e.g. Laptop Lenovo Thinkpad" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Serial Number</label>
            <input name="serialNumber" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Issue Date</label>
            <input name="issueDate" type="date" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Status</label>
            <select name="status" className="w-full p-2 border rounded-md">
              <option value="ACTIVE">ACTIVE</option>
              <option value="RETURNED">RETURNED</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function WorkExperienceTab({ workExperiences, employeeId, onAdd }: { workExperiences?: EmployeeDetailData["workExperiences"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      company: formData.get("company"),
      position: formData.get("position"),
      startDate: formData.get("startDate") || "",
      endDate: formData.get("endDate") || "",
    };

    try {
      const res = await fetch(`/api/employees/${employeeId}/work-experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add work experience");
      setOpen(false);
      onAdd();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding work experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-[#1A1A2E]">Work Experience</h3>
        <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Data
        </Button>
      </div>

      {!workExperiences || workExperiences.length === 0 ? (
        <EmptyState icon={History} message="No work experience found" />
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-gray-200">
          {workExperiences.map((exp) => (
            <div key={exp.id} className="relative pl-10">
              <div className="absolute left-2 top-1.5 w-3 h-3 bg-[#1A2B6B] rounded-full ring-4 ring-white" />
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-semibold text-[#1A1A2E] text-base">{exp.position}</h4>
                <p className="text-[#1A2B6B] font-medium">{exp.company}</p>
                <div className="flex items-center gap-2 text-xs text-[#6B7280] mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exp.startDate ? format(new Date(exp.startDate), "MMM yyyy", { locale: idLocale }) : "?"} 
                    {" - "} 
                    {exp.endDate ? format(new Date(exp.endDate), "MMM yyyy", { locale: idLocale }) : "Present"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Work Experience">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Company Name *</label>
            <input required name="company" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Position *</label>
            <input required name="position" className="w-full p-2 border rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Start Date</label>
              <input name="startDate" type="date" className="w-full p-2 border rounded-md" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">End Date</label>
              <input name="endDate" type="date" className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function TrainingTab({ trainings, employeeId, onAdd }: { trainings?: EmployeeDetailData["trainings"], employeeId: string, onAdd: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      organizer: formData.get("organizer") || "",
      year: formData.get("year") || "",
      certificate: formData.get("certificate") || "",
    };

    try {
      const res = await fetch(`/api/employees/${employeeId}/training`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add training");
      setOpen(false);
      onAdd();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error adding training");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-[#1A1A2E]">Training & Certifications</h3>
        <Button size="sm" onClick={() => setOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Data
        </Button>
      </div>

      {!trainings || trainings.length === 0 ? (
        <EmptyState icon={BookOpen} message="No training data found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainings.map((t) => (
            <div key={t.id} className="border border-gray-200 p-4 rounded-lg flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-[#1A2B6B] rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-[#1A1A2E]">{t.name}</h4>
                <p className="text-sm text-[#6B7280]">{t.organizer}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  {t.year && (
                    <span className="flex items-center gap-1 text-[#1A1A2E]">
                      <Calendar className="h-3 w-3 text-[#6B7280]" />
                      {t.year}
                    </span>
                  )}
                  {t.certificate && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md">Certified</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add Training">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Training Name *</label>
            <input required name="name" className="w-full p-2 border rounded-md" placeholder="e.g. Leadership Training" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Organizer</label>
            <input name="organizer" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Year</label>
            <input name="year" type="number" min="1900" max="2100" className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Certificate Link</label>
            <input name="certificate" type="url" className="w-full p-2 border rounded-md" />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function EditProfileModal({ 
  open, 
  onOpenChange, 
  employee, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  employee: EmployeeDetailData; 
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      birthDate: formData.get("birthDate"),
      gender: formData.get("gender"),
    };

    try {
      const res = await fetch(`/api/employees/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update employee");
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error updating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={() => onOpenChange(false)} title="Edit Basic Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">First Name *</label>
            <input required name="firstName" defaultValue={employee.firstName} className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Last Name *</label>
            <input required name="lastName" defaultValue={employee.lastName} className="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email *</label>
            <input required type="email" name="email" defaultValue={employee.email} className="w-full p-2 border rounded-md" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone</label>
            <input name="phone" defaultValue={employee.phone || ""} className="w-full p-2 border rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Birth Date *</label>
            <input 
              required 
              type="date" 
              name="birthDate" 
              defaultValue={employee.birthDate ? format(new Date(employee.birthDate), "yyyy-MM-dd") : ""} 
              className="w-full p-2 border rounded-md" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Gender *</label>
            <select required name="gender" defaultValue={employee.gender} className="w-full p-2 border rounded-md">
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Address</label>
          <textarea name="address" defaultValue={employee.address || ""} className="w-full p-2 border rounded-md" rows={3}></textarea>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </div>
      </form>
    </Modal>
  );
}

// ============ SKELETON ============

function EmployeeDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-14 w-20" />
            <Skeleton className="h-14 w-20" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex gap-4 mb-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-20" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
