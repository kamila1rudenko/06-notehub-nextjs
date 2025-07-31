"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, DehydratedState } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { fetchNoteById } from "@/lib/api";


export default function NoteDetailsClient({ dehydratedState }: { dehydratedState: DehydratedState | null | undefined }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}> 
        <Note />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

function Note() {
  const params = useParams();
  const id = params.id as string;

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong</p>;

  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </div>
  );
}