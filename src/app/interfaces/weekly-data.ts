import { Item } from './item';

export interface WeeklyData {
  datasetName: string; // Nombre del dataset
  data: Item[]; // Array de semanas y valores
}
