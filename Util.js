import { UserPath, RecipesPath, CookbooksPath } from './Constants';
import * as FileSystem from 'expo-file-system';
import * as firebase from 'firebase';
import userReducer from './redux/reducers/userReducer';


// -------------------------------------------------------------------------------- User --------------------------------------------------------------------------------

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

/** ------------------ Works ------------------
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

/** ------------------ Works ------------------
 * Checks for email address in DB
 * 
 * @param {string} email user email address
 * @returns true if duplicate, otherwise false
 */
export async function IsEmailDuplicate(email) {
  let existingUsers;
  const userRef = firebase.database().ref("User");
  return new Promise(async resolve => {
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
  return new Promise(async (resolve, reject) => {
    await userRef.orderByChild('email').equalTo(email.toLowerCase()).once('value').then((users) => {
      const userString = JSON.stringify(users);
      if (!userString || userString === 'null') {
        reject(new Error("no user found"));
      } else {
        let returnUser;
        users.forEach((u) => {
          returnUser = { ...u.val(), id: u.key }
        });
        console.log("returnUser:");
        console.log(returnUser);
        resolve(returnUser);
      }
    });
  });
}

// -------------------------------------------------------------------------------- Recipes --------------------------------------------------------------------------------

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

/** ------------------ Works ------------------
 * Gets the recipes from the database from the ids. If ids are empty then use userId
 * 
 * @param {array} recipeIds the recipe ids to retrieve
 * @param {string} userId the user to get recipes for if recipeIds is empty
 * @returns the array of recipes
 */
export async function GetRecipesFromDB(recipeIds, userId) {
  const recipeRef = firebase.database().ref("Recipe");
  console.log('recipeIds: ');
  console.log(recipeIds);
  if (!recipeIds || recipeIds.length === 0) {
    const recipeIdsRef = firebase.database().ref("User/" + userId + "/recipeIds");
    return new Promise(async (resolve, reject) => {
      recipeIdsRef.once('value').then((ids) => {
        if (ids.val() === 'null' || !ids.val()) {
          reject(new Error("Invalid user id"));
        }
        let promises = ids.val().map(async (id) => {
          return recipeRef.child(id).once("value").catch(() => console.log("invalid recipe: " + id));
        });
        Promise.all(promises).then(async (snapshots) => {
          let recipeBuilder = [];
          snapshots.forEach((recipe) => {
            recipeBuilder.push({ id: recipe.key, ...recipe.val() });
          });
          let recipesToReturn = [];
          console.log("where am I?");
          recipeBuilder.forEach(async (recipe) => {
            console.log(recipe.images?.length);
            if (recipe.images > 0 || recipe.images?.length > 0) {
              await getImagesFromDB(recipe.id, recipe.images?.length).then((images) => {
                recipe.images = images;
                console.log("made it here");
                console.log(images);
                recipesToReturn.push(recipe);
              });
            } else {
              recipe.images = [];
              recipesToReturn.push(recipe);
            }
          });
          resolve(recipesToReturn);
        });
      });
    });
  } else {
    return new Promise(async resolve => {
      let promises = recipeIds.map(async (id) => {
        return recipeRef.child(id).once("value").catch(() => console.log("invalid recipe: " + id));
      });
      Promise.all(promises).then(async (snapshots) => {
        let recipeBuilder = [];
        snapshots.forEach((recipe) => {
          recipeBuilder.push({ id: recipe.key, ...recipe.val() });
        });

        let recipesToReturn = [];
        console.log("where am I?  2");
        recipeBuilder.forEach(async (recipe) => {
          console.log(recipe.images?.length);
          if (recipe.images > 0 || recipe.images?.length > 0) {
            await getImagesFromDB(recipe.id, recipe.images?.length).then((images) => {
              recipe.images = images;
              console.log("made it here  2");
              console.log(images);
              recipesToReturn.push(recipe);
            });
          } else {
            recipe.images = [];
            recipesToReturn.push(recipe);
          }
        });
        resolve(recipesToReturn);
      });
    });
  }
}

/** ------------------ Works ------------------
 * Adds the new recipe to recipe table and updates user recipe Ids
 * 
 * @param {object} recipe the recipe to add to db
 * @param {string} userId the user's Id
 * @param {array} recipeIds the user's existing recipeIds. The new recipe will be added to this array and update the User in db.
 * @returns the recipeId if created, otherwise null
 */
export async function AddRecipeToDB(recipe, userId, recipeIds) {
  const recipeRef = firebase.database().ref("Recipe").push();
  const recipeId = recipeRef.toString().replace("https://r-store-v1-default-rtdb.firebaseio.com/Recipe/", "");
  if (recipe.images && recipe.images.length > 0) {
    addImagesToDB(recipe.images, recipeId, 0);
  }
  return new Promise(async resolve => {
    (await recipeRef).set(recipe).then(async () => {
      const userRef = firebase.database().ref("User/" + userId);
      recipeIds.push(recipeId);
      await userRef.update({ recipeIds: recipeIds });
      resolve(recipeId);
    }).catch((e) => {
      console.log('error in catch');
      console.log(e);
      resolve(e);
    });
  });
}

async function addImagesToDB(images, recipeId, startIndex) {
  const storageRef = firebase.storage().ref();
  if (images.length < 1 || !images) {
    return;
  }
  images.forEach(async (image, i) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = storageRef.child(`recipes/${recipeId}/${i + startIndex}.jpg`);
    imageRef.put(blob).then(() => {
      console.log("added image!");
    });
  });
}

async function getImagesFromDB(recipeId, imageCount) {
  const storageRef = firebase.storage().ref();
  if (!imageCount || imageCount < 1) {
    return;
  }
  let imageRefs = [];
  for (let i = 0; i < imageCount; i++) {
    imageRefs.push(storageRef.child(`recipes/${recipeId}/${i}.jpg`));
  }
  console.log("here in images?");
  let promises = imageRefs.map((ref) => {
    console.log('ref in images');
    ref.getDownloadURL().then(() => {
      console.log("downloaded..");
    }).catch(() => {
      console.log("download failed");
    });
  })
  return Promise.all(promises);
}

async function deleteImageFromDB(recipeId, imageIndex) {

}

/** ------------------ Works ------------------
 * Remove recipe from recipe table and updates user recipe Ids
 * 
 * @param {object} recipeId the recipe id to remove from db and user
 * @param {string} userId the user's Id
 * @param {array} recipeIds the user's existing recipeIds. The new recipe will be added to this array and update the User in db.
 * @returns the recipeId if created, otherwise null
 */
export async function RemoveRecipeFromDB(recipeId, userId, recipeIds) {
  return new Promise(async (resolve, reject) => {
    await firebase.database().ref("Recipe/" + recipeId).set(null).then(async () => {
      const userRef = firebase.database().ref("User/" + userId);
      recipeIds.splice(recipeIds.indexOf(recipeId), 1);
      await userRef.update({ recipeIds: recipeIds });
      resolve(true);
    }).catch(() => {
      reject(new Error("db fail"));
    });
  });
}

/** ------------------ Works ------------------
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


// -------------------------------------------------------------------------------- Cookbooks --------------------------------------------------------------------------------

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
 * Gets the cookbooks from the database. If the cookbookIds array is empty, then retrieve the cookbooks based on the userId.
 * 
 * @param {array} cookbookIds the cookbook ids to retrieve. If empty, use userId.
 * @param {string} userId the user's id to find cookbooks for if cookbook Ids are empty.
 * @returns the array of cookbooks
 */
export async function GetCookbooksFromDB(cookbookIds, userId) {
  const cookbookRef = firebase.database().ref("Cookbook");
  if (!cookbookIds || cookbookIds.length === 0) {
    const cookbookIdsRef = firebase.database().ref("User/" + userId + "/cookbookIds");

    cookbookIdsRef.once('value').then((ids) => {
      console.log('cookbookIds from user in db: ');
      console.log(ids.val());
      return ids; // get cookbooks from ids now
    });
  } else {
    let promises = cookbookIds.map(async (id) => {
      return cookbookRef.child(id).once("value").catch(() => console.log("invalid cookbook: " + id));
    });
    Promise.all(promises).then(async (snapshots) => {
      console.log("cookbooks from ids: ");
      console.log(snapshots.values());
      return snapshots.values();
    });
  }
}

/**
 * Add new cookbook to db and update user's cookbook ids.
 * 
 * @param {object} cookbook the cookbook to add to db
 * @param {string} userId the user's id
 * @param {array} cookbookIds the existing cookbook ids for the user
 * @returns the new cookbook id
 */
export async function AddCookbookToDB(cookbook, userId, cookbookIds) {
  const cookbookRef = firebase.database().ref("Cookbook").push();
  return new Promise(async resolve => {
    (await cookbookRef).set(cookbook).then(async () => {
      const userRef = firebase.database().ref("User/" + userId);
      const cookbookId = cookbookRef.toString().replace("https://r-store-v1-default-rtdb.firebaseio.com/Cookbook/", "");
      cookbookIds.push(cookbookId);
      await userRef.update({ cookbookIds: cookbookIds });
      resolve(cookbookId);
    }).catch(() => {
      resolve(null);
    });
  });
}

/**
 * Updates the cookbook object in the db
 * 
 * @param {object} cookbook the updated cookbook object
 * @returns true if updated in db, otherwise throws error. 
 */
export async function EditCookbookInDB(cookbook) {
  const cookbookRef = firebase.database().ref("Cookbook/" + cookbook.id);
  delete cookbook.id;
  return new Promise(async (resolve, reject) => {
    cookbookRef.set(cookbook).then(() => {
      resolve(true);
    }).catch(() => {
      reject(new Error("db fail"));
    });
  });
}

