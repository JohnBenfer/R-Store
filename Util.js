import { UserPath, RecipesPath, CookbooksPath } from './Constants';
import * as FileSystem from 'expo-file-system';


// -------------------- User --------------------

export async function ReadUserFromFile() {
  let returnUser;
  await FileSystem.readAsStringAsync(UserPath).then(user => {
    returnUser = JSON.parse(user);
  }).catch(err => {
    console.log('error reading userdata file');
  });
  return returnUser;
}

export async function WriteUserToFile(user) {
  FileSystem.writeAsStringAsync(UserPath, JSON.stringify(user)).then(res => {
    console.log("User file updated");
  }).catch(err => {
    console.log("Error writing user to file");
  });
}

// -------------------- Recipes --------------------

export async function ReadRecipesFromFile() {
  let returnRecipes;
  await FileSystem.readAsStringAsync(RecipesPath).then(user => {
    returnRecipes = JSON.parse(user);
  }).catch(err => {
    console.log('error reading Recipes file');
  });
  return returnRecipes;
}

export async function WriteRecipesToFile(recipes) {
  FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify(recipes)).then(res => {
    console.log("Recipes file updated");
  }).catch(err => {
    console.log("Error writing Recipes to file");
  });
}

// -------------------- Cookbooks --------------------

export async function ReadCookbooksFromFile() {
  let returnCookbooks;
  await FileSystem.readAsStringAsync(CookbooksPath).then(user => {
    returnCookbooks = JSON.parse(user);
  }).catch(err => {
    console.log('error reading Cookbooks file');
  });
  return returnCookbooks;
}

export async function WriteCookbooksToFile(cookbooks) {
  FileSystem.writeAsStringAsync(CookbooksPath, JSON.stringify(cookbooks)).then(res => {
    console.log("Cookbooks file updated");
  }).catch(err => {
    console.log("Error writing Cookbooks to file");
  });
}
