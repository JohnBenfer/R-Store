import * as FileSystem from 'expo-file-system';

export const RecipesPath = FileSystem.documentDirectory + 'recipes.txt';
export const DEFAULT_CARD_HEIGHT = 400;
export const MARGIN = 12;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;