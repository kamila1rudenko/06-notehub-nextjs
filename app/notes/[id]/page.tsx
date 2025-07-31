import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "../NoteDetails.client";
import { JSX } from "react";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function NoteDetailsPage({ params }: PageProps): Promise<JSX.Element> {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  const state = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={state} />;
}