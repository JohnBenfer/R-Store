import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, StatusBar, Platform, Image, ImageBackground, LayoutAnimation } from 'react-native';
import { Input, Button, Overlay, Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';
import { Pressable } from 'react-native';

export default class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      title: '',
      description: '',
      ingredients: [],
      directions: [],
    };
  }

  /**
   * Receives the current user as this.props.route.params.user
   */
  async componentDidMount() {

  }

  addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [6, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let images = this.state.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.setState({ images: images });
    }
  }

  takeImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let images = this.state.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.setState({ images: images });
    }
  }

  saveRecipe = async () => {
    console.log('saving recipe..');
    this.props.navigation.goBack();
  }

  render() {
    const { images, title } = this.state;
    return (
      <SafeAreaView>
        <View>
          <View style={styles.row}>
            <View style={styles.cancelButtonContainer}>
              <Button
                onPress={() => this.props.navigation.goBack()}
                title="Cancel"
                type="clear"
                titleStyle={styles.cancelButtonTitle}
                buttonStyle={{ backgroundColor: 'transparent' }}
              />
            </View>
            <View style={styles.saveButtonContainer}>
              <Button
                onPress={() => console.log('save')}
                title="Save"
                containerStyle={styles.saveButtonBorder}
                titleStyle={styles.saveButtonTitle}
                disabled={false}
              />
            </View>
          </View>
          <Button title='add image' onPress={this.addImage} />
          <Button title='take image' onPress={this.takeImage} />
          <View style={{ height: 250, marginVertical: 10, paddingVertical: 10 }}>
            <FlatList
              data={images}
              horizontal
              renderItem={(image, index) => {
                return (
                  <View style={{ overflow: 'visible', paddingVertical: 5}}>
                    <ImageBackground source={{ uri: image.item }} style={{ width: 220, height: 220, marginHorizontal: 5, overflow: 'visible' }}>
                      <Pressable style={{width: 25, height: 25, position: 'absolute', top: -5, right: -5}}>
                        <Button 
                          onPress={() => {
                            let newImages = images;
                            newImages.splice(images.indexOf(image.item), 1)
                            LayoutAnimation.easeInEaseOut();
                            this.setState({ images:  newImages});
                          }} 
                          title='x' 
                          containerStyle={{borderRadius: 20}} titleStyle={{fontSize: 14}} 
                          buttonStyle={{backgroundColor: 'red', overflow: 'visible', marginTop: -7}}/>
                      </Pressable>
                    </ImageBackground>
                  </View>
                );
              }}
              keyExtractor={(image, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 0 }}
              snapToAlignment={"start"}
              snapToInterval={230}
              decelerationRate={0.993}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#f2f2f2',
    marginBottom: 10
  },
  cancelButtonContainer: {
    width: '20%',
  },
  cancelButtonTitle: {
    fontSize: 14,
    marginVertical: -2,
  },
  saveButtonContainer: {
    width: '20%',
    position: 'absolute',
    right: 8,
  },
  saveButtonBorder: {
    borderRadius: 20,
  },
  saveButtonTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: -2,
  },
  row: {
    flexDirection: 'row',
  },
});
