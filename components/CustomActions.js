import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');

export default class CustomActions extends React.Component {
    state = {
        image: null,
    };

    /**
     * Uploads image to Storage with fetch() and blob()
     * @async
     * @function uploadImageFetch
     * @param uri
     */

    uploadImageFetch = async(uri) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const ref = firebase
                .storage()
                .ref()
                .child("my-image");

            const snapshot = await ref.put(blob);

            return await snapshot.ref.getDownloadURL()
        } catch (error) {
            console.log(error.message)
        }
    };

    /**
     * Allows user to choose an image from library
     * @async
     * @function pickImage
     */

    pickImage = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: 'Images',
                }).catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({image: imageUrl});
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    /**
     * @async
     * @function takePhoto
     */


    takePhoto = async () => {
        try {
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
            if (status === 'granted') {
                let result = await ImagePicker.launchCameraAsync().catch(error => console.log(error));

                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({image: imageUrl});
                }

            }
        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * @async
     * @function getLocation
     */

    getLocation = async () => {
        try {
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
        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * @function onActionPress
     * @param buttonIndex
     */

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex = 3) => {
                try {
                    switch (buttonIndex) {
                        case 0:
                            return this.pickImage();
                        case 1:
                            return this.takePhoto();
                        case 2:
                            return this.getLocation();
                        default:
                    }
                } catch (error) {
                    console.log(error.message)
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity style={[styles.container]}
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Lets you choose to send an image or your geolocation."
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
