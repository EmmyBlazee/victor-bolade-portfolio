-- Run this in the Supabase SQL Editor

-- 1. Create the projects table
CREATE TABLE projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text,
  image_url text not null,
  description text,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create the site settings table
CREATE TABLE site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create the storage bucket for project images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true);

-- 4. Enable public reading of images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'project-images' );

-- 5. Enable admin uploading of images
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'project-images' );
