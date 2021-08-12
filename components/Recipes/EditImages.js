import React from 'react';
import { StyleSheet, View, FlatList, ImageBackground, LayoutAnimation, TextInput, Pressable } from 'react-native';
import { Input, Button, Overlay, Text, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';

export default class EditImages extends React.Component {
  photoListRef = React.createRef();

  addImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 3],
      quality: 0.1,
    });
    if (!result.cancelled) {
      let images = this.props.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.props.changeImages(images);
      setTimeout(() => this.photoListRef.current.scrollToIndex({ index: images.length - 1 }), 10);

    }
  }

  takeImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.cancelled) {
      let images = this.props.images;
      images.push(result.uri);
      LayoutAnimation.easeInEaseOut();
      this.props.changeImages(images);
      setTimeout(() => this.photoListRef.current.scrollToIndex({ index: images.length - 1 }), 1);
    }
  }

  render() {
    const { images } = this.props;
    return (
      <View>
        <View style={[styles.row, styles.photoRow]}>
          <View style={{ marginTop: 0, width: '15%', justifyContent: 'center' }}>
            <View style={{ margin: 0 }}>
              <Pressable onPress={this.takeImage}>
                <Icon type="ionicon" name="camera" size={25} color="#808080" reverse onPress={this.takeImage} />
              </Pressable>
            </View>
            <View style={{ margin: 0 }}>
              <Pressable onPress={this.addImage}>
                <Icon type="MaterialIcons" name="insert-photo" size={25} color="#808080" reverse onPress={this.addImage} />
              </Pressable>
            </View>
          </View>

          <View style={styles.photoList}>
            {images.length > 0 ? <FlatList
              data={images}
              horizontal
              renderItem={(image, index) => {
                return (
                  <View style={{ overflow: 'visible', paddingVertical: 5 }}>
                    <ImageBackground source={{ uri: image.item }} style={{ width: 190, height: 190, marginHorizontal: 5, overflow: 'visible' }}>
                      <Pressable style={{ width: 25, height: 25, position: 'absolute', top: -5, right: -5 }}>
                        <Button
                          onPress={() => {
                            let newImages = images;
                            newImages.splice(images.indexOf(image.item), 1)
                            LayoutAnimation.easeInEaseOut();
                            this.setState({ images: newImages });
                          }}
                          title='x'
                          containerStyle={{ borderRadius: 20 }} titleStyle={{ fontSize: 14 }}
                          buttonStyle={{ backgroundColor: 'red', overflow: 'visible', marginTop: -7 }} />
                      </Pressable>
                    </ImageBackground>
                  </View>
                );
              }}
              keyExtractor={(image, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              snapToAlignment={"center"}
              snapToInterval={200}
              decelerationRate={0.993}
              showsHorizontalScrollIndicator={false}
              ref={this.photoListRef}
            /> :
              <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                <Icon style={{}} type="MaterialIcons" name="insert-photo" size={165} color="#bfbfbf" onPress={this.addImage} />
              </View>}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photoRow: {
    marginTop: 10,
    marginLeft: 5,
    paddingHorizontal: 0,

  },
  photoList: {
    height: 200,
    marginVertical: 10,
    paddingVertical: 10,
    marginLeft: 10,
    width: Dimensions.get("window").width * 0.85 - 10,
    borderWidth: 0,
    backgroundColor: '#dbdbdb',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
  }
});
