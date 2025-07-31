"use client";
import { useState } from "react";
import { Hydrate, useQueryClient, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../lib/api";

import css from "./NotesPage.module.css";

import SearchBox from "../../components/SearchBox/SearchBox";
import Pagination from "../../components//Pagination/Pagination";
import NoteList from "..//../components/NoteList/NoteList";
import Loading from "../../components//Loading/Loading";
import ErrorMessage from "../../components//ErrorMessage/ErrorMessage";
import Modal from "../../components//Modal/Modal";
import NoteForm from "../../components//NoteForm/NoteForm";

interface NotesClientProps {
  dehydratedState: unknown;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
    const { data, isLoading, isFetching, error } = useQuery({
        queryKey: ["notes", page, debouncedSearch],
        queryFn: () => fetchNotes(page, 12, debouncedSearch),
        staleTime: 3000,
        placeholderData: () =>
            queryClient.getQueryData(["notes", page, debouncedSearch]),
    });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleNoteCreated = () => {
    setPage(1);
    closeModal();
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  return (
    <Hydrate state={dehydratedState}>
      <div className={css.page}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
          {data?.totalPages && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        {(isLoading || isFetching) && <Loading />}
        {error && <ErrorMessage message={(error as Error).message} />}

        {!isLoading && !error && (
          <>
            {data?.notes?.length ? <NoteList notes={data.notes} /> : <p>No notes found.</p>}
          </>
        )}

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onSuccess={handleNoteCreated} />
          </Modal>
        )}
      </div>
    </Hydrate>
  );
}
