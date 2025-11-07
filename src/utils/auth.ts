import { supabase } from './supabaseClient';

const ADMIN_ROLE = 'admin';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session) return null;
  const role = session.user?.user_metadata?.role;
  return role === ADMIN_ROLE ? session : null;
}

export function getPasswordHint(): string {
  return '';
}
