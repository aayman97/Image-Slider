import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View , Dimensions, FlatList,Image,Animated,findNodeHandle, TouchableOpacity} from 'react-native';

const images = {
  man:
    'https://images.pexels.com/photos/3147528/pexels-photo-3147528.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  women:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  kids:
    'https://images.pexels.com/photos/5080167/pexels-photo-5080167.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  skullcandy:
    'https://images.pexels.com/photos/5602879/pexels-photo-5602879.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
  help:
    'https://images.pexels.com/photos/2552130/pexels-photo-2552130.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500',
};
const data = Object.keys(images).map((i) => ({
  key: i,
  title: i,
  image: images[i],
  ref : React.createRef()
}));
const {width,height} = Dimensions.get("screen")

const Tabs = ({data,scrollX,onItemPressed}) => {
  const containerRef = React.createRef()
  const [measures,setMeasures] = React.useState([])
  React.useEffect(() => {
    
    let m = []
    data.forEach(element => {
    element.ref.current.measureLayout(containerRef.current,(x,y,width,height) => {
       m.push({x,y,width,height})
       if(m.length === data.length){
        setMeasures(m)
      }
      })
    });  

  }, [])
  return (
   
    <View 
    ref = {containerRef}
    style={{position: 'absolute',top : 100,width,flexDirection : 'row',flex : 1, justifyContent : 'space-evenly'}}>
     {
       data.map((item,index)=> {
       return(
         <Tab item = {item} ref = {item.ref} onItemPressed ={() => onItemPressed(index)} />
       )  
       })
     }

     {measures.length > 0 ? <Indicator measures = {measures} scrollX ={scrollX} data = {data}/> : null}
   </View>

  )
}

const Tab = React.forwardRef(({item,scrollX,onItemPressed},ref) => {
     return(
       <TouchableOpacity onPress = {onItemPressed}>
      <View ref = {ref}>
         <Text style={{fontSize : 84/data.length,color : 'white', fontWeight : '800'}} 
         > {item.title}</Text> 
      </View>
      </TouchableOpacity>
       )
}
)

const Indicator = ({measures,scrollX,data}) => {
  const inputRange = data.map((d,i) => {
     return i*width
  })
  const outputRangeWidth =  measures.map((measure,index) => measure.width)
  const outputRangeLeft =  measures.map((measure,index) => measure.x)
  const indicatorWidth = scrollX.interpolate(
    {  
      inputRange,
      outputRange:outputRangeWidth,
    }
  )
  const indicatorLeft = scrollX.interpolate(
    {  
      inputRange,
      outputRange:outputRangeLeft,
    }
  )


  return (
    <Animated.View
    style={{
     position : 'absolute',
     height : 4,
     width : indicatorWidth,
     left :  indicatorLeft,
     backgroundColor : 'white',
     bottom : -4,
     borderRadius : 10
    }}
    />
  )
}

export default function App() {
  const scrollX = React.useRef(new Animated.Value(0)).current
  const flatListRef =  React.useRef()
  const onItemPressed = React.useCallback(itemIndex => {
    flatListRef?.current?.scrollToOffset({
      offset : itemIndex*width
    })
  })
  return (
    <View style={styles.container}>
   
       <Animated.FlatList
       ref = {flatListRef}
       data = {data}
       renderItem = {({item,index}) => {
        return <View>
          <Image
          source = {{uri : item.image}}
          style={{width,height,resizeMode : 'cover'}}
          />
        </View>
       }}
       pagingEnabled
       horizontal
       bounces = {false}
       onScroll ={Animated.event(
         [{nativeEvent: {contentOffset: {x: scrollX}}}],
         {useNativeDriver : false}
       )}
       
       />

  
      <Tabs data = {data} scrollX = {scrollX} onItemPressed = {onItemPressed}/>

     
  </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
