import { fetchNoteById } from "../../../lib/api";
import NoteDetailsClient from "../NoteDetails.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";

export default async function NoteDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const queryClient = new QueryClient();
 await queryClient.prefetchQuery({
  queryKey: ['note', id],
  queryFn: () => fetchNoteById(id),
});
  const state = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={state} />;
}

