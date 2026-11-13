  import { useMemo, useState } from "react";
  import {
    LayoutDashboard, Users, CalendarCheck, CalendarDays, Wallet,
    Search, Bell, Plus, Download, Filter, MoreHorizontal, Pencil,
    Trash2, Eye, X, Check, Clock, UserCheck, UserX, Briefcase,
    ChevronDown, Menu, FileText, CheckCircle2, XCircle, AlertCircle,
    FileSearch
  } from "lucide-react";
  import AIResumeAnalyzer from "./AIResumeAnalyzer";
  import "./index.css";

  const initialEmployees = [
    { id: "EMP001", name: "Priya Sharma", department: "Design", role: "UI/UX Designer", email: "priya@company.com", phone: "9876543210", joining: "2024-02-12", status: "Active" },
    { id: "EMP002", name: "Arun Kumar", department: "Development", role: "Frontend Developer", email: "arun@company.com", phone: "9876543211", joining: "2023-08-10", status: "Active" },
    { id: "EMP003", name: "Divya Raj", department: "HR", role: "HR Executive", email: "divya@company.com", phone: "9876543212", joining: "2024-05-20", status: "Active" },
    { id: "EMP004", name: "Karthik S", department: "Development", role: "Backend Developer", email: "karthik@company.com", phone: "9876543213", joining: "2022-11-05", status: "Active" },
    { id: "EMP005", name: "Meena Priya", department: "Finance", role: "Accountant", email: "meena@company.com", phone: "9876543214", joining: "2023-04-18", status: "Inactive" },
    { id: "EMP006", name: "Vijay Anand", department: "Marketing", role: "Marketing Executive", email: "vijay@company.com", phone: "9876543215", joining: "2024-01-08", status: "Active" },
  ];

  const today = new Date().toISOString().slice(0, 10);

  const initialAttendance = [
    { id: "ATT001", employeeId: "EMP001", name: "Priya Sharma", department: "Design", checkIn: "09:05 AM", checkOut: "06:10 PM", status: "Present" },
    { id: "ATT002", employeeId: "EMP002", name: "Arun Kumar", department: "Development", checkIn: "09:35 AM", checkOut: "06:00 PM", status: "Late" },
    { id: "ATT003", employeeId: "EMP003", name: "Divya Raj", department: "HR", checkIn: "09:00 AM", checkOut: "06:05 PM", status: "Present" },
    { id: "ATT004", employeeId: "EMP004", name: "Karthik S", department: "Development", checkIn: "--", checkOut: "--", status: "Absent" },
    { id: "ATT005", employeeId: "EMP005", name: "Meena Priya", department: "Finance", checkIn: "--", checkOut: "--", status: "On Leave" },
    { id: "ATT006", employeeId: "EMP006", name: "Vijay Anand", department: "Marketing", checkIn: "09:10 AM", checkOut: "06:00 PM", status: "Present" },
  ];

  const initialLeaves = [
    { id: "LEV001", employeeId: "EMP001", name: "Priya Sharma", type: "Casual Leave", from: "2026-11-10", to: "2026-11-11", days: 2, reason: "Personal work", status: "Pending" },
    { id: "LEV002", employeeId: "EMP003", name: "Divya Raj", type: "Sick Leave", from: "2026-11-06", to: "2026-11-06", days: 1, reason: "Not feeling well", status: "Approved" },
    { id: "LEV003", employeeId: "EMP002", name: "Arun Kumar", type: "Earned Leave", from: "2026-11-15", to: "2026-11-17", days: 3, reason: "Family function", status: "Pending" },
    { id: "LEV004", employeeId: "EMP006", name: "Vijay Anand", type: "Casual Leave", from: "2026-10-20", to: "2026-10-20", days: 1, reason: "Personal work", status: "Rejected" },
  ];

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Employees", icon: Users },
    { label: "Attendance", icon: CalendarCheck },
    { label: "Leave Management", icon: CalendarDays },
    { label: "AI Resume Analyzer", icon: FileSearch },
  ];

  function Badge({ children }) {
    const value = String(children).toLowerCase().replaceAll(" ", "-");
    return <span className={`badge badge-${value}`}>{children}</span>;
  }

  function StatCard({ title, value, note, icon: Icon, tone }) {
    return (
      <div className="stat-card">
        <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
        <div className="stat-content">
          <p>{title}</p>
          <h2>{value}</h2>
          <span>{note}</span>
        </div>
      </div>
    );
  }

  function SectionHeading({ title, subtitle, action }) {
    return (
      <div className="section-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
    );
  }

  function Modal({ title, onClose, children }) {
    return (
      <div className="modal-backdrop" onMouseDown={onClose}>
        <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-heading">
            <h3>{title}</h3>
            <button className="icon-button" onClick={onClose}><X size={19} /></button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function Field({ label, children }) {
    return <label className="field"><span>{label}</span>{children}</label>;
  }
  function DonutChart({ data, total, centerLabel = "Total" }) {
    const colors = ["#D94B82", "#F2A65A", "#E56B6F", "#9275D8"];
    let current = 0;

    const segments = data.map((item, index) => {
      const percentage = total ? (item.value / total) * 100 : 0;
      const segment = {
        ...item,
        color: colors[index % colors.length],
        start: current,
        percentage,
      };
      current += percentage;
      return segment;
    });

    const gradient = segments.length
      ? `conic-gradient(${segments.map(
          (item) =>
            `${item.color} ${item.start}% ${item.start + item.percentage}%`
        ).join(", ")})`
      : "#eee";

    return (
      <div className="donut-layout">
        <div className="donut-chart" style={{ background: gradient }}>
          <div className="donut-hole">
            <strong>{total}</strong>
            <span>{centerLabel}</span>
          </div>
        </div>

        <div className="chart-legend">
          {segments.map((item) => (
            <div className="legend-item" key={item.label}>
              <span className="legend-left">
                <i style={{ background: item.color }} />
                {item.label}
              </span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function BarChart({ data }) {
    const maxValue = Math.max(...data.map((item) => item.value), 1);

    return (
      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-column" key={item.label}>
            <strong>{item.value}</strong>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  function DepartmentChart({ employees }) {
    const departments = [...new Set(employees.map((e) => e.department))];

    const colors = [
      "#D94B82", "#9275D8", "#5C9EDB",
      "#E8A45B", "#55A98A", "#E47770",
    ];

    const data = departments.map((department) => ({
      label: department,
      value: employees.filter((e) => e.department === department).length,
    }));

    return (
      <div className="department-chart">
        {data.map((item, index) => (
          <div className="department-row" key={item.label}>
            <div className="department-label">
              <span>
                <i style={{ background: colors[index % colors.length] }} />
                {item.label}
              </span>
              <strong>{item.value}</strong>
            </div>
            <div className="department-track">
              <div
                style={{
                  width: `${employees.length ? (item.value / employees.length) * 100 : 0}%`,
                  background: colors[index % colors.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  const CHART_COLORS = [
    "#D94B82",
    "#9275D8",
    "#5C9EDB",
    "#E8A45B",
    "#55A98A",
    "#E47770",
  ];


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
      "#D94B82", "#9275D8", "#5C9EDB",
      "#E8A45B", "#55A98A", "#E47770",
    ];

    return (
      <section className="panel chart-panel">
        <div className="panel-heading">
          <div>
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
          <span className="chart-tag">Analytics</span>
        </div>

        

  <div className="pie-content-layout">

    {/* LEFT SIDE - PIE CHART */}
    <div className="pie-chart-area">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
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
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>

    {/* RIGHT SIDE - LEGEND */}
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

  {/* TOTAL RECORDS */}
  <div className="chart-total">
    <span>Total records</span>
    <strong>{total}</strong>
  </div>
  </section>

    );
  }
  export default function App() {
    const [activePage, setActivePage] = useState("Dashboard");
    const [employees, setEmployees] = useState(initialEmployees);
    const [attendance, setAttendance] = useState(initialAttendance);
    const [leaves, setLeaves] = useState(initialLeaves);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [modal, setModal] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [employeeForm, setEmployeeForm] = useState({
      name: "", department: "Design", role: "", email: "", phone: "", joining: today, status: "Active"
    });
    const [leaveForm, setLeaveForm] = useState({
      employeeId: "EMP001", type: "Casual Leave", from: today, to: today, reason: ""
    });
    const [leaveTab, setLeaveTab] = useState("All Requests");
    const [mobileMenu, setMobileMenu] = useState(false);

    const activeEmployees = employees.filter((e) => e.status === "Active").length;
    const presentCount = attendance.filter((a) => a.status === "Present").length;
    const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
    const approvedLeaves = leaves.filter((l) => l.status === "Approved").length;
    const attendanceChartData = [
    { name: "Present", value: attendance.filter(a => a.status === "Present").length },
    { name: "Late", value: attendance.filter(a => a.status === "Late").length },
    { name: "Absent", value: attendance.filter(a => a.status === "Absent").length },
    { name: "On Leave", value: attendance.filter(a => a.status === "On Leave").length },
  ].filter(item => item.value > 0);

  const departmentChartData = [...new Set(employees.map(e => e.department))]
    .map(department => ({
      name: department,
      value: employees.filter(e => e.department === department).length,
    }));

  const leaveChartData = [
    { name: "Approved", value: leaves.filter(l => l.status === "Approved").length },
    { name: "Pending", value: leaves.filter(l => l.status === "Pending").length },
    { name: "Rejected", value: leaves.filter(l => l.status === "Rejected").length },
  ].filter(item => item.value > 0);

  const employeeStatusData = [
    { name: "Active", value: employees.filter(e => e.status === "Active").length },
    { name: "Inactive", value: employees.filter(e => e.status === "Inactive").length },
  ].filter(item => item.value > 0);

  // Sample weekly data until daily attendance history is connected
  const weeklyAttendanceData = [
    { day: "Mon", present: 24, absent: 2, late: 3 },
    { day: "Tue", present: 27, absent: 1, late: 2 },
    { day: "Wed", present: 23, absent: 3, late: 4 },
    { day: "Thu", present: 26, absent: 2, late: 2 },
    { day: "Fri", present: 28, absent: 1, late: 1 },
    { day: "Sat", present: 20, absent: 3, late: 2 },
  ];

    const filteredEmployees = useMemo(() => employees.filter((e) => {
      const matchesSearch = `${e.name} ${e.id} ${e.department} ${e.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || e.status === statusFilter;
      const matchesDepartment = departmentFilter === "All" || e.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    }), [employees, search, statusFilter, departmentFilter]);

    const filteredAttendance = attendance.filter((a) => {
      const matchesSearch = `${a.name} ${a.employeeId} ${a.department}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (statusFilter === "All" || a.status === statusFilter);
    });

    const filteredLeaves = leaves.filter((l) => {
      const matchesSearch = `${l.name} ${l.employeeId} ${l.type}`.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (leaveTab === "All Requests" || l.status === leaveTab);
    });

    function openAddEmployee() {
      setEditingEmployee(null);
      setEmployeeForm({ name: "", department: "Design", role: "", email: "", phone: "", joining: today, status: "Active" });
      setModal("employee");
    }

    function openEditEmployee(employee) {
      setEditingEmployee(employee);
      setEmployeeForm({ ...employee });
      setModal("employee");
    }

    function saveEmployee(e) {
      e.preventDefault();
      if (editingEmployee) {
        setEmployees((prev) => prev.map((emp) => emp.id === editingEmployee.id ? { ...employeeForm, id: emp.id } : emp));
      } else {
        setEmployees((prev) => [...prev, { ...employeeForm, id: `EMP${String(Date.now()).slice(-5)}` }]);
      }
      setModal("");
    }

    function deleteEmployee(id) {
      if (window.confirm("Are you sure you want to delete this employee?")) {
        setEmployees((prev) => prev.filter((e) => e.id !== id));
      }
    }

    function updateAttendance(id, status) {
      setAttendance((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    }

    function submitLeave(e) {
      e.preventDefault();
      const employee = employees.find((emp) => emp.id === leaveForm.employeeId);
      if (!employee) return;
      const start = new Date(leaveForm.from);
      const end = new Date(leaveForm.to);
      if (end < start) {
        alert("To Date cannot be earlier than From Date.");
        return;
      }
      const days = Math.floor((end - start) / 86400000) + 1;
      setLeaves((prev) => [{
        id: `LEV${String(Date.now()).slice(-5)}`,
        employeeId: employee.id,
        name: employee.name,
        type: leaveForm.type,
        from: leaveForm.from,
        to: leaveForm.to,
        days,
        reason: leaveForm.reason,
        status: "Pending",
      }, ...prev]);
      setModal("");
      setLeaveForm({ employeeId: "EMP001", type: "Casual Leave", from: today, to: today, reason: "" });
    }

    function updateLeave(id, status) {
      setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    }

    function exportCSV(rows, filename) {
      if (!rows.length) return alert("No records to export.");
      const headers = Object.keys(rows[0]);
      const csv = [headers.join(","), ...rows.map((row) =>
        headers.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(",")
      )].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }

    function changePage(page) {
      setActivePage(page);
      setSearch("");
      setStatusFilter("All");
      setDepartmentFilter("All");
      setMobileMenu(false);
    }

    return (
      <div className="app-shell">
        <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
          <div className="brand">
            <div className="brand-mark">S</div>
            <div><strong>SmartHR</strong><span>Human Resource Management</span></div>
          </div>

          <div className="nav-label">WORKSPACE</div>
          <nav className="navigation">
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} className={`nav-item ${activePage === label ? "active" : ""}`} onClick={() => changePage(label)}>
                <Icon size={19} /><span>{label}</span>
                {label === "Leave Management" && pendingLeaves > 0 && <small>{pendingLeaves}</small>}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="help-card">
              <div className="help-icon"><FileText size={18} /></div>
              <strong>Need help?</strong>
              <p>Contact your HR administrator for support.</p>
            </div>
            <div className="profile-mini">
              <div className="avatar">HR</div>
              <div><strong>HR Admin</strong><span>Administrator</span></div>
              <MoreHorizontal size={19} />
            </div>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={21} /></button>
              <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
            </div>
            <div className="topbar-right">
              <div className="today-label"><CalendarDays size={16} /> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
              <button className="notification-button" title="Notifications"><Bell size={19} /><i /></button>
              <div className="top-avatar">HR</div>
            </div>
          </header>

          <div className="page-content">
            {activePage === "Dashboard" && (
    <>
      <SectionHeading
        title="Good morning, Admin 👋"
        subtitle="Organization insights and workforce analytics."
      />

      <div className="stats-grid">
        <StatCard title="Total Employees" value={employees.length}
          note={`${activeEmployees} active employees`} icon={Users} tone="rose" />
        <StatCard title="Present Today" value={presentCount}
          note="Based on attendance records" icon={UserCheck} tone="purple" />
        <StatCard title="Pending Leaves" value={pendingLeaves}
          note="Requests waiting for review" icon={Clock} tone="orange" />
        <StatCard title="Approved Leaves" value={approvedLeaves}
          note="Approved requests" icon={CheckCircle2} tone="green" />
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
            <RechartsBarChart
              data={weeklyAttendanceData}
              margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeaf0" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#D94B82" radius={[5, 5, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#E47770" radius={[5, 5, 0, 0]} />
              <Bar dataKey="late" name="Late" fill="#E8A45B" radius={[5, 5, 0, 0]} />
            </RechartsBarChart>
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
          <button className="text-button" onClick={() => changePage("Employees")}>
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
              {employees.slice(0, 5).map(e => (
                <tr key={e.id}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar small">
                        {e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <strong>{e.name}</strong>
                        <span>{e.id}</span>
                      </div>
                    </div>
                  </td>
                  <td>{e.department}</td>
                  <td>{e.role}</td>
                  <td>{e.joining}</td>
                  <td><Badge>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )}

            {activePage === "AI Resume Analyzer" && <AIResumeAnalyzer />}

            {activePage === "Employees" && (
              <>
                <SectionHeading title="Employees" subtitle="Manage your people, employee information and records."
                  action={<button className="primary-button" onClick={openAddEmployee}><Plus size={17} /> Add Employee</button>} />
                <div className="stats-grid compact-stats">
                  <StatCard title="Total Employees" value={employees.length} note="All employee records" icon={Users} tone="rose" />
                  <StatCard title="Active Employees" value={activeEmployees} note="Currently working" icon={UserCheck} tone="purple" />
                  <StatCard title="Inactive Employees" value={employees.length - activeEmployees} note="Not currently active" icon={UserX} tone="orange" />
                  <StatCard title="Departments" value={new Set(employees.map(e => e.department)).size} note="Across the organization" icon={Briefcase} tone="green" />
                </div>
                <section className="panel">
                  <div className="toolbar">
                    <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, department..." /></div>
                    <div className="toolbar-filters">
                      <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}><option value="All">All Departments</option>{[...new Set(employees.map(e => e.department))].map(d => <option key={d}>{d}</option>)}</select>
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>Active</option><option>Inactive</option></select>
                      <button className="outline-button" onClick={() => exportCSV(filteredEmployees, "employees.csv")}><Download size={16} /> Export</button>
                    </div>
                  </div>
                  <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>ROLE</th><th>EMAIL</th><th>JOINING DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                    <tbody>{filteredEmployees.map(e => <tr key={e.id}>
                      <td><div className="person-cell"><div className="avatar small">{e.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><strong>{e.name}</strong><span>{e.id}</span></div></div></td>
                      <td>{e.department}</td><td>{e.role}</td><td>{e.email}</td><td>{e.joining}</td><td><Badge>{e.status}</Badge></td>
                      <td><div className="action-buttons"><button title="View" onClick={() => { setSelectedEmployee(e); setModal("details"); }}><Eye size={16} /></button><button title="Edit" onClick={() => openEditEmployee(e)}><Pencil size={16} /></button><button title="Delete" className="delete-action" onClick={() => deleteEmployee(e.id)}><Trash2 size={16} /></button></div></td>
                    </tr>)}
                    {filteredEmployees.length === 0 && <tr><td colSpan="7" className="empty-state">No employees found.</td></tr>}
                    </tbody></table></div>
                  <div className="table-footer">Showing {filteredEmployees.length} of {employees.length} employees</div>
                </section>
              </>
            )}

            {activePage === "Attendance" && (
              <>
                <SectionHeading title="Attendance Management" subtitle="Track daily attendance, working status and employee check-ins."
                  action={<button className="outline-button" onClick={() => exportCSV(filteredAttendance, "attendance.csv")}><Download size={16} /> Export Report</button>} />
                <div className="stats-grid">
                  <StatCard title="Present" value={attendance.filter(a => a.status === "Present").length} note="Employees present today" icon={UserCheck} tone="rose" />
                  <StatCard title="Absent" value={attendance.filter(a => a.status === "Absent").length} note="Employees absent today" icon={UserX} tone="orange" />
                  <StatCard title="Late Arrivals" value={attendance.filter(a => a.status === "Late").length} note="After scheduled time" icon={Clock} tone="purple" />
                  <StatCard title="On Leave" value={attendance.filter(a => a.status === "On Leave").length} note="Approved leave records" icon={CalendarDays} tone="green" />
                </div>
                <section className="panel">
                  <div className="panel-heading"><div><h3>Daily Attendance</h3><p>Review and update employee attendance status</p></div><span className="date-chip"><CalendarDays size={15} /> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
                  <div className="toolbar">
                    <div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee..." /></div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All</option><option>Present</option><option>Absent</option><option>Late</option><option>On Leave</option></select>
                  </div>
                  <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>CHECK IN</th><th>CHECK OUT</th><th>STATUS</th><th>UPDATE STATUS</th></tr></thead>
                    <tbody>{filteredAttendance.map(a => <tr key={a.id}>
                      <td><div className="person-cell"><div className="avatar small">{a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><strong>{a.name}</strong><span>{a.employeeId}</span></div></div></td>
                      <td>{a.department}</td><td>{a.checkIn}</td><td>{a.checkOut}</td><td><Badge>{a.status}</Badge></td>
                      <td><select className="status-select" value={a.status} onChange={e => updateAttendance(a.id, e.target.value)}><option>Present</option><option>Absent</option><option>Late</option><option>On Leave</option></select></td>
                    </tr>)}
                    {filteredAttendance.length === 0 && <tr><td colSpan="6" className="empty-state">No attendance records found.</td></tr>}
                    </tbody></table></div>
                  <div className="table-footer">Showing {filteredAttendance.length} attendance records</div>
                </section>
              </>
            )}

            {activePage === "Leave Management" && (
              <>
                <SectionHeading title="Leave Management" subtitle="Manage leave requests, approvals and employee time off."
                  action={<button className="primary-button" onClick={() => setModal("leave")}><Plus size={17} /> Apply Leave</button>} />
                <div className="stats-grid">
                  <StatCard title="Total Requests" value={leaves.length} note="All leave applications" icon={FileText} tone="rose" />
                  <StatCard title="Pending Approvals" value={pendingLeaves} note="Awaiting HR decision" icon={Clock} tone="orange" />
                  <StatCard title="Approved Leaves" value={approvedLeaves} note="Approved applications" icon={CheckCircle2} tone="green" />
                  <StatCard title="Rejected Requests" value={leaves.filter(l => l.status === "Rejected").length} note="Not approved" icon={XCircle} tone="purple" />
                </div>

                <div className="leave-info-grid">
                  <div className="leave-info-card"><div className="leave-info-icon rose"><CalendarDays size={20} /></div><div><strong>Casual Leave</strong><p>Personal matters and planned time off</p><span>Sample policy: 12 days / year</span></div></div>
                  <div className="leave-info-card"><div className="leave-info-icon purple"><AlertCircle size={20} /></div><div><strong>Sick Leave</strong><p>Health-related absence</p><span>Sample policy: 12 days / year</span></div></div>
                  <div className="leave-info-card"><div className="leave-info-icon orange"><Briefcase size={20} /></div><div><strong>Earned Leave</strong><p>Accumulated annual leave</p><span>Sample policy: 15 days / year</span></div></div>
                </div>

                <section className="panel">
                  <div className="panel-heading"><div><h3>Leave Requests</h3><p>Review applications and manage approvals</p></div><button className="outline-button" onClick={() => exportCSV(filteredLeaves, "leave-requests.csv")}><Download size={16} /> Export</button></div>
                  <div className="leave-tabs">
                    {["All Requests", "Pending", "Approved", "Rejected"].map(tab => <button key={tab} className={leaveTab === tab ? "selected" : ""} onClick={() => setLeaveTab(tab)}>{tab}{tab === "Pending" && pendingLeaves > 0 ? ` (${pendingLeaves})` : ""}</button>)}
                  </div>
                  <div className="toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee or leave type..." /></div></div>
                  <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>LEAVE TYPE</th><th>FROM - TO</th><th>DAYS</th><th>REASON</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                    <tbody>{filteredLeaves.map(l => <tr key={l.id}>
                      <td><div className="person-cell"><div className="avatar small">{l.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><div><strong>{l.name}</strong><span>{l.employeeId}</span></div></div></td>
                      <td>{l.type}</td><td>{l.from} <span className="muted">to</span> {l.to}</td><td>{l.days}</td><td className="reason-cell">{l.reason}</td><td><Badge>{l.status}</Badge></td>
                      <td>{l.status === "Pending" ? <div className="action-buttons"><button className="approve-action" title="Approve" onClick={() => updateLeave(l.id, "Approved")}><Check size={17} /></button><button className="delete-action" title="Reject" onClick={() => updateLeave(l.id, "Rejected")}><X size={17} /></button></div> : <span className="muted">Reviewed</span>}</td>
                    </tr>)}
                    {filteredLeaves.length === 0 && <tr><td colSpan="7" className="empty-state">No leave requests found.</td></tr>}
                    </tbody></table></div>
                  <div className="table-footer">Showing {filteredLeaves.length} leave requests</div>
                </section>
                <p className="policy-note"><AlertCircle size={16} /> Leave entitlements shown above are sample values. Configure them according to your organization's HR policy.</p>
              </>
            )}
          </div>
        </main>

        {modal === "employee" && (
          <Modal title={editingEmployee ? "Edit Employee" : "Add New Employee"} onClose={() => setModal("")}>
            <form onSubmit={saveEmployee}>
              <div className="form-grid">
                <Field label="Full Name"><input required value={employeeForm.name} onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })} placeholder="Enter employee name" /></Field>
                <Field label="Department"><select value={employeeForm.department} onChange={e => setEmployeeForm({ ...employeeForm, department: e.target.value })}><option>Design</option><option>Development</option><option>HR</option><option>Finance</option><option>Marketing</option><option>Sales</option><option>Operations</option></select></Field>
                <Field label="Job Role"><input required value={employeeForm.role} onChange={e => setEmployeeForm({ ...employeeForm, role: e.target.value })} placeholder="e.g. UI/UX Designer" /></Field>
                <Field label="Email Address"><input required type="email" value={employeeForm.email} onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })} placeholder="name@company.com" /></Field>
                <Field label="Phone Number"><input value={employeeForm.phone} onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })} placeholder="Phone number" /></Field>
                <Field label="Joining Date"><input required type="date" value={employeeForm.joining} onChange={e => setEmployeeForm({ ...employeeForm, joining: e.target.value })} /></Field>
                <Field label="Employment Status"><select value={employeeForm.status} onChange={e => setEmployeeForm({ ...employeeForm, status: e.target.value })}><option>Active</option><option>Inactive</option></select></Field>
              </div>
              <div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModal("")}>Cancel</button><button type="submit" className="primary-button">{editingEmployee ? "Save Changes" : "Add Employee"}</button></div>
            </form>
          </Modal>
        )}

        {modal === "details" && selectedEmployee && (
          <Modal title="Employee Details" onClose={() => setModal("")}>
            <div className="employee-profile"><div className="avatar profile-avatar">{selectedEmployee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div><h3>{selectedEmployee.name}</h3><p>{selectedEmployee.role}</p><Badge>{selectedEmployee.status}</Badge></div>
            <div className="details-list">
              {[["Employee ID", selectedEmployee.id], ["Department", selectedEmployee.department], ["Email", selectedEmployee.email], ["Phone", selectedEmployee.phone || "Not provided"], ["Joining Date", selectedEmployee.joining]].map(([label, value]) => <div className="detail-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}
            </div>
            <div className="modal-actions"><button className="outline-button" onClick={() => setModal("")}>Close</button><button className="primary-button" onClick={() => openEditEmployee(selectedEmployee)}><Pencil size={15} /> Edit Employee</button></div>
          </Modal>
        )}

        {modal === "leave" && (
          <Modal title="Apply for Leave" onClose={() => setModal("")}>
            <form onSubmit={submitLeave}>
              <div className="form-grid">
                <Field label="Employee"><select value={leaveForm.employeeId} onChange={e => setLeaveForm({ ...leaveForm, employeeId: e.target.value })}>{employees.filter(e => e.status === "Active").map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}</select></Field>
                <Field label="Leave Type"><select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}><option>Casual Leave</option><option>Sick Leave</option><option>Earned Leave</option><option>Maternity Leave</option><option>Paternity Leave</option><option>Unpaid Leave</option></select></Field>
                <Field label="From Date"><input required type="date" value={leaveForm.from} onChange={e => setLeaveForm({ ...leaveForm, from: e.target.value })} /></Field>
                <Field label="To Date"><input required type="date" min={leaveForm.from} value={leaveForm.to} onChange={e => setLeaveForm({ ...leaveForm, to: e.target.value })} /></Field>
                <div className="full-width"><Field label="Reason for Leave"><textarea required rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="Enter reason for leave..." /></Field></div>
              </div>
              <div className="modal-actions"><button type="button" className="outline-button" onClick={() => setModal("")}>Cancel</button><button type="submit" className="primary-button">Submit Request</button></div>
            </form>
          </Modal>
        )}
      </div>
    );
  }
  import {
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart as RechartsBarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
  } from "recharts";