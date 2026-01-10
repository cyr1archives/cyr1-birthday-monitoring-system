import { supabase } from "../lib/supabase";

/*
  ONE-TIME MIGRATION:
  Upload local cached employees to Supabase
*/
export async function migrateLocalEmployees() {
  const local = localStorage.getItem("cyr1_cache");
  if (!local) return;

  const localEmployees = JSON.parse(local);
  if (!Array.isArray(localEmployees) || localEmployees.length === 0)
    return;

  const { data: cloud } = await supabase
    .from("employees")
    .select("name, birthday");

  const exists = (emp) =>
    cloud?.some(
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

  if (toInsert.length > 0) {
    await supabase.from("employees").insert(toInsert);
    console.log(`[MIGRATION] ${toInsert.length} records uploaded`);
  }
}
