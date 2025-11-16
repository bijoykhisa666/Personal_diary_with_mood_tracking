'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createDiaryAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags')?.toString().split(',').map(tag => tag.trim()) ?? [];
  const moodType = formData.get('moodType') as string;
  const intensity = parseInt(formData.get('intensity') as string, 10);

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized', status: 401 };
  }

  const payload = {
    title,
    content,
    tags,
    mood: {
      moodType,
      intensity,
    },
  };

  const res = await fetch('https://personal-diary-ok2z.onrender.com/api/diary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    return { success: false, message: result.message || 'Failed to add diary', status: res.status };
  }

  revalidatePath('/');

  return { success: true, data: result, status: 200 };
}