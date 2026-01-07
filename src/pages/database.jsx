import { useState, useMemo } from "react";
import { useEmployees } from "../context/EmployeesContext.jsx";
import { calculateAge } from "../utils/date";
import { importCSV, exportCSV } from "../utils/csv";
import { Trash2, ArrowUpDown } from "lucide-react";

/* ---------------- UTIL ---------------- */

function isUpcoming(birthday, days = 30) {
  const today = new Date();
  const d = new Date(birthday);
  d.setFullYear(today.getFullYear());
  if (d < today) d.setFullYear(today.getFullYear() + 1);
  return (d - today) / (1000 * 60 * 60 * 24) <= days;
}

/* ---------------- PAGE ---------------- */

export default function Database() {
  const { employees, setEmployees } = useEmployees();

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [asc, setAsc] = useState(true);

  const [editing, setEditing] = useState(null);
  // { id, field, value }

  const isAdmin =
    localStorage.getItem("cyr1_isAdmin") === "true";

  /* FILTER + SORT */
  const filtered = useMemo(() => {
    return [...employees]
      .filter(e =>
        [e.name, e.position, e.department]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const va =
          sortKey === "age"
            ? calculateAge(a.birthday)
            : a[sortKey];
        const vb =
          sortKey === "age"
            ? calculateAge(b.birthday)
            : b[sortKey];
        return asc ? va > vb : va < vb;
      });
  }, [employees, query, sortKey, asc]);

  /* STATS */
  const total = employees.length;
  const upcoming = employees.filter(e =>
    isUpcoming(e.birthday)
  ).length;

  function toggleSort(key) {
    if (key === sortKey) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  function handleDelete(id) {
    if (!confirm("Delete this employee?")) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
  }

  function startEdit(e, field) {
    if (!isAdmin) return;
    setEditing({
      id: e.id,
      field,
      value: e[field]
    });
  }

  function saveEdit() {
    if (!editing) return;

    setEmployees(prev =>
      prev.map(e =>
        e.id === editing.id
          ? { ...e, [editing.field]: editing.value }
          : e
      )
    );

    setEditing(null);
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const data = await importCSV(file);
    setEmployees(data);
  }

  function renderCell(e, field, type = "text") {
    if (
      editing &&
      editing.id === e.id &&
      editing.field === field
    ) {
      return (
        <input
          autoFocus
          type={type}
          value={editing.value}
          onChange={ev =>
            setEditing({ ...editing, value: ev.target.value })
          }
          onBlur={saveEdit}
          onKeyDown={ev => {
            if (ev.key === "Enter") saveEdit();
            if (ev.key === "Escape") cancelEdit();
          }}
          className="w-full px-2 py-1 rounded-md
                     bg-white/10 border border-white/20"
        />
      );
    }

    return (
      <span
        onClick={() => startEdit(e, field)}
        className={
          isAdmin
            ? "cursor-pointer hover:underline"
            : ""
        }
      >
        {e[field]}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Employee Database
          </h2>
          <p className="text-sm text-white/50">
            {total} total · {upcoming} upcoming (30 days)
          </p>
        </div>

        <div className="flex gap-2">
          <label className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer">
            Upload CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleUpload}
            />
          </label>

          <button
            onClick={() => exportCSV(employees)}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search name, position, department..."
        className="w-full px-4 py-2 rounded-xl
                   bg-white/5 border border-white/10"
      />

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl
                      bg-[#0f131a]
                      border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-black/20">
            <tr>
              {[
                ["name", "Name"],
                ["position", "Position"],
                ["department", "Department"],
                ["birthday", "Birthday"],
                ["age", "Age"]
              ].map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="p-3 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown size={14} />
                  </div>
                </th>
              ))}
              {isAdmin && <th className="p-3"></th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map(e => (
              <tr
                key={e.id}
                className="border-t border-white/5
                           hover:bg-white/5 transition"
              >
                <td className="p-3">
                  {renderCell(e, "name")}
                </td>
                <td>{renderCell(e, "position")}</td>
                <td>{renderCell(e, "department")}</td>
                <td>
                  {renderCell(e, "birthday", "date")}
                </td>
                <td>{calculateAge(e.birthday)}</td>

                {isAdmin && (
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-white/50"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
