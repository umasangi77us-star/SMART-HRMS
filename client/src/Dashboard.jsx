
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle2,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function StatCard({ title, value, note, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="stat-content">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{note}</span>
      </div>
    </div>
  );
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function Badge({ children }) {
  const value = String(children).toLowerCase().replaceAll(" ", "-");

  return (
    <span className={`badge badge-${value}`}>
      {children}
    </span>
  );
}

function AnalyticsPie({ title, subtitle, data, total }) {
  const categoryColors = {
    Present: "#D94B82",
    Absent: "#4680FE",
    Late: "#9275D8",
    "On Leave": "#E8A45B",
    Approved: "#55A98A",
    Pending: "#E8A45B",
    Rejected: "#E47770",
    Active: "#55A98A",
    Inactive: "#E47770",
  };

  const colors = [
    "#D94B82",
    "#9275D8",
    "#5C9EDB",
    "#E8A45B",
    "#55A98A",
    "#E47770",
  ];

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="pie-content-layout">
        <div className="pie-chart-area">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius="72%"
                  innerRadius="0%"
                  paddingAngle={3}
                  minAngle={5}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={
                        categoryColors[entry.name] ||
                        colors[index % colors.length]
                      }
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No records available</div>
          )}
        </div>

        <div className="chart-legend">
          {data.map((item, index) => (
            <div className="legend-item" key={item.name}>
              <span className="legend-left">
                <i
                  style={{
                    background:
                      categoryColors[item.name] ||
                      colors[index % colors.length],
                  }}
                />
                <span>{item.name}</span>
              </span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-total">
        <span>Total records</span>
        <strong>{total}</strong>
      </div>
    </section>
  );
}

export default function Dashboard({
  employees,
  attendance,
  leaves,
  onNavigate,
}) {
  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const pendingLeaves = leaves.filter(
    (item) => item.status === "Pending"
  ).length;

  const approvedLeaves = leaves.filter(
    (item) => item.status === "Approved"
  ).length;

  const attendanceChartData = [
    {
      name: "Present",
      value: attendance.filter((item) => item.status === "Present").length,
    },
    {
      name: "Late",
      value: attendance.filter((item) => item.status === "Late").length,
    },
    {
      name: "Absent",
      value: attendance.filter((item) => item.status === "Absent").length,
    },
    {
      name: "On Leave",
      value: attendance.filter((item) => item.status === "On Leave").length,
    },
  ].filter((item) => item.value > 0);

  const departmentChartData = [
    ...new Set(employees.map((employee) => employee.department)),
  ].map((department) => ({
    name: department,
    value: employees.filter(
      (employee) => employee.department === department
    ).length,
  }));

  const leaveChartData = [
    {
      name: "Approved",
      value: leaves.filter((item) => item.status === "Approved").length,
    },
    {
      name: "Pending",
      value: leaves.filter((item) => item.status === "Pending").length,
    },
    {
      name: "Rejected",
      value: leaves.filter((item) => item.status === "Rejected").length,
    },
  ].filter((item) => item.value > 0);

  const employeeStatusData = [
    {
      name: "Active",
      value: employees.filter((item) => item.status === "Active").length,
    },
    {
      name: "Inactive",
      value: employees.filter((item) => item.status === "Inactive").length,
    },
  ].filter((item) => item.value > 0);

  // Sample data until actual weekly attendance history is connected.
  const weeklyAttendanceData = [
    { day: "Mon", present: 24, absent: 2, late: 3 },
    { day: "Tue", present: 27, absent: 1, late: 2 },
    { day: "Wed", present: 23, absent: 3, late: 4 },
    { day: "Thu", present: 26, absent: 2, late: 2 },
    { day: "Fri", present: 28, absent: 1, late: 1 },
    { day: "Sat", present: 20, absent: 3, late: 2 },
  ];

  return (
    <>
      <SectionHeading
        title="Good morning, Admin 👋"
        subtitle="Organization insights and workforce analytics."
      />

      <div className="stats-grid">
        <StatCard
          title="Total Employees"
          value={employees.length}
          note={`${activeEmployees} active employees`}
          icon={Users}
          tone="rose"
        />

        <StatCard
          title="Present Today"
          value={presentCount}
          note="Based on attendance records"
          icon={UserCheck}
          tone="purple"
        />

        <StatCard
          title="Pending Leaves"
          value={pendingLeaves}
          note="Requests waiting for review"
          icon={Clock}
          tone="orange"
        />

        <StatCard
          title="Approved Leaves"
          value={approvedLeaves}
          note="Approved requests"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      <div className="dashboard-chart-grid">
        <AnalyticsPie
          title="Attendance Analysis"
          subtitle="Today's attendance breakdown"
          data={attendanceChartData}
          total={attendance.length}
        />

        <AnalyticsPie
          title="Department Distribution"
          subtitle="Employee strength by department"
          data={departmentChartData}
          total={employees.length}
        />

        <AnalyticsPie
          title="Leave Analysis"
          subtitle="Leave request status breakdown"
          data={leaveChartData}
          total={leaves.length}
        />

        <AnalyticsPie
          title="Employee Status"
          subtitle="Active and inactive employees"
          data={employeeStatusData}
          total={employees.length}
        />
      </div>

      <section className="panel weekly-chart-panel">
        <div className="panel-heading">
          <div>
            <h3>Weekly Attendance Trend</h3>
            <p>Daily present, absent and late comparison</p>
          </div>
          <span className="chart-tag">Sample Data</span>
        </div>

        <div className="weekly-chart">
          <ResponsiveContainer width="100%" height={290}>
            <BarChart
              data={weeklyAttendanceData}
              margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eeeaf0"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />
              <Legend />

              <Bar
                dataKey="present"
                name="Present"
                fill="#D94B82"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="absent"
                name="Absent"
                fill="#4680FE"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="late"
                name="Late"
                fill="#9275D8"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="chart-disclaimer">
          Weekly figures are illustrative sample data, not actual historical attendance.
        </p>
      </section>

      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent Employees</h3>
            <p>Latest employee records</p>
          </div>

          <button
            className="text-button"
            onClick={() => onNavigate("Employees")}
          >
            View directory →
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>DEPARTMENT</th>
                <th>ROLE</th>
                <th>JOINING DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {employees.slice(0, 5).map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar small">
                        {employee.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <strong>{employee.name}</strong>
                        <span>{employee.id}</span>
                      </div>
                    </div>
                  </td>

                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>{employee.joining}</td>
                  <td>
                    <Badge>{employee.status}</Badge>
                  </td>
                </tr>
              ))}

              {employees.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No employees available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
