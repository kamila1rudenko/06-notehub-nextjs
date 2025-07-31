import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "../NoteDetails.client";
import { JSX } from "react";

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={dehydratedState} />;
}
