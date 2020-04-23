import React, { Component } from "react";
import  { View, TouchableOpacity, Text }  from "react-native";
import { getMetricMetaInfo, timeToString } from "../utils/helpers";
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'

function SubmitBtn ({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>SUBMIT</Text>
    </TouchableOpacity>
  )
}

export default class AddEntry extends Component {
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
    const entry = this.setState

    //update Redux
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }))
    //Nevigate to Home

    //Save to DATABASE

    //Clean local notification
  }
  render() {
    const metaInfo = getMetricMetaInfo()
    // return <View>{getMetricMetaInfo("bike").getIcon()}</View>;
    return (
      <View>
         <DateHeader date={(new Date()).toLocaleDateString()}/>
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest} = metaInfo[key]
          const value = this.state[key]
          //console.log({value})
          return (
            <View key={key}>
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
