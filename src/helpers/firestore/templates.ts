/* eslint-disable prettier/prettier */
import { getCollection, getDocument } from './index';

export interface Template {
  id: string;
  html: string;
  subject: string;
}

export const TEMPLATES = 'templates';

export const getTemplate = async (id: string) =>
  (await getDocument(`${TEMPLATES}/${id}`)) as Template;

export const getTemplates = async () => (await getCollection(TEMPLATES)) as Template[];
