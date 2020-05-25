import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

const firebase = require('firebase');

export default class CustomActions extends React.Component {
    state = {
        image: null,
    };

    // upload image to Storage with fetch() and blob()
    uploadImageFetch = async(uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase
            .storage()
            .ref()
            .child("my-image");

        const snapshot = await ref.put(blob);

        return await snapshot.ref.getDownloadURL();
    }

    pickImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            }).catch(error => console.log(error));

            if (!result.cancelled) {
               const imageUrl = await this.uploadImageFetch(result.uri);
               this.props.onSend({ image: imageUrl });
                }
            }
        };


    takePhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                this.props.onSend({ image: imageUrl });
            }

        }
    };

    getLocation = async () => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status === 'granted') {
            let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));

            if (!result.cancelled) {
                this.props.onSend({
                    location: {
                      latitude: result.coords.latitude,
                      longitude: result.coords.longitude
                    }
                });
            }
        }
    };

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        return this.pickImage();
                    case 1:
                        return this.takePhoto();
                    case 2:
                        return this.getLocation();
                    default:
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity style={[styles.container]}
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Let’s you choose to send an image or your geolocation."
                accessibilityRole="button"
                onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};
