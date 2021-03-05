import { UserPath, RecipesPath, CookbooksPath } from './Constants';
import * as FileSystem from 'expo-file-system';
import * as firebase from 'firebase';


// ---------------------------------------- User ----------------------------------------

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

/**
 * Takes user object and adds it to the database
 * 
 * @param {object} user user with firstName, lastName, email, password
 * @returns the userId
 */
export async function CreateUserInDB(user) {
  const userRef = firebase.database().ref("User").push();
  const userId = null;
  (await userRef).set({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    recipeIds: [],
    cookbookIds: [],
  }).then(() => {
    userId = userRef.toString().replace("https://r-store-v1-default-rtdb.firebaseio.com/User/", "");
  });

  return userId;
}

/**
 * Checks for email address in DB
 * 
 * @param {string} email user email address
 * @returns true if duplicate, otherwise false
 */
export async function IsEmailDuplicate(email) {
  let existingUsers;
  const userRef = firebase.database().ref("User");
  await userRef.orderByChild('email').equalTo(email).once('value').then((users) => {
    existingUsers = users;
  });
  if(!existingUsers || existingUsers === 'null') {
    return false;
  } else {
    return true;
  }
}

/**
 * Finds user by email address in DB
 * 
 * @param {string} email user email address
 * @returns user object that has email, otherwise null
 */
export async function GetUserByEmail(email) {
  const userRef = firebase.database().ref("User");
  await userRef.orderByChild('email').equalTo(email).once('value').then((users) => {
    const userString = JSON.stringify(users);
    if(!userString || userString === 'null') {
      return null;
    } else {
      const user = JSON.parse(users);
      user.id = users.key();
      return user;
    }
  });

}

// ---------------------------------------- Recipes ----------------------------------------

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

/**
 * Gets the recipes from the database from the ids
 * 
 * @param {array} recipeIds the recipe ids to retrieve
 * @returns the array of recipes
 */
export async function GetRecipesFromDB(recipeIds) {
  
}


// ---------------------------------------- Cookbooks ----------------------------------------

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

/**
 * Gets the cookbooks from the database from the ids
 * 
 * @param {array} cookbookIds the cookbook ids to retrieve
 * @returns the array of cookbooks
 */
export async function GetCookbooksFromDB(cookbookIds) {

}
