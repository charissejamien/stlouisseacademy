// import { createClient } from "@/lib/supabase/server";

// export async function GetMerchandise() {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("merchandise")
//     .select(`*, merchandise_sizes (*)`);

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// }
