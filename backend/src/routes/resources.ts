import { ResourceDef } from './crud';

export const RESOURCES: Record<string, ResourceDef> = {
  notes: { table: 'notes', fields: [
    { name: 'book_title', label: 'Título do livro', required: true }, { name: 'author', label: 'Autor', required: false },
    { name: 'chapter', label: 'Capítulo', required: false }, { name: 'content', label: 'Anotação', required: true }] },
  opinions: { table: 'opinions', fields: [
    { name: 'book_title', label: 'Título do livro', required: true },
    { name: 'rating', label: 'Nota', required: true, type: 'number', min: 1, max: 5 },
    { name: 'content', label: 'Opinião', required: true }] },
  photos: { table: 'photos', relation: { field: 'note_id', table: 'notes' }, fields: [
    { name: 'caption', label: 'Legenda', required: true }, { name: 'image_url', label: 'Endereço da imagem', required: true },
    { name: 'note_id', label: 'Anotação relacionada', required: false, type: 'number', min: 1, max: 2147483647 }] },
  ideas: { table: 'ideas', fields: [
    { name: 'title', label: 'Título da ideia', required: true }, { name: 'genre', label: 'Gênero', required: false },
    { name: 'description', label: 'Descrição', required: true }] },
};
