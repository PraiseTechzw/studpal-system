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

-- Create links table
CREATE TABLE public.links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    tags TEXT[]
);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own links" ON public.links
    FOR ALL USING (auth.uid() = user_id);

-- Create events table for Calendar
CREATE TABLE public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    type TEXT DEFAULT 'Class', -- 'Class', 'Exam', 'Study', 'Deadline'
    is_completed BOOLEAN DEFAULT false
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own events" ON public.events
    FOR ALL USING (auth.uid() = user_id);

-- Create study_groups table
CREATE TABLE public.study_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    subject TEXT,
    member_count INTEGER DEFAULT 1,
    is_private BOOLEAN DEFAULT false
);

ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public groups" ON public.study_groups
    FOR SELECT USING (NOT is_private);

CREATE POLICY "Users can create groups" ON public.study_groups
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can manage their groups" ON public.study_groups
    FOR ALL USING (auth.uid() = created_by);

-- Create tags table
CREATE TABLE public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#14b8a6'
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tags" ON public.tags
    FOR ALL USING (auth.uid() = user_id);

-- Create profiles table for extended user info
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    university TEXT,
    bio TEXT,
    location TEXT,
    phone TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Create conversations table for AI Assistant
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    last_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON public.conversations
    FOR ALL USING (auth.uid() = user_id);

-- Create messages table for conversations
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their conversation messages" ON public.messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = messages.conversation_id AND user_id = auth.uid()
        )
    );

-- Create smart_results table
CREATE TABLE public.smart_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    tool_name TEXT NOT NULL,
    input_data TEXT,
    output_result TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.smart_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their smart results" ON public.smart_results
    FOR ALL USING (auth.uid() = user_id);

-- Create market_items table
CREATE TABLE public.market_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price TEXT DEFAULT 'Free',
    rating DECIMAL DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    icon TEXT,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view market items" ON public.market_items
    FOR SELECT USING (true);

CREATE POLICY "Users can manage their own market items" ON public.market_items
    FOR ALL USING (auth.uid() = seller_id);

-- Create timer_sessions table
CREATE TABLE public.timer_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    mode TEXT NOT NULL, -- 'focus', 'break'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their timer sessions" ON public.timer_sessions
    FOR ALL USING (auth.uid() = user_id);

-- --- STORAGE CONFIGURATION ---
-- Note: Run these in the SQL Editor. Some environments may require bucket creation via UI.

-- 1. Create buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('market_resources', 'market_resources', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage policies for 'documents' (Private, User-specific)
-- Paths are expected to be {user_id}/{filename}
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Storage policies for 'avatars' (Public viewing, User-specific upload)
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatars" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4. Storage policies for 'market_resources' (Public viewing, Seller upload)
CREATE POLICY "Anyone can view market resources" ON storage.objects
    FOR SELECT USING (bucket_id = 'market_resources');

CREATE POLICY "Users can upload market resources" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'market_resources' AND auth.uid() IS NOT NULL);
