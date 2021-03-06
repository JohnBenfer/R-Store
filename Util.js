import { UserPath, RecipesPath, CookbooksPath } from './Constants';
import * as FileSystem from 'expo-file-system';
import * as firebase from 'firebase';
import userReducer from './redux/reducers/userReducer';


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
  console.log('here');
  console.log(user);
  const userRef = firebase.database().ref("User").push();
  let userId = null;
  return new Promise(async resolve => {
    (await userRef).set({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      recipeIds: [],
      cookbookIds: [],
    }).then(() => {
  
      userId = userRef.toString().replace("https://r-store-v1-default-rtdb.firebaseio.com/User/", "");
      console.log("userid in create user");
      console.log(userId);
      resolve(userId);
    });
  })
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
  return new Promise( async resolve => {
    await userRef.orderByChild('email').equalTo(email).once('value').then((users) => {
      existingUsers = JSON.stringify(users);
      console.log('users by email');
      console.log(existingUsers);
      if (!existingUsers || existingUsers === 'null') {
        resolve(false);
      } else {
        resolve(true);
      }
    }).catch((e) => {
      console.log('error..');
      console.log(e);
      resolve(null);
    });
  });
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
    if (!userString || userString === 'null') {
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

/**
 * Adds the new recipe to recipe table and updates user recipe Ids
 * 
 * @param {object} recipe the recipe to add to db
 * @param {string} userId the user's Id
 * @param {array} recipeIds the user's existing recipeIds. The new recipe will be added to this array and update the User in db.
 * @returns the recipeId if created, otherwise null
 */
export async function AddRecipeToDB(recipe, userId, recipeIds) {
  const recipeRef = firebase.database().ref("Recipe").push();
  return new Promise( async resolve => {
    (await recipeRef).set(recipe).then(async () => {
      const userRef = firebase.database().ref("User/" + userId);
      const recipeId = recipeRef.toString().replace("https://r-store-v1-default-rtdb.firebaseio.com/Recipe/", "");
      recipeIds.push(recipeId);
      await userRef.update({ recipeIds: recipeIds});
      resolve(recipeId);
    }).catch(() => {
      resolve(null);
    });
  });
}

/**
 * Remove recipe from recipe table and updates user recipe Ids
 * 
 * @param {object} recipeId the recipe id to remove from db and user
 * @param {string} userId the user's Id
 * @param {array} recipeIds the user's existing recipeIds. The new recipe will be added to this array and update the User in db.
 * @returns the recipeId if created, otherwise null
 */
export async function RemoveRecipeFromDB(recipeId, userId, recipeIds) {
  return new Promise( async (resolve, reject) => {
    await firebase.database().ref("Recipe/" + recipeId).set(null).then(async () => {
      const userRef = firebase.database().ref("User/" + userId);
      recipeIds.splice(recipeIds.indexOf(recipeId), 1);
      await userRef.update({ recipeIds: recipeIds});
      resolve(true);
    }).catch(() => {
      reject(new Error("db fail")); 
    });
  });
}

/**
 * Updates the recipe in the db
 * 
 * @param {object} recipe the updated recipe object
 */
export async function EditRecipeInDB(recipe) {
  const recipeRef = firebase.database().ref("Recipe/" + recipe.id);
  delete recipe.id;
  return new Promise(async (resolve, reject) => {
    recipeRef.set(recipe).then(() => {
      resolve(true);
    }).catch(() => {
      reject(new Error("db fail"));
    });
  });
  
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
