import { supabase } from "../lib/supabase";

/*
  ONE-TIME MIGRATION:
  - Reads local cached employees
  - Uploads missing ones to Supabase
*/

export async function migrateLocalEmployees() {
  const local = localStorage.getItem("cyr1_cache");
  if (!local) return;

  const localEmployees = JSON.parse(local);
  if (!Array.isArray(localEmployees) || localEmployees.length === 0)
    return;

  // Fetch existing cloud employees
  const { data: cloudEmployees } = await supabase
    .from("employees")
    .select("id, name, birthday");

  const exists = (emp) =>
    cloudEmployees?.some(
      c =>
        c.name === emp.name &&
        c.birthday === emp.birthday
    );

  const toInsert = localEmployees
    .filter(e => !exists(e))
    .map(e => ({
      name: e.name,
      position: e.position,
      department: e.department,
      birthday: e.birthday,
      image_url: e.image || null
    }));

  if (toInsert.length === 0) return;

  await supabase.from("employees").insert(toInsert);

  console.log(
    `[MIGRATION] Uploaded ${toInsert.length} employees`
  );
}
