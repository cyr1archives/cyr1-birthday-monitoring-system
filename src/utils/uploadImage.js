import { supabase } from "../lib/supabase";

export async function uploadEmployeeImage(file) {
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage
    .from("employees")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("employees")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
