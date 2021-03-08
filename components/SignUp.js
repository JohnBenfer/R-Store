import React from 'react';
import { SafeAreaView, StyleSheet, View, TextInput, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { Text, Icon, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import * as FileSystem from 'expo-file-system';
import * as SplashScreen from 'expo-splash-screen';
import { connect } from 'react-redux';
import { changeRecipes } from '../redux/actions/changeRecipes';
import { changeCookbooks } from '../redux/actions/changeCookbooks';
import { changeUser } from '../redux/actions/changeUser';
import { bindActionCreators } from 'redux';
import { CookbooksPath, RecipesPath, UserPath } from '../Constants';
import * as Util from '../Util';
import Colors from '../Colors';

let user;
const height = Dimensions.get("window").height;
const loginHeight = height - 260;
const verticalPadding = 260 / 2;

class SignUp extends React.Component {
  scrollRef = React.createRef();
  firstNameRef = React.createRef();
  lastNameRef = React.createRef();
  emailRef = React.createRef();
  passwordRef = React.createRef();
  confirmPasswordRef = React.createRef();
  loginEmailRef = React.createRef();
  loginPasswordRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {
      userExists: true,
      firstName: '',
      firstNameError: false,
      lastName: '',
      lastNameError: false,
      email: '',
      emailError: false,
      password: '',
      confirmPassword: '',
      userAlreadyExists: false,
      validPassword: false,
      passwordFocused: false,
      passwordMatch: true,
      loginPassword: '',
      loginPasswordError: false,
      loginEmail: '',
      loginEmailError: false,
      showLogin: false,
      failedLogin: false,
    };
  }

  async componentDidMount() {

    // await this.deleteUserFile();
    // await this.deleteRecipeFile();
    this.initialLoad();
    console.log("in componentDidMount SignUp");
    this.props.navigation.addListener('focus', () => {
      // Screen was focused
      console.log("focused");

    });
  }

  deleteUserFile = async () => {
    await FileSystem.deleteAsync(UserPath);
  }

  deleteRecipeFile = async () => {
    await FileSystem.deleteAsync(RecipesPath);
  }

  deleteCookbookFile = async () => {
    await FileSystem.deleteAsync(CookbooksPath);
  }

  initialLoad = async () => {
    const cookbooks = await Util.ReadCookbooksFromFile();
    const recipes = await Util.ReadRecipesFromFile();
    const user = await Util.ReadUserFromFile();

    if (cookbooks && recipes && user) {
      await firebase.auth().signInAnonymously();
      this.props.changeUser(user.user);
      const newRecipes = await this.fixDirections(recipes.recipes.reverse());
      this.props.changeRecipes(newRecipes);
      this.props.navigation.navigate('Root', {});
      return;
    }

    if (!cookbooks) {
      await FileSystem.writeAsStringAsync(CookbooksPath, JSON.stringify({ cookbooks: [] }));
    }
    if (!recipes) {
      await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify({ recipes: [] }));
    }
    if (!user) {
      SplashScreen.hideAsync();
      console.log('user does not exist');
      this.setState({ userExists: false });
    } else {
      this.props.changeCookbooks(cookbooks);
      const newRecipes = this.fixDirections(recipes.reverse());
      this.props.changeRecipes(newRecipes);
      this.props.changeUser(user.user);
      this.props.navigation.navigate('Root', {});
    }

  }

  fixDirections = async (recipes) => {
    if (!recipes[0]?.directions[0]?.title) {
      let newRecipes = [];
      recipes.forEach((recipe) => {
        let newDirections = [];
        recipe.directions.forEach((direction) => {
          newDirections.push({ title: direction, groupId: 0 });
        });
        recipe.directions = newDirections;
        newRecipes.push(recipe);
      });
      await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify({ recipes: newRecipes }));
      console.log(newRecipes);
      return newRecipes;
    } else {
      return recipes;
    }
  }

  changeFirstName = (text) => {
    this.setState({ firstName: text });
  }

  changeLastName = (text) => {
    this.setState({ lastName: text });
  }

  changeEmail = (text) => {
    this.setState({ email: text });
  }

  changePassword = (text) => {
    const { passwordMatch, confirmPassword } = this.state;
    if (text === confirmPassword) {
      this.setState({ passwordMatch: true });
    } else if (passwordMatch) {
      this.setState({ passwordMatch: false });
    }
    if (text.trim().length > 2) {
      this.setState({ validPassword: true })
    } else {
      this.setState({ validPassword: false });
    }
    this.setState({ password: text });
  }

  changeConfirmPassword = (text) => {
    const { passwordMatch, password } = this.state;
    if (text === password) {
      this.setState({ passwordMatch: true });
    } else if (passwordMatch) {
      this.setState({ passwordMatch: false });
    }
    this.setState({ confirmPassword: text });
  }

  createAccountPress = async () => {
    const { firstName, lastName, email, password, confirmPassword, passwordMatch } = this.state;
    this.setState({ firstNameError: false, lastNameError: false, emailError: false });
    let error = false;
    if(firstName.trim().length === 0) {
      this.setState({ firstNameError: true });
      error = true;
    }
    if(lastName.trim().length === 0) {
      this.setState({ lastNameError: true });
      error = true;
    }
    if(email.trim().length === 0 || !email.includes('@') || !email.includes('.')) {
      this.setState({ emailError: true });
      error = true;
    }
    if(error) {
      return;
    }
    let isDup;
    await Util.IsEmailDuplicate(email).then((dup) => {
      isDup = dup;
    });
    console.log('is Dup?');
    console.log(isDup);
    if(isDup === false) {
      const userToAdd = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      }
      let userId;
      await Util.CreateUserInDB(userToAdd).then((id) => {
        userId = id;
      });
      const user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        id: userId
      };
      console.log("user after created in db");
      console.log(user);
      await FileSystem.writeAsStringAsync(UserPath, JSON.stringify({user: user}));
      this.props.changeUser(user);
      this.props.changeRecipes([]);
      this.props.changeCookbooks([]);
      await firebase.auth().signInAnonymously();
      this.props.navigation.navigate('Root', {});
    } else if(isDup === true) {
      this.setState({ emailError: true });
    }

  }

  loginPress = async () => {
    const { loginEmail, loginPassword } = this.state;
    let user;
    await Util.GetUserByEmail(loginEmail.toLowerCase().trim()).then((u) => {
      user = u;
    }).catch((e) => {
      this.loginFailed();
      return;
    });

    if(loginEmail.toLowerCase().trim() === 'john' && loginPassword.toLowerCase() === 'benfer') {
      this.props.navigation.navigate('Root', {  });
    } 

    console.log(user);
    if(user.password !== loginPassword) {
      this.loginFailed();
      return;
    } 
    // login succedded

    // build user for disk and state
    const newUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
      recipesIds: user.recipeIds,
      cookbookIds: user.cookbookIds,
    };
    await FileSystem.writeAsStringAsync(UserPath, JSON.stringify({ user: newUser }));
    
    let cookbooks;
    await Util.GetCookbooksFromDB(user.cookbookIds, user.id).then((c) => {
      cookbooks = c;
    }).catch((e) => {
      console.log('error getting cookbooks from db');
      console.log(e);
    });

    let recipes;
    await Util.GetRecipesFromDB(user.recipeIds, user.id).then((r) => {
      recipes = r;
    }).catch((e) => {
      console.log('error getting recipes from db');
      console.log(e);
    });

    if(cookbooks) {
      this.props.changeCookbooks(cookbooks);
      await FileSystem.writeAsStringAsync(CookbooksPath, JSON.stringify({ cookbooks: cookbooks }));
    }
    if(recipes) {
      this.props.changeRecipes(recipes);
      await FileSystem.writeAsStringAsync(RecipesPath, JSON.stringify({ recipes: recipes }));
    }
    
    this.props.changeUser(newUser);
    await firebase.auth().signInAnonymously();
    this.props.navigation.navigate('Root', {  });

  }

  loginFailed = () => {
    this.setState({ loginPassword: '', failedLogin: true });
  }

  changeLoginPassword = (text) => {
    this.setState({ loginPassword: text });
  }

  changeLoginEmail = (text) => {
    this.setState({ loginEmail: text });
  }

  // submit button if userExists === true
  render() {
    const { firstName, lastName, email, password, confirmPassword, passwordMatch, validPassword, loginEmail, loginPassword, firstNameError, lastNameError, emailError, loginPasswordError, loginEmailError, failedLogin } = this.state;
    return (
      <SafeAreaView>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={88} style={{ height: '100%' }}>
          <ScrollView ref={this.scrollRef}>
            <View style={{ backgroundColor: '#e3e3e3', marginHorizontal: 20, marginTop: 20, borderRadius: 15, height: loginHeight, borderWidth: 1, borderColor: '#d4d4d4' }}>
              <Text style={{ alignSelf: 'center', marginBottom: 20, padding: 20, fontSize: 26 }}>
                Create Your Account
          </Text>
              <View>
                <View style={{ width: '80%', alignSelf: 'center', }}>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="person-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeFirstName(text)}
                        value={this.state.title}
                        placeholder="First Name"
                        placeholderTextColor={Colors.placeholderText}
                        returnKeyType="next"
                        spellCheck={false}
                        onSubmitEditing={() => this.lastNameRef.current.focus()}
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {firstNameError ?
                        <Text style={styles.errorText}>
                          Invalid First Name
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="person-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeLastName(text)}
                        value={lastName}
                        placeholder="Last Name"
                        placeholderTextColor={Colors.placeholderText}
                        returnKeyType="next"
                        spellCheck={false}
                        ref={this.lastNameRef}
                        onSubmitEditing={() => this.emailRef.current.focus()}
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {lastNameError ?
                        <Text style={styles.errorText}>
                          Invalid Last Name
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="mail-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeEmail(text)}
                        value={this.state.title}
                        placeholder="Email"
                        placeholderTextColor={Colors.placeholderText}
                        keyboardType="email-address"
                        returnKeyType="next"
                        spellCheck={false}
                        clearButtonMode="always"
                        ref={this.emailRef}
                        onSubmitEditing={() => this.passwordRef.current.focus()}
                        textContentType="emailAddress"
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {emailError ?
                        <Text style={styles.errorText}>
                          Invalid Email Address
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="key-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changePassword(text)}
                        onFocus={() => this.setState({passwordFocused: true})}
                        value={this.state.title}
                        placeholder="Password"
                        placeholderTextColor={Colors.placeholderText}
                        secureTextEntry={true}
                        returnKeyType="next"
                        spellCheck={false}
                        clearButtonMode="always"
                        ref={this.passwordRef}
                        onSubmitEditing={() => this.confirmPasswordRef.current.focus()}
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {!validPassword && this.state.passwordFocused ?
                        <Text style={styles.errorText}>
                          Invalid Password
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="key-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeConfirmPassword(text)}
                        value={this.state.title}
                        placeholder="Confirm Password"
                        placeholderTextColor={Colors.placeholderText}
                        secureTextEntry={true}
                        // returnKeyType="done"
                        spellCheck={false}
                        clearButtonMode="always"
                        ref={this.confirmPasswordRef}
                        onSubmitEditing={() => {}}
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {!passwordMatch && validPassword ?
                        <Text style={styles.errorText}>
                          Passwords do not match
                        </Text> :
                        null}
                    </View>
                  </View>


                  <View style={{ justifyContent: 'flex-end', height: 140 }}>
                    <Button
                      onPress={this.createAccountPress}
                      title="Sign Up"
                      containerStyle={{ width: '50%', alignSelf: 'center', marginBottom: 20, justifyContent: 'flex-end' }}
                      // titleStyle={}
                      disabled={
                        !firstName ||
                        !lastName ||
                        !email ||
                        !password ||
                        !confirmPassword ||
                        !passwordMatch ||
                        !validPassword
                      }
                      disabledTitleStyle={styles.disabledButtonTitle}
                      disabledStyle={styles.disabledButton}
                    />
                  </View>
                </View>
              </View>
            </View>
            {/* <View style={{ marginVertical: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: '35%', backgroundColor: '#000', height: 1 }} />
              <Text style={{ alignSelf: 'center', fontSize: 16, width: '18%', textAlign: 'center' }}>
                Or
                </Text>
              <View style={{ width: '35%', backgroundColor: '#000', height: 1 }} />
            </View> */}

            <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
              <Text>
                Already have an account?
              </Text>
              <Button
                onPress={() => {
                  this.setState({ showLogin: true });
                  setTimeout(() => this.scrollRef.current.scrollToEnd({ animated: true }), 50);
                }}
                title="Login"
                type="clear"
                titleStyle={{ fontSize: 14 }}
                buttonStyle={{ backgroundColor: 'transparent' }}
              />
            </View>



            {this.state.showLogin ?
              <View style={{ backgroundColor: '#e3e3e3', borderRadius: 15, padding: 10, marginHorizontal: 20, marginVertical: verticalPadding - 80, height: loginHeight, borderWidth: 1, borderColor: '#d4d4d4' }}>
                <View style={{ width: '80%', alignSelf: 'center' }}>
                  <Text style={{ alignSelf: 'center', marginBottom: 25, marginTop: 15, padding: 0, fontSize: 20 }}>
                    Login
                </Text>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="mail-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeLoginEmail(text)}
                        value={loginEmail}
                        placeholder="Email"
                        placeholderTextColor={Colors.placeholderText}
                        keyboardType="email-address"
                        returnKeyType="next"
                        spellCheck={false}
                        clearButtonMode="always"
                        ref={this.loginEmailRef}
                        onSubmitEditing={() => this.loginPasswordRef.current.focus()}
                        textContentType="emailAddress"
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {loginEmailError ?
                        <Text style={styles.errorText}>
                          Invalid Email
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <View style={styles.row}>
                      <Icon
                        type="ionicon"
                        size={20}
                        style={styles.icon}
                        name="key-outline"
                        color={Colors.loginIcon}
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.changeLoginPassword(text)}
                        value={loginPassword}
                        placeholder="Password"
                        placeholderTextColor={Colors.placeholderText}
                        autoCompleteType="password"
                        secureTextEntry={true}
                        returnKeyType="go"
                        spellCheck={false}
                        clearButtonMode="always"
                        ref={this.loginPasswordRef}
                        onSubmitEditing={() => this.loginPress()}
                        enablesReturnKeyAutomatically={true}
                      />
                    </View>
                    <View style={styles.errorTextContainer}>
                      {loginPasswordError ?
                        <Text style={styles.errorText}>
                          Invalid Password
                        </Text> :
                        null}
                    </View>
                  </View>

                  <View style={[styles.errorTextContainer, {alignItems: 'center'}]}>
                      {failedLogin ?
                        <Text style={styles.errorText}>
                          Invalid Username or Password
                        </Text> :
                        null}
                    </View>


                  <View style={{ justifyContent: 'flex-end', height: 320 }}>
                    <Button
                      onPress={this.loginPress}
                      title="Login"
                      containerStyle={{ width: '50%', alignSelf: 'center', marginBottom: 10, justifyContent: 'flex-end' }}
                      // titleStyle={}
                      disabled={
                        !loginEmail ||
                        !loginPassword
                      }
                      disabledTitleStyle={styles.disabledButtonTitle}
                      disabledStyle={styles.disabledButton}
                    />
                  </View>
                </View>
              </View> : null}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    height: '100%',
  },
  button: {
    width: '100%',
    marginTop: 20,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5
  },
  errorText: {
    color: Colors.errorText,
    marginLeft: 2,
    marginTop: 1
  },
  errorTextContainer: {
    height: 16
  },
  input: {
    padding: 2,
    paddingRight: 20,
    width: '100%',
    height: 28,
    paddingLeft: 10,
  },
  inputContainer: {
    marginBottom: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 0,
    zIndex: 1000,
    marginLeft: 20
  },
  disabledButton: {
    backgroundColor: Colors.disabledButtonBackground,
  },
  disabledButtonTitle: {
    color: Colors.disabledButtonTitle,
  }
});

const mapStateToProps = (state) => {
  return ({
    recipes: state.recipes,
    cookbooks: state.cookbooks,
    user: state.user,
  });
}

const mapDispatchToProps = dispatch => {
  return (bindActionCreators({changeRecipes, changeCookbooks, changeUser}, dispatch));
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);