export interface DocumentRecord {
  id: string;
  source_type: 'manual_upload' | 'email_gmail' | 'email_outlook' | 'whatsapp_share';
  status: 'pending_review' | 'confirmed' | 'discarded';
  category: 'formula' | 'analisis' | 'imagen' | 'otro' | null;
  title: string;
  provider_label: string | null;
  specialty: string | null;
  doc_date: string | null;
  mime_type: string;
  created_at: string;
  added_by?: 'auto' | 'manual';
}

export interface Appointment {
  id: string;
  specialty: string;
  doctor_name: string;
  location_name: string | null;
  location_address: string | null;
  starts_at: string;
  status: 'confirmada' | 'pendiente' | 'completada' | 'cancelada';
  instructions: string[];
  documents?: DocumentRecord[];
  family_member_id: string | null;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number | null;
  eps: string | null;
  regime: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Diagnostic {
  id: string;
  family_member_id: string;
  disease: string;
  diagnostic_date: string | null;
  specialist: string | null;
  status: string | null;
}

export interface Medication {
  id: string;
  family_member_id: string;
  name: string;
  dose: string | null;
  form: string | null;
  frequency: string | null;
  schedule: string | null;
  target_disease: string | null;
}

export type VitalSignMetric = 'blood_pressure' | 'heart_rate' | 'oxygen_saturation';

export interface VitalSignRange {
  id: string;
  family_member_id: string;
  metric: VitalSignMetric;
  min_ideal: string | null;
  max_ideal: string | null;
}

export interface VitalSignReading {
  id: string;
  family_member_id: string;
  metric: VitalSignMetric;
  value: string;
  taken_at: string;
}

export interface FamilyMemberDetail extends FamilyMember {
  diagnostics: Diagnostic[];
  medications: Medication[];
  vitalSignRanges: VitalSignRange[];
  vitalSignReadings: VitalSignReading[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: isFormData ? options.headers : { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || 'Error de red');
  }
  return res.json();
}

export const api = {
  getDocuments: (params?: { status?: string; category?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<DocumentRecord[]>(`/documents${qs ? `?${qs}` : ''}`);
  },
  getPendingCount: () => request<{ count: number }>('/documents/pending-count'),
  uploadDocument: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<DocumentRecord>('/documents/upload', { method: 'POST', body: form });
  },
  patchDocument: (id: string, body: Partial<Pick<DocumentRecord, 'category' | 'status' | 'title'>>) =>
    request<DocumentRecord>(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getDocumentDownloadUrl: (id: string) => request<{ downloadUrl: string }>(`/documents/${id}/download-url`),

  getAppointments: (params?: { familyMemberId?: string }) =>
    request<Appointment[]>(`/appointments${params?.familyMemberId ? `?familyMemberId=${params.familyMemberId}` : ''}`),
  getAppointment: (id: string) => request<Appointment>(`/appointments/${id}`),
  getFamilyMembers: () => request<FamilyMember[]>('/family-members'),
  getFamilyMemberDetail: (id: string) => request<FamilyMemberDetail>(`/family-members/${id}`),
  linkDocument: (appointmentId: string, documentId: string) =>
    request(`/appointments/${appointmentId}/documents`, { method: 'POST', body: JSON.stringify({ documentId }) }),
  unlinkDocument: (appointmentId: string, documentId: string) =>
    request(`/appointments/${appointmentId}/documents/${documentId}`, { method: 'DELETE' }),

  createPackage: (appointmentId: string | undefined, documentIds: string[]) =>
    request<{ id: string; downloadUrl: string }>('/print-packages', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, documentIds }),
    }),
  sendPackage: (id: string, channel: 'whatsapp' | 'email' | 'share', recipient?: string) =>
    request<{ link?: string; sent?: boolean; reason?: string; downloadUrl?: string }>(
      `/print-packages/${id}/send`,
      { method: 'POST', body: JSON.stringify({ channel, recipient }) }
    ),
};
