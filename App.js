
// import the screens we want to navigate
import Start from './components/Start';
import Chat from './components/Chat';

// import react Navigation
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

// Create the navigator
const navigator = createStackNavigator({
    Start: { screen: Start, navigationOptions: {title: ''} },
    Chat: { screen: Chat, navigationOptions: Chat.navigationOptions }
});

const navigatorContainer = createAppContainer(navigator);


// Export it as the root component
export default navigatorContainer;
