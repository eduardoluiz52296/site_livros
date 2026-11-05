export interface FieldConfig { name: string; label: string; required: boolean; kind: 'text' | 'textarea' | 'number' | 'url'; hint?: string; }
export interface ResourceConfig { key: string; singular: string; plural: string; titleField: string; bodyField: string; metaField?: string; emptyText: string; fields: FieldConfig[]; }

export const RESOURCES: Record<string, ResourceConfig> = {
  notes: { key: 'notes', singular: 'anotação', plural: 'Anotações', titleField: 'book_title', bodyField: 'content', metaField: 'author',
    emptyText: 'Nenhuma anotação ainda. Registre a primeira frase que ficou na sua cabeça.', fields: [
      { name: 'book_title', label: 'Título do livro', required: true, kind: 'text' },
      { name: 'author', label: 'Autor', required: false, kind: 'text' },
      { name: 'chapter', label: 'Capítulo ou página', required: false, kind: 'text' },
      { name: 'content', label: 'Anotação', required: true, kind: 'textarea' }] },
  opinions: { key: 'opinions', singular: 'opinião', plural: 'Opiniões', titleField: 'book_title', bodyField: 'content', metaField: 'rating',
    emptyText: 'Nenhuma opinião ainda. Conte o que você achou do último livro que leu.', fields: [
      { name: 'book_title', label: 'Título do livro', required: true, kind: 'text' },
      { name: 'rating', label: 'Nota (1 a 5)', required: true, kind: 'number' },
      { name: 'content', label: 'Sua opinião', required: true, kind: 'textarea' }] },
  photos: { key: 'photos', singular: 'foto', plural: 'Fotos', titleField: 'caption', bodyField: 'image_url', metaField: 'note_id',
    emptyText: 'Nenhuma foto ainda. Mostre seu cantinho de leitura ou uma página marcada.', fields: [
      { name: 'caption', label: 'Legenda', required: true, kind: 'text' },
      { name: 'image_url', label: 'Endereço da imagem', required: true, kind: 'url', hint: 'Cole o link de uma imagem (https://...)' },
      { name: 'note_id', label: 'Número da anotação relacionada', required: false, kind: 'number', hint: 'Opcional: o número aparece como #n nas Anotações' }] },
  ideas: { key: 'ideas', singular: 'ideia', plural: 'Ideias', titleField: 'title', bodyField: 'description', metaField: 'genre',
    emptyText: 'Nenhuma ideia ainda. Escreva o enredo que não sai da sua cabeça.', fields: [
      { name: 'title', label: 'Título da ideia', required: true, kind: 'text' },
      { name: 'genre', label: 'Gênero', required: false, kind: 'text' },
      { name: 'description', label: 'Descrição', required: true, kind: 'textarea' }] },
};
