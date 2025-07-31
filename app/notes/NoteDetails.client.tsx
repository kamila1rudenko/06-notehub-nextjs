"use client";

import { useState } from "react";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "../../lib/api";

import css from "./NoteDetails.module.css";

type NoteDetailsProps = {
  dehydratedState: unknown; 
};

export default function NoteDetailsClient({ dehydratedState }: NoteDetailsProps) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NoteContent />
    </QueryClientProvider>
  );
}

function NoteContent() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
