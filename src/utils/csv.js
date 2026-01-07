import Papa from "papaparse";

export function importCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        try {
          const employees = data.map((row, i) => {
            if (!row.name || !row.birthday) {
              throw new Error(`Row ${i + 1}: name and birthday required`);
            }

            return {
              id: crypto.randomUUID(),
              name: row.name.trim(),
              position: row.position?.trim() || "",
              department: row.department?.trim() || "",
              birthday: row.birthday.trim(),
              image: row.image?.trim() || ""
            };
          });

          resolve(employees);
        } catch (err) {
          reject(err);
        }
      },
      error: reject
    });
  });
}

export function exportCSV(data) {
  const csv = Papa.unparse(
    data.map(e => ({
      name: e.name,
      position: e.position,
      department: e.department,
      birthday: e.birthday,
      image: e.image
    }))
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "birthday-database.csv";
  a.click();

  URL.revokeObjectURL(url);
}
