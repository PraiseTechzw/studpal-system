-- Create notes table
CREATE TABLE public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT[],
    word_count INTEGER DEFAULT 0,
    is_favorite BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own notes" ON public.notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes" ON public.notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON public.notes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON public.notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create documents table (for Supabase Storage metadata)
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    category TEXT DEFAULT 'General'
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own documents" ON public.documents
    FOR ALL USING (auth.uid() = user_id);
