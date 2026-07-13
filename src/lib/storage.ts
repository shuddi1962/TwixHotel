import { createClient } from "@/lib/supabase/client"

const BUCKET = "uploads"

export async function uploadFile(file: File, path?: string) {
  const supabase = createClient()
  const filePath = path || `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file)
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return { key: filePath, url: publicUrl }
}

export async function deleteFile(path: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

export function getFileUrl(path: string) {
  const supabase = createClient()
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}
