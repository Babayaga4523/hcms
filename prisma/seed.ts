import { PrismaClient, Gender, EmployeeStatus, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create Departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: "MKT" },
      update: {},
      create: { code: "MKT", name: "Marketing", description: "Marketing Department" },
    }),
    prisma.department.upsert({
      where: { code: "OPS" },
      update: {},
      create: { code: "OPS", name: "Operations", description: "Operations Department" },
    }),
    prisma.department.upsert({
      where: { code: "FIN" },
      update: {},
      create: { code: "FIN", name: "Finance", description: "Finance Department" },
    }),
    prisma.department.upsert({
      where: { code: "HR" },
      update: {},
      create: { code: "HR", name: "Human Capital", description: "Human Capital Department" },
    }),
    prisma.department.upsert({
      where: { code: "EXEC" },
      update: {},
      create: { code: "EXEC", name: "Executive", description: "Executive Department" },
    }),
  ]);

  console.log(`Created ${departments.length} departments`);

  // Create Divisions
  const divisions = await Promise.all([
    prisma.division.upsert({
      where: { code: "SALES" },
      update: {},
      create: { code: "SALES", name: "Sales", departmentId: departments[0].id },
    }),
    prisma.division.upsert({
      where: { code: "MKT-COMM" },
      update: {},
      create: { code: "MKT-COMM", name: "Marketing Communications", departmentId: departments[0].id },
    }),
    prisma.division.upsert({
      where: { code: "OPS-LOAN" },
      update: {},
      create: { code: "OPS-LOAN", name: "Loan Operations", departmentId: departments[1].id },
    }),
    prisma.division.upsert({
      where: { code: "OPS-CUST" },
      update: {},
      create: { code: "OPS-CUST", name: "Customer Service", departmentId: departments[1].id },
    }),
    prisma.division.upsert({
      where: { code: "FIN-ACC" },
      update: {},
      create: { code: "FIN-ACC", name: "Accounting", departmentId: departments[2].id },
    }),
    prisma.division.upsert({
      where: { code: "FIN-TRE" },
      update: {},
      create: { code: "FIN-TRE", name: "Treasury", departmentId: departments[2].id },
    }),
    prisma.division.upsert({
      where: { code: "HC-REC" },
      update: {},
      create: { code: "HC-REC", name: "Recruitment", departmentId: departments[3].id },
    }),
    prisma.division.upsert({
      where: { code: "HC-TRAIN" },
      update: {},
      create: { code: "HC-TRAIN", name: "Training & Development", departmentId: departments[3].id },
    }),
    prisma.division.upsert({
      where: { code: "EXEC-BOD" },
      update: {},
      create: { code: "EXEC-BOD", name: "Board of Directors", departmentId: departments[4].id },
    }),
  ]);

  console.log(`Created ${divisions.length} divisions`);

  // Create Positions
  const positions = await Promise.all([
    prisma.position.upsert({
      where: { code: "DIR" },
      update: {},
      create: { code: "DIR", name: "Director", level: 1, divisionId: divisions[8].id },
    }),
    prisma.position.upsert({
      where: { code: "MGR" },
      update: {},
      create: { code: "MGR", name: "Manager", level: 2, divisionId: divisions[0].id },
    }),
    prisma.position.upsert({
      where: { code: "SPV" },
      update: {},
      create: { code: "SPV", name: "Supervisor", level: 3, divisionId: divisions[0].id },
    }),
    prisma.position.upsert({
      where: { code: "AM" },
      update: {},
      create: { code: "AM", name: "Account Manager", level: 4, divisionId: divisions[0].id },
    }),
    prisma.position.upsert({
      where: { code: "STAFF" },
      update: {},
      create: { code: "STAFF", name: "Staff", level: 5, divisionId: divisions[0].id },
    }),
  ]);

  console.log(`Created ${positions.length} positions`);

  // Create Leave Types
  const leaveTypes = await Promise.all([
    prisma.leaveType.upsert({
      where: { code: "ANNUAL" },
      update: {},
      create: { code: "ANNUAL", name: "Annual Leave (Cuti Tahunan)", isPaid: true },
    }),
    prisma.leaveType.upsert({
      where: { code: "SICK" },
      update: {},
      create: { code: "SICK", name: "Sick Leave (Cuti Sakit)", isPaid: true },
    }),
    prisma.leaveType.upsert({
      where: { code: "PERSONAL" },
      update: {},
      create: { code: "PERSONAL", name: "Personal Leave (Cuti Pribadi)", isPaid: true },
    }),
    prisma.leaveType.upsert({
      where: { code: "MATERNITY" },
      update: {},
      create: { code: "MATERNITY", name: "Maternity Leave", isPaid: true },
    }),
    prisma.leaveType.upsert({
      where: { code: "PATERNITY" },
      update: {},
      create: { code: "PATERNITY", name: "Paternity Leave", isPaid: true },
    }),
    prisma.leaveType.upsert({
      where: { code: "UNPAID" },
      update: {},
      create: { code: "UNPAID", name: "Unpaid Leave", isPaid: false },
    }),
  ]);

  console.log(`Created ${leaveTypes.length} leave types`);

  // Create Employees
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { nik: "BNI001" },
      update: {},
      create: {
        nik: "BNI001",
        email: "joko.susilo@bnifinance.co.id",
        firstName: "Joko",
        lastName: "Susilo",
        gender: Gender.MALE,
        birthDate: new Date("1985-07-19"),
        phone: "081234567890",
        address: "Jl. Sudirman No. 123, Jakarta Selatan",
        positionId: positions[0].id,
        divisionId: divisions[8].id,
        departmentId: departments[4].id,
        joinDate: new Date("2010-02-28"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175011907850001",
        npwpNumber: "01.234.567.8-999.000",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI002" },
      update: {},
      create: {
        nik: "BNI002",
        email: "dewi.kusuma@bnifinance.co.id",
        firstName: "Dewi",
        lastName: "Kusuma",
        gender: Gender.FEMALE,
        birthDate: new Date("1988-03-15"),
        phone: "081234567891",
        address: "Jl. Gatot Subroto No. 45, Jakarta Pusat",
        positionId: positions[1].id,
        divisionId: divisions[0].id,
        departmentId: departments[0].id,
        joinDate: new Date("2012-05-10"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175011503880002",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI003" },
      update: {},
      create: {
        nik: "BNI003",
        email: "budi.santoso@bnifinance.co.id",
        firstName: "Budi",
        lastName: "Santoso",
        gender: Gender.MALE,
        birthDate: new Date("1990-05-15"),
        phone: "081234567892",
        address: "Jl. Thamrin No. 78, Jakarta Pusat",
        positionId: positions[2].id,
        divisionId: divisions[0].id,
        departmentId: departments[0].id,
        joinDate: new Date("2015-08-20"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175011505900003",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI004" },
      update: {},
      create: {
        nik: "BNI004",
        email: "siti.rahayu@bnifinance.co.id",
        firstName: "Siti",
        lastName: "Rahayu",
        gender: Gender.FEMALE,
        birthDate: new Date("1992-08-22"),
        phone: "081234567893",
        address: "Jl. Casablanca No. 56, Jakarta Selatan",
        positionId: positions[3].id,
        divisionId: divisions[0].id,
        departmentId: departments[0].id,
        joinDate: new Date("2018-01-15"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175012208920004",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI005" },
      update: {},
      create: {
        nik: "BNI005",
        email: "andi.wijaya@bnifinance.co.id",
        firstName: "Andi",
        lastName: "Wijaya",
        gender: Gender.MALE,
        birthDate: new Date("1994-11-30"),
        phone: "081234567894",
        address: "Jl. KH. Wahid Hasyim No. 12, Jakarta Pusat",
        positionId: positions[4].id,
        divisionId: divisions[1].id,
        departmentId: departments[0].id,
        joinDate: new Date("2020-03-01"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175013011940005",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI006" },
      update: {},
      create: {
        nik: "BNI006",
        email: "diana.pratama@bnifinance.co.id",
        firstName: "Diana",
        lastName: "Pratama",
        gender: Gender.FEMALE,
        birthDate: new Date("1995-03-28"),
        phone: "081234567895",
        address: "Jl. Pangeran Diponegoro No. 34, Jakarta Pusat",
        positionId: positions[4].id,
        divisionId: divisions[2].id,
        departmentId: departments[1].id,
        joinDate: new Date("2021-06-15"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175012803950006",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI007" },
      update: {},
      create: {
        nik: "BNI007",
        email: "eka.putri@bnifinance.co.id",
        firstName: "Eka",
        lastName: "Putri",
        gender: Gender.FEMALE,
        birthDate: new Date("1996-07-12"),
        phone: "081234567896",
        address: "Jl. Sisingamangaraja No. 67, Jakarta Selatan",
        positionId: positions[4].id,
        divisionId: divisions[4].id,
        departmentId: departments[2].id,
        joinDate: new Date("2022-01-10"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175011207960007",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI008" },
      update: {},
      create: {
        nik: "BNI008",
        email: "fajar.hidayat@bnifinance.co.id",
        firstName: "Fajar",
        lastName: "Hidayat",
        gender: Gender.MALE,
        birthDate: new Date("1993-09-25"),
        phone: "081234567897",
        address: "Jl. Tebet Raya No. 89, Jakarta Selatan",
        positionId: positions[4].id,
        divisionId: divisions[6].id,
        departmentId: departments[3].id,
        joinDate: new Date("2019-11-05"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175012509930008",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI009" },
      update: {},
      create: {
        nik: "BNI009",
        email: "gita.permata@bnifinance.co.id",
        firstName: "Gita",
        lastName: "Permata",
        gender: Gender.FEMALE,
        birthDate: new Date("1997-12-08"),
        phone: "081234567898",
        address: "Jl. Melawai No. 12, Jakarta Selatan",
        positionId: positions[4].id,
        divisionId: divisions[7].id,
        departmentId: departments[3].id,
        joinDate: new Date("2023-02-20"),
        status: EmployeeStatus.ACTIVE,
        ktpNumber: "3175010812970009",
      },
    }),
    prisma.employee.upsert({
      where: { nik: "BNI010" },
      update: {},
      create: {
        nik: "BNI010",
        email: "hendra.nugroho@bnifinance.co.id",
        firstName: "Hendra",
        lastName: "Nugroho",
        gender: Gender.MALE,
        birthDate: new Date("1991-04-18"),
        phone: "081234567899",
        address: "Jl. Fatmawati No. 45, Jakarta Selatan",
        positionId: positions[4].id,
        divisionId: divisions[3].id,
        departmentId: departments[1].id,
        joinDate: new Date("2017-07-25"),
        status: EmployeeStatus.INACTIVE,
        ktpNumber: "3175011804910010",
      },
    }),
  ]);

  console.log(`Created ${employees.length} employees`);

  // Create Leave Quotas for current year
  const currentYear = new Date().getFullYear();
  for (const employee of employees) {
    for (const leaveType of leaveTypes.slice(0, 3)) {
      const totalDays =
        leaveType.code === "ANNUAL"
          ? 14
          : leaveType.code === "SICK"
          ? 5
          : leaveType.code === "PERSONAL"
          ? 3
          : 0;

      if (totalDays > 0) {
        await prisma.leaveQuota.upsert({
          where: {
            employeeId_leaveTypeId_year: {
              employeeId: employee.id,
              leaveTypeId: leaveType.id,
              year: currentYear,
            },
          },
          update: {},
          create: {
            employeeId: employee.id,
            leaveTypeId: leaveType.id,
            year: currentYear,
            totalDays,
            usedDays: Math.floor(Math.random() * (totalDays / 2)),
          },
        });
      }
    }
  }

  console.log(`Created leave quotas for ${employees.length} employees`);

  // Create Public Holidays for current year
  const holidays = [
    { date: new Date("2026-01-01"), name: "Tahun Baru Masehi" },
    { date: new Date("2026-01-29"), name: "Isra Mikraj Nabi Muhammad" },
    { date: new Date("2026-02-18"), name: "Imlek" },
    { date: new Date("2026-03-11"), name: "Hari Suci Nyepi" },
    { date: new Date("2026-03-30"), name: "Hari Raya Eid Al-Fitr" },
    { date: new Date("2026-03-31"), name: "Hari Raya Eid Al-Fitr" },
    { date: new Date("2026-04-03"), name: "Cuti Bersama Eid Al-Fitr" },
    { date: new Date("2026-05-01"), name: "Hari Buruh Internasional" },
    { date: new Date("2026-05-06"), name: "Hari Raya Waisak" },
    { date: new Date("2026-05-25"), name: "Kenaikan Isa Al-Masih" },
    { date: new Date("2026-06-01"), name: "Hari Lahir Pancasila" },
    { date: new Date("2026-06-06"), name: "Cuti Bersama Eid Al-Adha" },
    { date: new Date("2026-08-17"), name: "Hari Ulang Tahun Kemerdekaan RI" },
    { date: new Date("2026-09-06"), name: "Hari Raya Eid Al-Adha" },
    { date: new Date("2026-09-25"), name: "Tahun Baru Islam" },
    { date: new Date("2026-10-20"), name: "Maulid Nabi Muhammad" },
    { date: new Date("2026-12-25"), name: "Hari Raya Natal" },
  ];

  for (const holiday of holidays) {
    await prisma.publicHoliday.upsert({
      where: {
        date_name: {
          date: holiday.date,
          name: holiday.name,
        },
      },
      update: {},
      create: holiday,
    });
  }

  console.log(`Created ${holidays.length} public holidays`);

  // Create Work Schedules
  const workSchedules = [];
  for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
    // Monday to Friday
    workSchedules.push({
      name: `Weekday ${dayOfWeek}`,
      dayOfWeek,
      startTime: "08:00",
      endTime: "17:00",
      isWorking: true,
    });
  }
  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    // Saturday and Sunday - non-working
    if (dayOfWeek !== 0 && dayOfWeek !== 6) continue;
    workSchedules.push({
      name: `Weekend ${dayOfWeek === 0 ? "Sunday" : "Saturday"}`,
      dayOfWeek,
      startTime: "00:00",
      endTime: "00:00",
      isWorking: false,
    });
  }

  for (const schedule of workSchedules) {
    await prisma.workSchedule.upsert({
      where: {
        name_dayOfWeek: {
          name: schedule.name,
          dayOfWeek: schedule.dayOfWeek,
        },
      },
      update: {},
      create: schedule,
    });
  }

  console.log(`Created ${workSchedules.length} work schedules`);

  // ============ CREATE USERS ============
  console.log("Creating users...");

  // Create Admin User (linked to first employee - Joko Susilo)
  const adminPassword = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@bnifinance.co.id" },
    update: {},
    create: {
      email: "admin@bnifinance.co.id",
      password: adminPassword,
      employeeId: employees[0].id,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });
  console.log("Created admin user: admin@bnifinance.co.id / admin123");

  // Create Employee Users
  const employeePassword = await hash("password123", 12);
  for (let i = 1; i < employees.length; i++) {
    const employee = employees[i];
    await prisma.user.upsert({
      where: { email: employee.email },
      update: {},
      create: {
        email: employee.email,
        password: employeePassword,
        employeeId: employee.id,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
    });
  }
  console.log(`Created ${employees.length - 1} employee users`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
