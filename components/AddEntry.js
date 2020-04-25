import React, { Component } from "react";
import  { View, TouchableOpacity, Text, StyleSheet, Platform }  from "react-native";
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from "../utils/helpers";
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { purple, white } from "../utils/colors";

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={
      Platform.OS ==="ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
    }>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 10,
    bike: 0,
    swim: 20,
    sleep: 0,
    eat: 0,
  }

  increment = (metric) => {
    const { max, step} =getMetricMetaInfo(metric)

    this.setState((state) =>{
      const count = state[metric] + step
      return {
        ...state,
        [metric]:count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    const {step} =getMetricMetaInfo(metric)
    this.setState((state) =>{
      const count = state[metric] - step
      return {
        ...state,
        [metric]:count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {

    this.setState(() =>{
      return {
        [metric]:value
      }
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    //update Redux
    // this.setState(() => ({
    //   run: 0,
    //   bike: 0,
    //   swim: 0,
    //   sleep: 0,
    //   eat: 0,
    // }))
    this.props.dispatch(addEntry({
      [key]:entry
    }))
    //Nevigate to Home

    //Save to DATABASE
    submitEntry({key,entry})
    //Clean local notification
  }

  reset =() => {
    const key = timeToString()

    //update Redux
    this.props.dispatch(addEntry({
      [key]:getDailyReminderValue()
    }))
    //route to homme
    removeEntry(key)
    //update db
  }
  render() {
    const metaInfo = getMetricMetaInfo()
    // return <View>{getMetricMetaInfo("bike").getIcon()}</View>;

    if(this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS === "ios" ? "ios-happy" : "md-happy"} size={100} />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
         <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest} = metaInfo[key]
          const value = this.state[key]
          //console.log({value})
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider value={value} onChange={(value) => this.slide(key,value)}
                    {...rest}
                  />
                : <UdaciSteppers value={value}
                                 onIncrement={(value) => this.increment(key)}
                                 onDecrement={(value) => this.decrement(key)}
                                 {...rest}
                  />}
            </View>
          )
        })}

        <SubmitBtn onPress={this.submit} />
        <Text>{JSON.stringify(this.state)}</Text>
      </View>
    )
  }
}

//StyleSheet
const styles = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginLeft: 30,
  marginRight: 30
  }
})

function mapStateToProps (state) {
  const key = timeToString()
  return{
    alreadyLogged: state[key] && typeof state[key].today ==='undefined'
  }
}
export default connect(mapStateToProps)(AddEntry)
