import { supabase } from './supabaseClient';
import { Institution, InstitutionInput } from '../types';

const TABLE_NAME = 'institutions';

export async function fetchInstitutions(): Promise<Institution[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(normalizeInstitution) as Institution[];
}

export async function fetchInstitutionById(id: string): Promise<Institution | null> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? (normalizeInstitution(data) as Institution) : null;
}

export async function createInstitution(payload: InstitutionInput): Promise<void> {
  const { error } = await supabase.from(TABLE_NAME).insert([normalizePayload(payload)]);

  if (error) {
    throw error;
  }
}

export async function updateInstitution(id: string, payload: Partial<InstitutionInput>): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .update(normalizePayload(payload))
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteInstitution(id: string): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

function normalizeInstitution(record: Record<string, unknown>): Institution {
  const clone: Record<string, unknown> = { ...record };
  if (clone.total_assets !== undefined && clone.total_assets !== null) {
    const numericValue = Number(clone.total_assets);
    clone.total_assets = Number.isFinite(numericValue) ? numericValue : null;
  }
  return clone as Institution;
}

function normalizePayload<T extends Partial<InstitutionInput>>(payload: T): T {
  const clone: Record<string, unknown> = { ...payload };
  if (clone.total_assets !== undefined && clone.total_assets !== null && clone.total_assets !== '') {
    const numericValue = Number(clone.total_assets);
    clone.total_assets = Number.isFinite(numericValue) ? numericValue : null;
  }
  if (clone.total_assets === '') {
    clone.total_assets = null;
  }
  return clone as T;
}
