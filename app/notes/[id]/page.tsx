import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "../NoteDetails.client";

type Props = {
  params: {
    id: string;
  };
};

export default async function NoteDetailsPage({ params }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={dehydratedState} />;
}
