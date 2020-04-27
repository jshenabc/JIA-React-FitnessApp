import 'react-native-gesture-handler';
import React from 'react'
import { View, Platform } from 'react-native';
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import History from './components/History'
import { purple, white } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const RouteConfigs = {
  History:{
    name: "History",
    component: History,
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />, title: 'History'}
  },
  AddEntry:{
    component: AddEntry,
    name: "Add Entry",
    options: {tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />, title: 'Add Entry'}
  }
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      padding: 10,
      height: 90,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
  };

  const Tab = Platform.OS === 'ios'
          ? createBottomTabNavigator()
          : createMaterialTopTabNavigator()

export default class App extends React.Component {
render() {
    const store = createStore(reducer)
    return (
      <Provider store={store}>
        <NavigationContainer>
           <Tab.Navigator {...TabNavigatorConfig}>
               <Tab.Screen {...RouteConfigs['History']} />
               <Tab.Screen {...RouteConfigs['AddEntry']} />
           </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}
