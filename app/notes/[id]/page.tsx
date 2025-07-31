// app/notes/[id]/page.tsx
import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "../NoteDetails.client";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", params.id],
      queryFn: () => fetchNoteById(params.id),
    });
  } catch (error) {
    console.error("Failed to prefetch note:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={dehydratedState} />;
}